import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  OnInit,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { GridApi, GridOptions, RowSelectedEvent } from "ag-grid-community";
import { lastValueFrom } from "rxjs";
import { DialogResult } from "src/app/core/models/dialog-result";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { getDateString } from "src/app/core/utils/functions";
import { BaseComponent } from "src/app/shared/components/base.component";
import { Dissertation } from "../../models/dissertation";
import { TeacherService } from "../../services/teacher.service";
import { NewDissertationComponent } from "../new-dissertation/new-dissertation.component";

@Component({
  selector: "app-dissertations",
  templateUrl: "./dissertations.component.html",
  styleUrls: ["./dissertations.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DissertationsComponent extends BaseComponent implements OnInit {
  public searchCtrl = new FormControl();

  public records: Dissertation[] = [];
  public selectedRecord: Dissertation;

  public gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Науковий керівник",
        field: "supervisor",
      },
      {
        headerName: "Спеціальність",
        field: "specialty",
      },
      {
        headerName: "Тема дисертації",
        field: "topic",
      },
      {
        headerName: "Термін закінчення",
        field: "deadline",
      },
      {
        headerName: "Дата захисту",
        field: "defenseDate",
        valueGetter: (params) => getDateString(params.data.defenseDate),
      },
      {
        headerName: "Місце захисту",
        field: "defensePlace",
      },
      {
        headerName: "Дата отримання диплому",
        field: "diplomaReceiptDate",
        valueGetter: (params) => getDateString(params.data.diplomaReceiptDate),
      },
    ],

    defaultColDef: {
      sortable: true,
      resizable: true,
      flex: 1,

      tooltipValueGetter: (params) => params.value,
    },

    rowSelection: "single",
    enableBrowserTooltips: true,

    getRowNodeId: (data) => data.id,
    immutableData: true,

    onRowSelected: (event) => this.selectRecord(event),

    onGridReady: async (event) => {
      this.recordsTable = event.api;
    },

    onCellFocused: (event) =>
      event.api
        .getModel()
        .getRow(event.rowIndex as number)
        ?.setSelected(true, true),
  };

  private recordsTable: GridApi;

  constructor(
    private teacherService: TeacherService,
    private commonDialogService: CommonDialogService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.getDissertations();

    this.subscribeToChanges();
  }

  public async addRecord() {
    const result = await this.openDissertationDialog(null, {
      add: true,
      dialogTitle: "Новий Запис",
    });

    if (result?.success) {
      this.getDissertations();
    }
  }

  public async editRecord() {
    if (!this.selectedRecord) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.openDissertationDialog(this.selectedRecord, {
      edit: true,
      dialogTitle: "Редагувати Запис",
    });

    if (result?.success) {
      this.getDissertations();
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
        await lastValueFrom(this.teacherService.deleteDissertation(this.selectedRecord.id));

        this.getDissertations();
      } catch (err: any) {
        this.teacherService.showRequestError(err);
      }
    }
  }

  public async refresh() {
    this.searchCtrl.patchValue(null);

    this.getDissertations();
  }

  private selectRecord(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedRecord = event.data;
  }

  private async getDissertations() {
    try {
      this.records = await lastValueFrom(this.teacherService.getUserDissertations());

      if (this.selectedRecord) {
        this.selectedRecord = this.records.find((e) => e.id === this.selectedRecord.id);
      }

      this.cdr.markForCheck();
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.searchCtrl.valueChanges.pipe(this.takeUntilDestroy()).subscribe((search) => {
      this.resetEntriesSelection();

      this.recordsTable.setQuickFilter(search);
    });
  }

  private resetEntriesSelection() {
    this.recordsTable?.deselectAll();
    this.selectedRecord = null;
  }

  private openDissertationDialog(data: any, options: any) {
    return lastValueFrom(
      this.dialogService.open<DialogResult>(
        new PolymorpheusComponent(NewDissertationComponent, this.injector),
        {
          closeable: false,
          label: options.dialogTitle,
          size: "l",
          data: { ...data, ...options },
        }
      )
    );
  }
}
