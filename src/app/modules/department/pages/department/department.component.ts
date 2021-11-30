import { ChangeDetectionStrategy, Component } from "@angular/core";
import { saveAs } from "file-saver";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { lastValueFrom } from "rxjs";
import { ErrorService } from "src/app/core/services/error.service";
import { DepartmentService } from "../../services/department.service";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentComponent {
  public tabIndex = 0;

  public open = false;

  constructor(
    private errorService: ErrorService,
    private departmentService: DepartmentService,
    private loaderService: NgxUiLoaderService
  ) {}

  public async downloadReports(reports: number[]) {
    this.open = false;

    this.loaderService.start();

    try {
      const file = await lastValueFrom(this.departmentService.downloadDepartmentReports(reports));

      saveAs(file);
    } catch (err: any) {
      this.errorService.showRequestError(err);
    }

    this.loaderService.stop();
  }
}
