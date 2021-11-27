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
import { NewCreativeConnection } from "../../models/creative-connection-new";
import { DepartmentService } from "../../services/department.service";

@Component({
  selector: "app-new-creative-connection",
  templateUrl: "./new-creative-connection.component.html",
  styleUrls: ["./new-creative-connection.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCreativeConnectionComponent extends BaseComponent implements OnInit {
  public form: FormGroup;

  public creativeConnectionTypes: ComboboxItem[] = [];

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
      typeId: [null, Validators.required],
      name: [null, Validators.required],
      address: [null],
    });
  }

  async ngOnInit() {
    this.validateFormFields(this.form);

    this.subscribeToChanges();

    this.creativeConnectionTypes = this.dialogContext.data.creativeConnectionTypes;

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
    const data: NewCreativeConnection = this.form.getRawValue();

    try {
      if (this.dialogContext.data.edit) {
        await lastValueFrom(
          this.departmentService.updateCreativeConnection(this.dialogContext.data.id, data)
        );
      } else {
        await lastValueFrom(this.departmentService.createCreativeConnection(data));
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
