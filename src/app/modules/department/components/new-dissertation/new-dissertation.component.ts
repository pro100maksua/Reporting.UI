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
import { NewDissertation } from "../../models/dissertation-new";
import { DepartmentService } from "../../services/department.service";

@Component({
  selector: "app-new-dissertation",
  templateUrl: "./new-dissertation.component.html",
  styleUrls: ["./new-dissertation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDissertationComponent extends BaseComponent implements OnInit {
  public form: FormGroup;

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
      authorName: [null, Validators.required],
      placeOfWork: [null, Validators.required],
      supervisor: [null, Validators.required],
      specialty: [null, Validators.required],
      topic: [null, Validators.required],
      deadline: [null],
      defenseDate: [null, Validators.required],
      defensePlace: [null, Validators.required],
      diplomaReceiptDate: [null],
    });
  }

  async ngOnInit() {
    this.validateFormFields(this.form);

    this.subscribeToChanges();

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
    const data: NewDissertation = this.form.getRawValue();

    try {
      if (this.dialogContext.data.edit) {
        await lastValueFrom(
          this.departmentService.updateDissertation(this.dialogContext.data.id, data)
        );
      } else {
        await lastValueFrom(this.departmentService.createDissertation(data));
      }

      this.dialogContext.completeWith({ success: true });
    } catch (err: any) {
      this.departmentService.showRequestError(err);
    }
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data);
  }

  private subscribeToChanges() {}
}
