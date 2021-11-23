import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { TuiDialogContext } from "@taiga-ui/core/interfaces";
import { POLYMORPHEUS_CONTEXT } from "@tinkoff/ng-polymorpheus";
import { lastValueFrom, map, Observable, tap } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { TaigaService } from "src/app/core/services/taiga.service";
import { FACULTY_VALUES } from "src/app/modules/auth/models/constants";
import { Department } from "src/app/modules/auth/models/department";
import { UsersService } from "src/app/modules/auth/services/users.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { ComboboxItem } from "../../models/combobox-item";
import { DialogResult } from "../../models/dialog-result";

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  styleUrls: ["./update-user.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserComponent extends BaseComponent implements OnInit {
  @Output() loginClick = new EventEmitter();

  public emailAutocomplete: any = "username";
  public passwordAutocomplete: any = "new-password";

  public form: FormGroup;

  public roles: ComboboxItem[];
  public departments: Department[];

  public error: string;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private dialogContext: TuiDialogContext<DialogResult, any>,
    public taigaService: TaigaService,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.form = fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [
        null,
        [Validators.required, Validators.email],
        this.uniqueValidator((value) =>
          this.authService.validateEmail(value, this.dialogContext.data.id)
        ),
      ],
      password: [null],
      confirmPassword: [null, this.checkPasswords],
      departmentId: [null, Validators.required],
      roleId: [null, Validators.required],
      ieeeXploreAuthorName: [null],
    });
  }

  async ngOnInit() {
    this.subscribeToChanges();

    this.setData();

    await Promise.all([this.getDepartments(), this.getRoles()]);
    this.cdr.markForCheck();
  }

  public cancel() {
    this.dialogContext.completeWith({ success: false });
  }

  public async save() {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.value;

    const data = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim(),
      password: formValue.password,
      departmentId: formValue.departmentId,
      roleId: formValue.roleId,
      ieeeXploreAuthorName: formValue.ieeeXploreAuthorName?.trim(),
    };

    try {
      await lastValueFrom(this.authService.updateLoggedInUser(data));

      this.authService.refreshLoggedInUser();

      this.dialogContext.completeWith({ success: true });
    } catch (err: any) {
      if (err.error?.message) {
        this.error = err.error?.message;
        this.cdr.markForCheck();
        return;
      }

      this.authService.showRequestError(err);
    }
  }

  private async getRoles() {
    try {
      this.roles = await this.usersService.getRoles();
    } catch (err: any) {
      this.usersService.showRequestError(err);
    }
  }

  private async getDepartments() {
    try {
      this.departments = await this.usersService.getDepartments(
        FACULTY_VALUES.fcit
      );
    } catch (err: any) {
      this.usersService.showRequestError(err);
    }
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data, { emitEvent: false });
  }

  private subscribeToChanges() {
    this.form.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(() => (this.error = null));

    this.form.controls.password.valueChanges.subscribe(() =>
      this.form.controls.confirmPassword.updateValueAndValidity()
    );
  }

  private checkPasswords: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pass = control.parent?.get("password").value;
    const confirmPass = control.value;

    return (!pass && !confirmPass) || pass === confirmPass
      ? null
      : { passwordDoesNotMatch: "Паролі не збігаються" };
  };

  private uniqueValidator =
    (validate: (value: string) => Observable<any>) =>
    (control: AbstractControl) =>
      validate(control.value).pipe(
        map((r) => (r?.message ? { notUnique: r.message } : null)),
        tap(() => this.cdr.markForCheck())
      );
}
