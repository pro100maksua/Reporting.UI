import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public faSignOutAlt = faSignOutAlt;

  public userName: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }

  public logout() {
    this.authService.logout();
  }
}
