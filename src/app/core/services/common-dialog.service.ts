import { Inject, Injectable, Injector } from "@angular/core";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { ConfirmationDialogComponent } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";

@Injectable({
  providedIn: "root",
})
export class CommonDialogService {
  constructor(
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector
  ) {}

  public openWarningDialog(message: string) {
    return this.dialogService
      .open<void>(message, {
        closeable: false,
        size: "s",
      })
      .toPromise();
  }

  public openRecordNotSelectedDialog(message?: string) {
    return this.openWarningDialog(message ?? "Будь ласка, виберіть запис.");
  }

  public openConfirmationDialog(message?: string) {
    return this.dialogService
      .open<boolean>(
        new PolymorpheusComponent(ConfirmationDialogComponent, this.injector),
        {
          closeable: false,
          size: "s",
          data: message,
        }
      )
      .toPromise();
  }
}
