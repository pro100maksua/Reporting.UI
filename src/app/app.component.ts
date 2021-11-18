import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { filter, lastValueFrom } from "rxjs";
import { User } from "./core/models/user";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public isAuth = false;

  public user: User;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.getLoggedInUser();
    }

    this.subscribeToChanges();
  }

  private async getLoggedInUser() {
    try {
      this.user = await lastValueFrom(this.authService.getLoggedInUser());
    } catch (err: any) {
      this.authService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => (this.isAuth = (e as RouterEvent).url === "/auth"));

    this.authService
      .onLoggedInUserUpdated()
      .subscribe(() => this.getLoggedInUser());
  }
}
