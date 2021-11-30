import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { lastValueFrom } from "rxjs";
import { DialogResult } from "src/app/core/models/dialog-result";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { TaigaService } from "src/app/core/services/taiga.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { ActivityIndicator } from "../../models/activity-indicator";
import { DepartmentService } from "../../services/department.service";
import { NewActivityIndicatorComponent } from "../new-activity-indicator/new-activity-indicator.component";

@Component({
  selector: "app-activity-indicators",
  templateUrl: "./activity-indicators.component.html",
  styleUrls: ["./activity-indicators.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityIndicatorsComponent extends BaseComponent implements OnInit {
  public yearCtrl = new FormControl();

  public form: FormGroup;

  public records: ActivityIndicator[] = [];
  public selectedRecord: ActivityIndicator;

  constructor(
    fb: FormBuilder,
    private departmentService: DepartmentService,
    private commonDialogService: CommonDialogService,
    public taigaService: TaigaService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.form = fb.group({
      year: [0],

      scientificPedagogicalWorkersCount: [0],

      fullTimeWorkersCount: [0],
      fullTimeDoctorOfScienceWorkersCount: [0],
      fullTimeCandidatesOfScienceWorkersCount: [0],
      fullTimeNoDegreeWorkersCount: [0],

      partTimeWorkersCount: [0],
      partTimeDoctorOfScienceWorkersCount: [0],
      partTimeCandidatesOfScienceWorkersCount: [0],
      partTimeNoDegreeWorkersCount: [0],

      scientificActivityWorkersCount: [0],
      scientificActivityDoctorOfScienceWorkersCount: [0],
      scientificActivityCandidatesOfScienceWorkersCount: [0],
      scientificActivityNoDegreeWorkersCount: [0],

      doctoralStudentsCount: [0],
      graduateStudentsCount: [0],
      graduateStudentsWithBreakFromProductionCount: [0],

      defendedCandidateDissertationsCount: [0],
      defendedDoctoralDissertationsCount: [0],

      stateBudgetFundFinancing: [0],
      stateBudgetFundNumberOfWorks: [0],

      atExpenseOfCustomersFinancing: [0],
      atExpenseOfCustomersNumberOfWorks: [0],

      internationalFundsFinancing: [0],
      internationalFundsNumberOfWorks: [0],

      completedWorksCount: [0],

      developmentResultsInProductionCount: [0],
      developmentResultsInLearningProcessCount: [0],

      applicationsForSecurityDocumentsCount: [0],
      receivedSecurityDocumentsCount: [0],

      inventorsCount: [0],

      conferencesSeminarsRoundTablesCount: [0],
    });
  }

  async ngOnInit() {
    await this.getActivityIndicators();

    this.subscribeToChanges();

    this.yearCtrl.patchValue(this.records[0]?.year);
  }

  public async addRecord() {
    const result = await this.openActivityIndicatorDialog(null, {
      add: true,
      dialogTitle: "Новий Запис",
    });

    if (result?.success) {
      this.getActivityIndicators();
    }
  }

  public async editRecord() {
    if (!this.selectedRecord) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.openActivityIndicatorDialog(this.selectedRecord, {
      edit: true,
      dialogTitle: "Редагувати Запис",
    });

    if (result?.success) {
      this.getActivityIndicators();
    }
  }

  public async deleteRecord() {
    if (!this.selectedRecord) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.commonDialogService.openConfirmationDialog();

    if (result) {
      try {
        await lastValueFrom(this.departmentService.deleteActivityIndicator(this.selectedRecord.id));

        await this.getActivityIndicators();
      } catch (err: any) {
        this.departmentService.showRequestError(err);
      }
    }
  }

  public async refresh() {
    this.getActivityIndicators();
  }

  private async getActivityIndicators() {
    try {
      this.records = await lastValueFrom(this.departmentService.getActivityIndicators());

      if (this.selectedRecord) {
        this.selectedRecord = this.records.find((e) => e.id === this.selectedRecord.id);

        if (this.selectedRecord) {
          this.setData(this.selectedRecord);
        }
      }

      if (!this.selectedRecord) {
        this.yearCtrl.patchValue(this.records[0]?.year);
      }

      this.cdr.markForCheck();
    } catch (err: any) {
      this.departmentService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.yearCtrl.valueChanges.pipe(this.takeUntilDestroy()).subscribe((year) => {
      this.selectedRecord = this.records.find((e) => e.year === year);

      if (this.selectedRecord) {
        this.setData(this.selectedRecord);
      }
    });
  }

  private openActivityIndicatorDialog(data: any, options: any) {
    return lastValueFrom(
      this.dialogService.open<DialogResult>(
        new PolymorpheusComponent(NewActivityIndicatorComponent, this.injector),
        {
          closeable: false,
          label: options.dialogTitle,
          size: "l",
          data: { ...data, ...options },
        }
      )
    );
  }

  private setData(record: ActivityIndicator) {
    const formData = Object.entries(record).reduce((obj: any, [key, value]) => {
      obj[key] = value.toString ? value.toString() : value;
      return obj;
    }, {});

    this.form.patchValue(formData);
  }
}
