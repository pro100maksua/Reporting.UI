import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { ErrorService } from "src/app/core/services/error.service";
import { BaseComponent } from "src/app/shared/components/base.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent implements OnInit {
  @Output() registerClick = new EventEmitter();
  @Output() forgotPasswordClick = new EventEmitter();

  public emailAutocomplete: any = "username";
  public passwordAutocomplete: any = "current-password";

  public form: FormGroup;

  public error: string;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.form = fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.subscribeToChanges();
  }

  public async login() {
    if (!this.form.valid) {
      return;
    }

    const data = this.form.value;

    try {
      await this.authService.login(data);

      this.router.navigateByUrl("/");
    } catch (err: any) {
      if (err.error?.message) {
        this.error = err.error?.message;
        this.cdr.markForCheck();
        return;
      }

      this.errorService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.form.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(() => (this.error = null));
  }
}
