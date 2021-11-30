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
import { lastValueFrom } from "rxjs";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { DialogResult } from "src/app/core/models/dialog-result";
import { TaigaService } from "src/app/core/services/taiga.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { STUDENTS_SCIENTIFIC_WORK_TYPES, STUDENTS_WORK_TYPES } from "../../models/constants";
import { NewStudentsWorkEntry } from "../../models/students-work-entry-new";
import { TeacherService } from "../../services/teacher.service";

@Component({
  selector: "app-new-students-work-entry",
  templateUrl: "./new-students-work-entry.component.html",
  styleUrls: ["./new-students-work-entry.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewStudentsWorkEntryComponent extends BaseComponent implements OnInit {
  public form: FormGroup;

  public studentsWorkTypeValues = STUDENTS_WORK_TYPES;
  public studentsWorkTypes: ComboboxItem[] = [];
  public selectedTypeValue: number;

  public studentsScientificWorkTypeValues = STUDENTS_SCIENTIFIC_WORK_TYPES;
  public scientificWorkTypes: ComboboxItem[] = [];
  public selectedScientificWorkTypeValue: number;

  constructor(
    fb: FormBuilder,
    private teacherService: TeacherService,
    private cdr: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT)
    private dialogContext: TuiDialogContext<DialogResult, any>,
    public taigaService: TaigaService
  ) {
    super();

    this.form = fb.group({
      typeId: [null, Validators.required],
      scientificWorkTypeId: [null],
      scientificWorkName: [null],
      name: [null],
      group: [null],
      specialty: [null],
      place: [null],
      independently: [false],
    });
  }

  async ngOnInit() {
    this.validateFormFields(this.form);

    this.subscribeToChanges();

    this.studentsWorkTypes = this.dialogContext.data.studentsWorkTypes;
    this.scientificWorkTypes = this.dialogContext.data.scientificWorkTypes;

    if (this.dialogContext.data.edit) {
      this.setData();
    }

    this.cdr.markForCheck();
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
    const data: NewStudentsWorkEntry = this.form.getRawValue();

    try {
      if (this.dialogContext.data.edit) {
        await lastValueFrom(
          this.teacherService.updateStudentsWorkEntry(this.dialogContext.data.id, data)
        );
      } else {
        await lastValueFrom(this.teacherService.createStudentsWorkEntry(data));
      }

      this.dialogContext.completeWith({ success: true });
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data);
  }

  private subscribeToChanges() {
    this.form.controls.typeId.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(async (typeId) => this.onTypeChange(typeId));

    this.form.controls.scientificWorkTypeId.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(async (typeId) => this.onScientificWorkTypeChange(typeId));
  }

  private onTypeChange(typeId: number) {
    this.selectedTypeValue = this.studentsWorkTypes.find((t) => t.id === typeId)?.value;

    if (!this.selectedTypeValue) {
      return;
    }

    if (this.selectedTypeValue === STUDENTS_WORK_TYPES.participationInScientificWork) {
      this.form.controls.scientificWorkTypeId.setValidators(Validators.required);
    } else {
      this.form.controls.scientificWorkTypeId.patchValue(null);
      this.form.controls.scientificWorkTypeId.clearValidators();
    }

    if (
      this.selectedTypeValue === STUDENTS_WORK_TYPES.participationInCompetitions ||
      this.selectedTypeValue === STUDENTS_WORK_TYPES.receivedAwardsForTheResultsOfThe2ndRound ||
      this.selectedTypeValue ===
        STUDENTS_WORK_TYPES.participationInCompetitionsOfScientificWorksReceivedAwards ||
      this.selectedTypeValue ===
        STUDENTS_WORK_TYPES.participationInCompetitionsOfDiplomaAndMastersReceivedAwards
    ) {
      this.form.controls.name.setValidators(Validators.required);
      this.form.controls.group.setValidators(Validators.required);
      this.form.controls.specialty.setValidators(Validators.required);
      this.form.controls.place.setValidators(Validators.required);
    } else {
      this.form.controls.name.patchValue(null);
      this.form.controls.name.clearValidators();

      this.form.controls.group.patchValue(null);
      this.form.controls.group.clearValidators();

      this.form.controls.specialty.patchValue(null);
      this.form.controls.specialty.clearValidators();

      this.form.controls.place.patchValue(null);
      this.form.controls.place.clearValidators();
    }

    if (this.selectedTypeValue !== STUDENTS_WORK_TYPES.publishedArticleAbstracts) {
      this.form.controls.independently.patchValue(false);
    }

    this.form.controls.scientificWorkTypeId.updateValueAndValidity();
    this.form.controls.name.updateValueAndValidity();
    this.form.controls.group.updateValueAndValidity();
    this.form.controls.specialty.updateValueAndValidity();
    this.form.controls.place.updateValueAndValidity();
  }

  private onScientificWorkTypeChange(typeId: number) {
    this.selectedScientificWorkTypeValue = this.scientificWorkTypes.find(
      (t) => t.id === typeId
    )?.value;

    if (!this.selectedScientificWorkTypeValue) {
      return;
    }

    if (
      this.selectedScientificWorkTypeValue === STUDENTS_SCIENTIFIC_WORK_TYPES.theoreticalSeminar ||
      this.selectedScientificWorkTypeValue === STUDENTS_SCIENTIFIC_WORK_TYPES.scienceClub ||
      this.selectedScientificWorkTypeValue === STUDENTS_SCIENTIFIC_WORK_TYPES.problemGroup ||
      this.selectedScientificWorkTypeValue === STUDENTS_SCIENTIFIC_WORK_TYPES.otherForm
    ) {
      this.form.controls.scientificWorkName.setValidators(Validators.required);
    } else {
      this.form.controls.scientificWorkName.patchValue(null);
      this.form.controls.scientificWorkName.clearValidators();
    }

    this.form.controls.scientificWorkName.updateValueAndValidity();
  }
}
