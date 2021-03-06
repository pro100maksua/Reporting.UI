import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TuiNotificationsService } from "@taiga-ui/core";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { BaseService } from "src/app/core/services/base.service";
import { LoginData } from "../models/login-data";
import { RegisterData } from "../models/register-data";
import { User } from "../models/user";
import { CommonDialogService } from "./common-dialog.service";

@Injectable({ providedIn: "root" })
export class AuthService extends BaseService {
  public user$ = new BehaviorSubject<User>(null);

  private loggedInUserUpdated = new Subject<void>();

  constructor(
    httpClient: HttpClient,
    notificationsService: TuiNotificationsService,
    commonDialogService: CommonDialogService,
    private router: Router
  ) {
    super(httpClient, notificationsService, commonDialogService);
  }

  public onLoggedInUserUpdated = () => this.loggedInUserUpdated as Observable<void>;

  public refreshLoggedInUser() {
    this.loggedInUserUpdated.next();
  }

  public login(data: LoginData) {
    return this.httpClient
      .post<any>(`${this.baseUrl}/Auth/Login`, data)
      .pipe(tap((r) => this.setToken(r.token)));
  }

  public register(data: RegisterData) {
    return this.httpClient
      .post<any>(`${this.baseUrl}/Auth/Register`, data)
      .pipe(tap((r) => this.setToken(r.token)));
  }

  public updateLoggedInUser(data: RegisterData) {
    return this.httpClient
      .put<any>(`${this.baseUrl}/Auth/LoggedInUser`, data)
      .pipe(tap((r) => this.setToken(r.token)));
  }

  public getLoggedInUser() {
    return this.httpClient
      .get<User>(`${this.baseUrl}/Auth/LoggedInUser`)
      .pipe(tap((u) => this.user$.next(u)));
  }

  public validateEmail(email: string, id?: number): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/Auth/ValidateEmail`, {
      id,
      value: email,
    });
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem("token");

    return !new JwtHelperService().isTokenExpired(token);
  }

  public getUserId() {
    const token = localStorage.getItem("token");

    return new JwtHelperService().decodeToken(token)?.nameid;
  }

  public getUserName() {
    const token = localStorage.getItem("token");

    return new JwtHelperService().decodeToken(token)?.unique_name;
  }

  public getUserRoles(): number[] {
    const token = localStorage.getItem("token");

    const role = new JwtHelperService().decodeToken(token)?.role;

    if (!role) {
      return [];
    }

    if (role instanceof Array) {
      return role?.map((r: string) => parseInt(r, 10));
    }

    return [parseInt(role, 10)];
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
