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
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { DialogResult } from "src/app/core/models/dialog-result";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { CreativeConnection } from "../../models/creative-connection";
import { DepartmentService } from "../../services/department.service";
import { NewCreativeConnectionComponent } from "../new-creative-connection/new-creative-connection.component";

@Component({
  selector: "app-creative-connections",
  templateUrl: "./creative-connections.component.html",
  styleUrls: ["./creative-connections.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreativeConnectionsComponent extends BaseComponent implements OnInit {
  public searchCtrl = new FormControl();

  public records: CreativeConnection[] = [];
  public selectedRecord: CreativeConnection;

  public gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Тип",
        field: "typeName",
        flex: 0,
        width: 200,
      },
      {
        headerName: "Назва",
        field: "name",
      },
      {
        headerName: "Адреса",
        field: "address",
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

  private creativeConnectionTypes: ComboboxItem[] = [];

  constructor(
    private departmentService: DepartmentService,
    private commonDialogService: CommonDialogService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.getCreativeConnections();
    this.getCreativeConnectionTypes();

    this.subscribeToChanges();
  }

  public async addRecord() {
    const result = await this.openCreativeConnectionDialog(null, {
      add: true,
      dialogTitle: "Новий Запис",
    });

    if (result?.success) {
      this.getCreativeConnections();
    }
  }

  public async editRecord() {
    if (!this.selectedRecord) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.openCreativeConnectionDialog(this.selectedRecord, {
      edit: true,
      dialogTitle: "Редагувати Запис",
    });

    if (result?.success) {
      this.getCreativeConnections();
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
        await lastValueFrom(
          this.departmentService.deleteCreativeConnection(this.selectedRecord.id)
        );

        this.getCreativeConnections();
      } catch (err: any) {
        this.departmentService.showRequestError(err);
      }
    }
  }

  public async refresh() {
    this.searchCtrl.patchValue(null);

    this.getCreativeConnections();
  }

  private selectRecord(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedRecord = event.data;
  }

  private async getCreativeConnections() {
    try {
      this.records = await lastValueFrom(this.departmentService.getCreativeConnections());

      if (this.selectedRecord) {
        this.selectedRecord = this.records.find((e) => e.id === this.selectedRecord.id);
      }

      this.cdr.markForCheck();
    } catch (err: any) {
      this.departmentService.showRequestError(err);
    }
  }

  private async getCreativeConnectionTypes() {
    try {
      this.creativeConnectionTypes = await lastValueFrom(
        this.departmentService.getCreativeConnectionTypes()
      );
    } catch (err: any) {
      this.departmentService.showRequestError(err);
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

  private openCreativeConnectionDialog(data: any, options: any) {
    return lastValueFrom(
      this.dialogService.open<DialogResult>(
        new PolymorpheusComponent(NewCreativeConnectionComponent, this.injector),
        {
          closeable: false,
          label: options.dialogTitle,
          size: "l",
          data: {
            ...data,
            ...options,
            creativeConnectionTypes: this.creativeConnectionTypes,
          },
        }
      )
    );
  }
}
