import { HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import {
  TuiDialogService,
  TuiNotification,
  TuiNotificationsService,
} from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { DialogResult } from "../models/dialog-result";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(
    private notificationsService: TuiNotificationsService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService
  ) {}

  public showRequestError(error: HttpErrorResponse) {
    if (error.error.message) {
      this.dialogService
        .open(error.error.message, {
          closeable: false,
          size: "s",
        })
        .subscribe();
    } else {
      this.notificationsService
        .show(error.message, {
          status: TuiNotification.Error,
          label: "Щось пішло не так",
        })
        .subscribe();
    }
  }
}
