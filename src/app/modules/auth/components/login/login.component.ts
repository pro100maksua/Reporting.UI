import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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
export class LoginComponent extends BaseComponent {
  @Output() registerClick = new EventEmitter();
  @Output() forgotPasswordClick = new EventEmitter();

  public emailAutocomplete: any = "username";
  public passwordAutocomplete: any = "current-password";

  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {
    super();

    this.form = fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
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
      this.errorService.showRequestError(err);
    }
  }
}
