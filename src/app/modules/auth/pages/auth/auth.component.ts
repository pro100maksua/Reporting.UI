import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { AuthMode, FACULTY_VALUES } from "../../models/constants";
import { Department } from "../../models/department";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  public authModes = AuthMode;

  public authMode: AuthMode = AuthMode.Login;

  public roles: ComboboxItem[] = [];
  public departments: Department[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getDepartments();
    this.getRoles();
  }

  public onLogin() {
    this.authMode = AuthMode.Login;
  }

  public onRegister() {
    this.authMode = AuthMode.Register;
  }

  public onForgotPassword() {
    this.authMode = AuthMode.ForgotPassword;
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
}
