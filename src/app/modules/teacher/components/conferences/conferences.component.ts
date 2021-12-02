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
import { lastValueFrom, merge } from "rxjs";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { DialogResult } from "src/app/core/models/dialog-result";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { TaigaService } from "src/app/core/services/taiga.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { Conference } from "../../models/conference";
import { CONFERENCE_TYPES } from "../../models/constants";
import { TeacherService } from "../../services/teacher.service";
import { NewConferenceComponent } from "../new-conference/new-conference.component";

@Component({
  selector: "app-conferences",
  templateUrl: "./conferences.component.html",
  styleUrls: ["./conferences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConferencesComponent extends BaseComponent implements OnInit {
  public typeCtrl = new FormControl();
  public subTypeCtrl = new FormControl();
  public searchCtrl = new FormControl();

  public conferences: Conference[] = [];
  public selectedConference: Conference;

  public conferenceTypeValues = CONFERENCE_TYPES;

  public conferenceTypes: ComboboxItem[] = [];
  public conferenceSubTypes: ComboboxItem[] = [];

  public gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Назва",
        field: "title",
      },
      {
        headerName: "Відповідальні за проведення",
        field: "organizers",
      },
      {
        headerName: "Cпіворганізатори",
        field: "coOrganizers",
      },
      {
        headerName: "Місце Проведення",
        field: "location",
        flex: 0,
        width: 200,
      },
      {
        headerName: "Термін Проведення",
        field: "dateRange",
        flex: 0,
        width: 170,
      },
      {
        headerName: "Кількість Учасників",
        field: "numberOfParticipants",
        flex: 0,
        width: 170,
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
    public taigaService: TaigaService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.getConferences();
    this.getConferenceTypes();
    this.getConferenceSubTypes();

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
        await lastValueFrom(this.teacherService.deleteConference(this.selectedConference.id));

        this.conferences = this.conferences.filter((p) => p.id !== this.selectedConference.id);

        this.resetConferencesSelection();

        this.cdr.markForCheck();
      } catch (err: any) {
        this.teacherService.showRequestError(err);
      }
    }
  }

  public async refresh() {
    this.typeCtrl.patchValue(null, { emitEvent: false });
    this.subTypeCtrl.patchValue(null, { emitEvent: false });

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
      const subTypeValue =
        this.typeCtrl.value === CONFERENCE_TYPES.internal ? this.subTypeCtrl.value : null;

      this.conferences = await lastValueFrom(
        this.teacherService.getConferences(this.typeCtrl.value, subTypeValue)
      );

      this.cdr.markForCheck();
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private async getConferenceTypes() {
    try {
      this.conferenceTypes = await lastValueFrom(this.teacherService.getConferenceTypes());
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private async getConferenceSubTypes() {
    try {
      this.conferenceSubTypes = await lastValueFrom(this.teacherService.getConferenceSubTypes());
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    merge(this.typeCtrl.valueChanges, this.subTypeCtrl.valueChanges)
      .pipe(this.takeUntilDestroy())
      .subscribe(() => this.getConferences());

    this.searchCtrl.valueChanges.pipe(this.takeUntilDestroy()).subscribe((search) => {
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
      .open<DialogResult>(new PolymorpheusComponent(NewConferenceComponent, this.injector), {
        closeable: false,
        label: options.dialogTitle,
        size: "l",
        data: {
          ...data,
          ...options,
          conferenceTypes: this.conferenceTypes,
          conferenceSubTypes: this.conferenceSubTypes,
        },
      })
      .toPromise();
  }
}
