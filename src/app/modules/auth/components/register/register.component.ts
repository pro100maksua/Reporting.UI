import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
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
import { Router } from "@angular/router";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { AuthService } from "src/app/core/services/auth.service";
import { ErrorService } from "src/app/core/services/error.service";
import { TaigaService } from "src/app/core/services/taiga.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { Department } from "../../models/department";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent extends BaseComponent implements OnInit {
  @Input() roles: ComboboxItem[];
  @Input() departments: Department[];

  @Output() loginClick = new EventEmitter();

  public emailAutocomplete: any = "username";
  public passwordAutocomplete: any = "new-password";

  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    public taigaService: TaigaService,
    private router: Router
  ) {
    super();

    this.form = fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, [Validators.required, this.checkPasswords]],
      departmentId: [null, Validators.required],
      roleId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.subscribeToChanges();
  }

  public async register() {
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
    };

    try {
      await this.authService.register(data);

      this.router.navigateByUrl("/");
    } catch (err: any) {
      this.errorService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.form.controls.password.valueChanges.subscribe(() =>
      this.form.controls.confirmPassword.updateValueAndValidity()
    );
  }

  private checkPasswords: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pass = control.parent?.get("password").value;
    const confirmPass = control.value;

    return pass === confirmPass
      ? null
      : { passwordDoesNotMatch: "Паролі не збігаються" };
  };
}
