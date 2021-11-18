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
import { DialogResult } from "src/app/core/models/dialog-result";
import { TaigaService } from "src/app/core/services/taiga.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { Conference } from "../../models/conference";
import { TeacherService } from "../../services/teacher.service";

@Component({
  selector: "app-new-conference",
  templateUrl: "./new-conference.component.html",
  styleUrls: ["./new-conference.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewConferenceComponent extends BaseComponent implements OnInit {
  public form: FormGroup;

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
      title: [null, Validators.required],
      year: [null, Validators.required],
      location: [null],
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
    };

    try {
      let conference: Conference;

      if (this.dialogContext.data.edit) {
        conference = await lastValueFrom(
          this.teacherService.updateConference(this.dialogContext.data.id, data)
        );
      } else {
        conference = await lastValueFrom(
          this.teacherService.createConference(data)
        );
      }

      this.dialogContext.completeWith({ success: true, data: conference });
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data, { emitEvent: false });
  }

  private subscribeToChanges() {}
}
