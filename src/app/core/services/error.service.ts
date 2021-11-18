import { HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import {
  TuiDialogService,
  TuiNotification,
  TuiNotificationsService,
} from "@taiga-ui/core";
import { CommonDialogService } from "./common-dialog.service";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(
    private notificationsService: TuiNotificationsService,
    private commonDialogService: CommonDialogService
  ) {}

  public showRequestError(error: HttpErrorResponse) {
    if (error.error?.message) {
      this.commonDialogService.openWarningDialog(error.error.message);
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
