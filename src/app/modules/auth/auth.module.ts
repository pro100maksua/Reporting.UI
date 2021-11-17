import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { UsersService } from "./services/users.service";

@NgModule({
  declarations: [AuthComponent, LoginComponent, RegisterComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule],
  providers: [UsersService],
})
export class AuthModule {}
