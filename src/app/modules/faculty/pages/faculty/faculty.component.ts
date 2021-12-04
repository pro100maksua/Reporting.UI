import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from "@angular/core";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { saveAs } from "file-saver";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { lastValueFrom } from "rxjs";
import { DialogResult } from "src/app/core/models/dialog-result";
import { ErrorService } from "src/app/core/services/error.service";
import { FACULTY_VALUES } from "src/app/modules/auth/models/constants";
import { Department } from "src/app/modules/auth/models/department";
import { UsersService } from "src/app/modules/auth/services/users.service";
import { DownloadReportsComponent } from "../../components/download-reports/download-reports.component";
import { FacultyService } from "../../services/faculty.service";

@Component({
  selector: "app-faculty",
  templateUrl: "./faculty.component.html",
  styleUrls: ["./faculty.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent implements OnInit {
  public tabIndex = 0;

  public open = false;

  public departments: Department[] = [];

  constructor(
    private errorService: ErrorService,
    private facultyService: FacultyService,
    private usersService: UsersService,
    private loaderService: NgxUiLoaderService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector
  ) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  public openDownloadReportsDialog() {
    this.dialogService
      .open<DialogResult>(new PolymorpheusComponent(DownloadReportsComponent, this.injector), {
        closeable: false,
        size: "m",
        data: { departments: this.departments },
      })
      .subscribe((result) => {
        if (result.success) {
          this.downloadReports(result.data);
        }
      });
  }

  public async downloadReports(data: any) {
    const { departmentId, reports, year } = data;

    if (reports.length === 0) {
      return;
    }

    this.open = false;

    this.loaderService.start();

    try {
      const file = await lastValueFrom(
        this.facultyService.downloadFacultyReports(departmentId, reports, year)
      );

      saveAs(file);
    } catch (err: any) {
      this.errorService.showRequestError(err);
    }

    this.loaderService.stop();
  }

  private async getDepartments() {
    try {
      this.departments = await this.usersService.getDepartments(FACULTY_VALUES.fcit);
    } catch (err: any) {
      this.usersService.showRequestError(err);
    }
  }
}
