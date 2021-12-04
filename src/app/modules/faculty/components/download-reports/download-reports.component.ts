import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { TuiDialogContext } from "@taiga-ui/core";
import { POLYMORPHEUS_CONTEXT } from "@tinkoff/ng-polymorpheus";
import { DialogResult } from "src/app/core/models/dialog-result";
import { AuthService } from "src/app/core/services/auth.service";
import { TaigaService } from "src/app/core/services/taiga.service";
import { Department } from "src/app/modules/auth/models/department";
import { BaseComponent } from "src/app/shared/components/base.component";

@Component({
  selector: "app-download-reports",
  templateUrl: "./download-reports.component.html",
  styleUrls: ["./download-reports.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadReportsComponent extends BaseComponent implements OnInit {
  public form: FormGroup;

  public items = [
    { title: "Всі" },
    { title: "Додаток 1", value: 1 },
    { title: "Додаток 2", value: 2 },
    { title: "Додаток 3", value: 3 },
    { title: "Додаток 4", value: 4 },
    { title: "Додаток 5", value: 5 },
    { title: "Додаток 6", value: 6 },
    { title: "Додаток 7", value: 7 },
    { title: "Додаток 8", value: 8 },
    { title: "Додаток 9", value: 9 },
  ];

  private reportsFormArray: FormArray;

  constructor(
    fb: FormBuilder,
    authService: AuthService,
    @Inject(POLYMORPHEUS_CONTEXT)
    public dialogContext: TuiDialogContext<DialogResult, any>,
    public taigaService: TaigaService
  ) {
    super();

    this.reportsFormArray = fb.array(this.items.map(() => false));

    this.form = fb.group({
      departmentId: [authService.user$.value.departmentId, Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1)]],
      reports: this.reportsFormArray,
    });
  }

  get controls() {
    return this.reportsFormArray.controls as FormControl[];
  }

  ngOnInit() {
    this.subscribeToChanges();
  }

  public isAnyReportSelected() {
    return this.controls.some((c) => c.value);
  }

  public cancel() {
    this.dialogContext.completeWith({ success: false });
  }

  public save() {
    const selectedReports = this.items
      .filter((e, i) => e.value && this.controls[i].value)
      .map((e) => e.value);

    const data = { ...this.form.value, reports: selectedReports };

    this.dialogContext.completeWith({ success: true, data });
  }

  private subscribeToChanges() {
    this.reportsFormArray.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe((values: boolean[]) => {
        this.controls[0].patchValue(
          values.slice(1).every((v) => v),
          { emitEvent: false }
        );
      });

    this.controls[0].valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe((value) =>
        this.controls.slice(1).forEach((c) => c.patchValue(value, { emitEvent: false }))
      );

    this.controls.slice(1).forEach((c) =>
      c.valueChanges.pipe(this.takeUntilDestroy()).subscribe(() =>
        this.controls[0].patchValue(
          this.reportsFormArray.value.slice(1).every((v: boolean) => v),
          { emitEvent: false }
        )
      )
    );
  }
}
