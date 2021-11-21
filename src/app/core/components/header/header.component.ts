import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  OnInit,
} from "@angular/core";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { BaseComponent } from "src/app/shared/components/base.component";
import { DialogResult } from "../../models/dialog-result";
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { UpdateUserComponent } from "../update-user/update-user.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends BaseComponent implements OnInit {
  public user: User;

  public open = false;

  public items = [
    {
      title: "Оновити інфо",
      icon: faUser,
      action: () => this.updateUserInfo(),
    },
    { title: "Вихід", icon: faSignOutAlt, action: () => this.logout() },
  ];

  constructor(
    private authService: AuthService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToChanges();
  }

  private updateUserInfo() {
    this.dialogService
      .open<DialogResult>(
        new PolymorpheusComponent(UpdateUserComponent, this.injector),
        {
          closeable: false,
          size: "m",
          data: { ...this.user },
        }
      )
      .subscribe();
  }

  private logout() {
    this.authService.logout();
  }

  private subscribeToChanges() {
    this.authService.user$.pipe(this.takeUntilDestroy()).subscribe((u) => {
      this.user = u;
      this.cdr.markForCheck();
    });
  }
}
