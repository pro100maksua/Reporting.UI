import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  Input,
  OnInit,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { GridApi, GridOptions, RowSelectedEvent } from "ag-grid-community";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { lastValueFrom } from "rxjs";
import { DialogResult } from "src/app/core/models/dialog-result";
import { AuthService } from "src/app/core/services/auth.service";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { TaigaService } from "src/app/core/services/taiga.service";
import { Department } from "src/app/modules/auth/models/department";
import { Publication } from "src/app/modules/teacher/models/publication";
import { BaseComponent } from "src/app/shared/components/base.component";
import { FacultyService } from "../../services/faculty.service";
import { NewPublicationComponent } from "../new-publication/new-publication.component";

@Component({
  selector: "app-publications",
  templateUrl: "./publications.component.html",
  styleUrls: ["./publications.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent extends BaseComponent implements OnInit {
  @Input() departments: Department[] = [];

  public departmentCtrl = new FormControl();
  public searchCtrl = new FormControl();

  public publications: Publication[] = [];
  public selectedPublication: Publication;

  public gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Назва",
        field: "title",
      },
      {
        headerName: "Автори",
        field: "authors",
      },
      {
        headerName: "Тип",
        field: "typeName",
      },
      {
        headerName: "Видавництво",
        field: "publicationTitle",
      },
      {
        headerName: "Рік Видання",
        field: "publicationYear",
        flex: 0,
        width: 120,
      },
      {
        headerName: "К-ть сторінок",
        field: "pagesCount",
        flex: 0,
        width: 130,
      },
      {
        headerName: "К-ть др. ар.",
        field: "printedPagesCount",
        flex: 0,
        width: 120,
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

    onRowSelected: (event) => this.selectPublication(event),

    onGridReady: async (event) => {
      this.publicationsTable = event.api;
    },

    onCellFocused: (event) =>
      event.api
        .getModel()
        .getRow(event.rowIndex as number)
        ?.setSelected(true, true),
  };

  private publicationsTable: GridApi;

  constructor(
    private authService: AuthService,
    private facultyService: FacultyService,
    private commonDialogService: CommonDialogService,
    private loaderService: NgxUiLoaderService,
    public taigaService: TaigaService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.getPublications();
    this.loadScientificJournalsCategoryB();

    this.subscribeToChanges();
  }

  public async editPublication() {
    if (!this.selectedPublication) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.openPublicationDialog(this.selectedPublication, {
      edit: true,
      dialogTitle: "Редагувати Публікацію",
    });

    if (result?.success) {
      this.getPublications();
    }
  }

  public async deletePublication() {
    if (!this.selectedPublication) {
      this.commonDialogService.openRecordNotSelectedDialog();
      return;
    }

    const result = await this.commonDialogService.openConfirmationDialog();

    if (result) {
      try {
        await lastValueFrom(this.facultyService.deletePublication(this.selectedPublication.id));

        this.getPublications();
      } catch (err: any) {
        this.facultyService.showRequestError(err);
      }
    }
  }

  public async refresh() {
    this.departmentCtrl.patchValue(null, { emitEvent: false });
    this.searchCtrl.patchValue(null, { emitEvent: false });

    this.getPublications();
  }

  private selectPublication(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedPublication = event.data;
  }

  private async getPublications() {
    try {
      this.publications = await lastValueFrom(
        this.facultyService.getFacultyPublications(this.departmentCtrl.value)
      );

      if (this.selectedPublication) {
        this.selectedPublication = this.publications.find(
          (p) => p.id === this.selectedPublication.id
        );
      }

      this.cdr.markForCheck();
    } catch (err: any) {
      this.facultyService.showRequestError(err);
    }
  }

  private async loadScientificJournalsCategoryB() {
    try {
      await lastValueFrom(this.facultyService.loadScientificJournalsCategoryB());
    } catch (err: any) {
      this.facultyService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.departmentCtrl.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(() => this.getPublications());

    this.searchCtrl.valueChanges.pipe(this.takeUntilDestroy()).subscribe((search) => {
      this.resetPublicationsSelection();

      this.publicationsTable.setQuickFilter(search);
    });
  }

  private resetPublicationsSelection() {
    this.publicationsTable?.deselectAll();
    this.selectedPublication = null;
  }

  private openPublicationDialog(data: any, options: any) {
    return lastValueFrom(
      this.dialogService.open<DialogResult>(
        new PolymorpheusComponent(NewPublicationComponent, this.injector),
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
