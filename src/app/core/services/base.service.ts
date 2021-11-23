import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TuiNotification, TuiNotificationsService } from "@taiga-ui/core";
import { environment } from "src/environments/environment";
import { CommonDialogService } from "./common-dialog.service";

export class BaseService {
  protected baseUrl: string;

  constructor(
    protected httpClient: HttpClient,
    private notificationsService: TuiNotificationsService,
    private commonDialogService: CommonDialogService
  ) {
    this.baseUrl = environment.apiUrl;
  }

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
