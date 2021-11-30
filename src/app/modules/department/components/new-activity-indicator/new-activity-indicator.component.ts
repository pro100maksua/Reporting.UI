import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TuiDialogContext } from "@taiga-ui/core";
import { POLYMORPHEUS_CONTEXT } from "@tinkoff/ng-polymorpheus";
import { debounceTime, distinctUntilChanged, lastValueFrom } from "rxjs";
import { DialogResult } from "src/app/core/models/dialog-result";
import { TaigaService } from "src/app/core/services/taiga.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { NewActivityIndicator } from "../../models/activity-indicator-new";
import { DepartmentService } from "../../services/department.service";

@Component({
  selector: "app-new-activity-indicator",
  templateUrl: "./new-activity-indicator.component.html",
  styleUrls: ["./new-activity-indicator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewActivityIndicatorComponent extends BaseComponent implements OnInit {
  public form: FormGroup;

  public expandedAccordionItem: number;

  constructor(
    fb: FormBuilder,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT)
    public dialogContext: TuiDialogContext<DialogResult, any>,
    public taigaService: TaigaService
  ) {
    super();

    this.form = fb.group({
      year: [0, Validators.required],

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
    this.validateFormFields(this.form);

    this.subscribeToChanges();

    if (this.dialogContext.data.edit) {
      this.setData();
    } else {
      this.form.patchValue({ year: new Date().getFullYear() });
    }

    this.cdr.markForCheck();
  }

  public selectAccordionItem(n: number, event: any) {
    const isHeaderClicked = event.path.some((p: Element) => p?.className?.includes("header"));

    if (!isHeaderClicked) {
      return;
    }

    setTimeout(() => {
      this.expandedAccordionItem = this.expandedAccordionItem ? null : n;
      this.cdr.markForCheck();
    });
  }

  public validateFormFields(form: FormGroup) {
    for (const ctrl of Object.keys(form.controls)) {
      form.get(ctrl)?.markAsTouched();
    }
  }

  public cancel() {
    this.dialogContext.completeWith({ success: false });
  }

  public async save() {
    const data: NewActivityIndicator = this.form.getRawValue();

    try {
      if (this.dialogContext.data.edit) {
        await lastValueFrom(
          this.departmentService.updateActivityIndicator(this.dialogContext.data.id, data)
        );
      } else {
        await lastValueFrom(this.departmentService.createActivityIndicator(data));
      }

      this.dialogContext.completeWith({ success: true });
    } catch (err: any) {
      this.departmentService.showRequestError(err);
    }
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data);
  }

  private subscribeToChanges() {
    this.form.controls.year.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), this.takeUntilDestroy())
      .subscribe((year: number) => {
        if (year) {
          this.getActivityIndicator(year);
        }
      });
  }

  private async getActivityIndicator(year: number) {
    try {
      const activityIndicator = await lastValueFrom(
        this.departmentService.getActivityIndicator(year)
      );

      if (activityIndicator) {
        this.form.patchValue(activityIndicator);
      } else {
        this.form.reset({ year });
      }
    } catch (err: any) {
      this.departmentService.showRequestError(err);
    }
  }
}
