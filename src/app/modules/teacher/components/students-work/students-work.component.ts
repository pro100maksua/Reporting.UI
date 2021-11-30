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
import { StudentsWorkEntry } from "../../models/students-work-entry";
import { TeacherService } from "../../services/teacher.service";
import { NewStudentsWorkEntryComponent } from "../new-students-work-entry/new-students-work-entry.component";

@Component({
  selector: "app-students-work",
  templateUrl: "./students-work.component.html",
  styleUrls: ["./students-work.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsWorkComponent extends BaseComponent implements OnInit {
  public searchCtrl = new FormControl();

  public entries: StudentsWorkEntry[] = [];
  public selectedEntry: StudentsWorkEntry;

  public gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Тип",
        field: "typeName",
        flex: 0,
        width: 530,
      },
      {
        headerName: "Деталі",
        field: "entryName",
      },
      {
        headerName: "Рік",
        field: "year",
        flex: 0,
        width: 100,
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

    onRowSelected: (event) => this.selectEntry(event),

    onGridReady: async (event) => {
      this.entriesTable = event.api;
    },

    onCellFocused: (event) =>
      event.api
        .getModel()
        .getRow(event.rowIndex as number)
        ?.setSelected(true, true),
  };

  private entriesTable: GridApi;

  private studentsWorkTypes: ComboboxItem[] = [];
  private scientificWorkTypes: ComboboxItem[] = [];

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
    this.getStudentsWorkEntries();
    this.getStudentsWorkTypes();
    this.getStudentsScientificWorkTypes();

    this.subscribeToChanges();
  }

  public async addEntry() {
    const result = await this.openEntryDialog(null, {
      add: true,
      dialogTitle: "Новий Запис",
    });

    if (result?.success) {
      this.getStudentsWorkEntries();
    }
  }

  public async editEntry() {
    if (!this.selectedEntry) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.openEntryDialog(this.selectedEntry, {
      edit: true,
      dialogTitle: "Редагувати Запис",
    });

    if (result?.success) {
      this.getStudentsWorkEntries();
    }
  }

  public async deleteEntry() {
    if (!this.selectedEntry) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.commonDialogService.openConfirmationDialog();

    if (result) {
      try {
        await lastValueFrom(this.teacherService.deleteStudentsWorkEntry(this.selectedEntry.id));

        this.getStudentsWorkEntries();
      } catch (err: any) {
        this.teacherService.showRequestError(err);
      }
    }
  }

  public async refresh() {
    this.searchCtrl.patchValue(null);

    this.getStudentsWorkEntries();
  }

  private selectEntry(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedEntry = event.data;
  }

  private async getStudentsWorkEntries() {
    try {
      this.entries = await lastValueFrom(this.teacherService.getStudentsWorkEntries());

      if (this.selectedEntry) {
        this.selectedEntry = this.entries.find((e) => e.id === this.selectedEntry.id);
      }

      this.cdr.markForCheck();
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private async getStudentsWorkTypes() {
    try {
      this.studentsWorkTypes = await lastValueFrom(this.teacherService.getStudentsWorkTypes());
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private async getStudentsScientificWorkTypes() {
    try {
      this.scientificWorkTypes = await lastValueFrom(
        this.teacherService.getStudentsScientificWorkTypes()
      );
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.searchCtrl.valueChanges.pipe(this.takeUntilDestroy()).subscribe((search) => {
      this.resetEntriesSelection();

      this.entriesTable.setQuickFilter(search);
    });
  }

  private resetEntriesSelection() {
    this.entriesTable?.deselectAll();
    this.selectedEntry = null;
  }

  private openEntryDialog(data: any, options: any) {
    return lastValueFrom(
      this.dialogService.open<DialogResult>(
        new PolymorpheusComponent(NewStudentsWorkEntryComponent, this.injector),
        {
          closeable: false,
          label: options.dialogTitle,
          size: "l",
          data: {
            ...data,
            ...options,
            studentsWorkTypes: this.studentsWorkTypes,
            scientificWorkTypes: this.scientificWorkTypes,
          },
        }
      )
    );
  }
}
