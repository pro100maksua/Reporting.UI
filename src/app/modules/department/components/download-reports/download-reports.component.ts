import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/shared/components/base.component";

@Component({
  selector: "app-download-reports",
  templateUrl: "./download-reports.component.html",
  styleUrls: ["./download-reports.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadReportsComponent extends BaseComponent implements OnInit {
  @Output() download = new EventEmitter<any>();

  public yearCtrl = new FormControl(new Date().getFullYear(), [
    Validators.required,
    Validators.min(1),
  ]);

  public form: FormArray;

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

  constructor(fb: FormBuilder) {
    super();

    this.form = fb.array(this.items.map(() => false));
  }

  get controls() {
    return this.form.controls as FormControl[];
  }

  ngOnInit() {
    this.form.valueChanges.pipe(this.takeUntilDestroy()).subscribe((values: boolean[]) => {
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
          this.form.value.slice(1).every((v: boolean) => v),
          { emitEvent: false }
        )
      )
    );
  }

  public downloadReports() {
    const year = this.yearCtrl.value;

    const selectedReports = this.items
      .filter((e, i) => e.value && this.controls[i].value)
      .map((e) => e.value);

    this.download.emit({ reports: selectedReports, year });
  }
}
