import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { lastValueFrom, tap } from "rxjs";
import { BaseService } from "src/app/core/services/base.service";
import { LoginData } from "../models/login-data";
import { RegisterData } from "../models/register-data";

@Injectable({ providedIn: "root" })
export class AuthService extends BaseService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public login(data: LoginData) {
    return lastValueFrom(
      this.httpClient
        .post<any>(`${this.baseUrl}/Auth/Login`, data)
        .pipe(tap((r) => this.setToken(r.token)))
    );
  }

  public register(data: RegisterData) {
    return lastValueFrom(
      this.httpClient
        .post<any>(`${this.baseUrl}/Auth/Register`, data)
        .pipe(tap((r) => this.setToken(r.token)))
    );
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const jwtHelper = new JwtHelperService();

    return !jwtHelper.isTokenExpired(token);
  }

  public logout() {
    localStorage.removeItem("token");
  }

  private setToken(token: string) {
    localStorage.setItem("token", token);
  }
}
