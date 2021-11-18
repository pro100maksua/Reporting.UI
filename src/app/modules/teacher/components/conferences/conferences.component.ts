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
import { BaseComponent } from "src/app/shared/components/base.component";
import { Author } from "../../models/author";
import { Conference } from "../../models/conference";
import { TeacherService } from "../../services/teacher.service";
import { NewConferenceComponent } from "../new-conference/new-conference.component";

@Component({
  selector: "app-conferences",
  templateUrl: "./conferences.component.html",
  styleUrls: ["./conferences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConferencesComponent extends BaseComponent implements OnInit {
  public searchCtrl = new FormControl();

  public conferences: Conference[] = [];
  public selectedConference: Conference;

  public gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Назва",
        field: "title",
      },
      {
        headerName: "Рік Проведення",
        field: "year",
        flex: 0,
        width: 200,
      },
      {
        headerName: "Місце Проведення",
        field: "location",
        flex: 0,
        width: 200,
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

    onRowSelected: (event) => this.selectConference(event),

    onGridReady: async (event) => {
      this.conferencesTable = event.api;
    },

    onCellFocused: (event) =>
      event.api
        .getModel()
        .getRow(event.rowIndex as number)
        ?.setSelected(true, true),
  };

  private conferencesTable: GridApi;

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
    this.getConferences();

    this.subscribeToChanges();
  }

  public async addConference() {
    const result = await this.openConferenceDialog(null, {
      add: true,
      dialogTitle: "Нова Конференція",
    });

    if (result?.success) {
      this.conferences = [...this.conferences, result.data];
    }
  }

  public async editConference() {
    if (!this.selectedConference) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.openConferenceDialog(this.selectedConference, {
      edit: true,
      dialogTitle: "Редагувати Конференцію",
    });

    if (result?.success) {
      this.conferences = this.conferences.map((p) =>
        p.id === this.selectedConference.id ? result.data : p
      );

      if (this.selectedConference) {
        this.selectedConference = result.data;
      }
    }
  }

  public async deleteConference() {
    if (!this.selectedConference) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.commonDialogService.openConfirmationDialog();

    if (result) {
      try {
        await lastValueFrom(
          this.teacherService.deleteConference(this.selectedConference.id)
        );

        this.conferences = this.conferences.filter(
          (p) => p.id !== this.selectedConference.id
        );

        this.resetConferencesSelection();

        this.cdr.markForCheck();
      } catch (err: any) {
        this.teacherService.showRequestError(err);
      }
    }
  }

  public async refresh() {
    this.searchCtrl.patchValue(null);

    this.getConferences();
  }

  private selectConference(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedConference = event.data;
  }

  private async getConferences() {
    try {
      this.conferences = await lastValueFrom(
        this.teacherService.getConferences()
      );

      this.cdr.markForCheck();
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.searchCtrl.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe((search) => {
        this.resetConferencesSelection();

        this.conferencesTable.setQuickFilter(search);
      });

    this.teacherService
      .onConferencesTabUpdate()
      .pipe(this.takeUntilDestroy())
      .subscribe(() => this.getConferences());
  }

  private resetConferencesSelection() {
    this.conferencesTable?.deselectAll();
    this.selectedConference = null;
  }

  private openConferenceDialog(data: any, options: any) {
    return this.dialogService
      .open<DialogResult>(
        new PolymorpheusComponent(NewConferenceComponent, this.injector),
        {
          closeable: false,
          label: options.dialogTitle,
          size: "l",
          data: { ...data, ...options },
        }
      )
      .toPromise();
  }
}
