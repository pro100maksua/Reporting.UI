import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { lastValueFrom, Observable, tap } from "rxjs";
import { BaseService } from "src/app/core/services/base.service";
import { LoginData } from "../models/login-data";
import { RegisterData } from "../models/register-data";

@Injectable({ providedIn: "root" })
export class AuthService extends BaseService {
  constructor(httpClient: HttpClient, private router: Router) {
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

  public validateEmail(email: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/Auth/ValidateEmail`, {
      value: email,
    });
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem("token");

    return !new JwtHelperService().isTokenExpired(token);
  }

  public getUserName() {
    const token = localStorage.getItem("token");

    return new JwtHelperService().decodeToken(token)?.unique_name;
  }

  public logout() {
    localStorage.removeItem("token");

    this.router.navigate(["auth"]);
  }

  public tokenGetter(): string {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem("token");

      return token;
    }

    this.router.navigate(["/auth"]);
    return null;
  }

  private setToken(token: string) {
    localStorage.setItem("token", token);
  }
}
