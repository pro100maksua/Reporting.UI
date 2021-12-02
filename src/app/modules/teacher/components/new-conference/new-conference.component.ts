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
import { Conference } from "../../models/conference";
import { CONFERENCE_TYPES } from "../../models/constants";
import { TeacherService } from "../../services/teacher.service";

@Component({
  selector: "app-new-conference",
  templateUrl: "./new-conference.component.html",
  styleUrls: ["./new-conference.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewConferenceComponent extends BaseComponent implements OnInit {
  public form: FormGroup;

  public conferenceTypeValues = CONFERENCE_TYPES;
  public selectedTypeValue: number;

  constructor(
    fb: FormBuilder,
    private teacherService: TeacherService,
    private cdr: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT)
    public dialogContext: TuiDialogContext<DialogResult, any>,
    public taigaService: TaigaService
  ) {
    super();

    this.form = fb.group({
      typeId: [null, Validators.required],
      subTypeId: [null],
      title: [null, Validators.required],
      location: [null],
      organizers: [null],
      coOrganizers: [null],
      dateRange: [null, Validators.required],
      numberOfParticipants: [null],
    });
  }

  async ngOnInit() {
    this.validateFormFields(this.form);

    this.subscribeToChanges();

    if (this.dialogContext.data.edit) {
      this.setData();
    }
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
    const formData = this.form.getRawValue();

    const data: Conference = {
      ...formData,
      startDate: formData.dateRange.from,
      endDate: formData.dateRange.to,
    };

    try {
      let conference: Conference;

      if (this.dialogContext.data.edit) {
        conference = await lastValueFrom(
          this.teacherService.updateConference(this.dialogContext.data.id, data)
        );
      } else {
        conference = await lastValueFrom(this.teacherService.createConference(data));
      }

      this.dialogContext.completeWith({ success: true, data: conference });
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data, { emitEvent: false });
  }

  private subscribeToChanges() {
    this.form.controls.typeId.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(async (typeId) => this.onTypeChange(typeId));
  }

  private onTypeChange(typeId: number) {
    this.selectedTypeValue = this.dialogContext.data.conferenceTypes.find(
      (t: ComboboxItem) => t.id === typeId
    )?.value;

    if (!this.selectedTypeValue) {
      return;
    }

    if (this.selectedTypeValue === CONFERENCE_TYPES.internal) {
      this.form.controls.subTypeId.setValidators(Validators.required);
    } else {
      this.form.controls.subTypeId.patchValue(null);
      this.form.controls.subTypeId.clearValidators();
    }

    this.form.controls.subTypeId.updateValueAndValidity();
  }
}
