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
import { ErrorService } from "src/app/core/services/error.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { Author } from "../../models/author";
import { Publication } from "../../models/publication";
import { TeacherService } from "../../services/teacher.service";
import { NewPublicationComponent } from "../new-publication/new-publication.component";

@Component({
  selector: "app-publications",
  templateUrl: "./publications.component.html",
  styleUrls: ["./publications.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent extends BaseComponent implements OnInit {
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
        valueGetter: (params) =>
          params.data.authors.map((a: Author) => a.fullName),
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
    private teacherService: TeacherService,
    private errorService: ErrorService,
    private commonDialogService: CommonDialogService,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.getPublications();

    this.subscribeToChanges();
  }

  public async addPublication() {
    const result = await this.openPublicationDialog(null, {
      add: true,
      dialogTitle: "Нова Публікація",
    });

    if (result?.success) {
      this.publications = [...this.publications, result.data];

      this.teacherService.updateConferencesTab();
    }
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
      this.publications = this.publications.map((p) =>
        p.id === this.selectedPublication.id ? result.data : p
      );

      if (this.selectedPublication) {
        this.selectedPublication = result.data;
      }
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
        await lastValueFrom(
          this.teacherService.deletePublication(this.selectedPublication.id)
        );

        this.publications = this.publications.filter(
          (p) => p.id !== this.selectedPublication.id
        );

        this.resetPublicationsSelection();

        this.cdr.markForCheck();
      } catch (err: any) {
        this.errorService.showRequestError(err);
      }
    }
  }
  public onTabClick(i: any) {}
  public async refresh() {
    this.searchCtrl.patchValue(null);

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
        this.teacherService.getPublications()
      );

      this.cdr.markForCheck();
    } catch (err: any) {
      this.errorService.showRequestError(err);
    }
  }

  private subscribeToChanges() {
    this.searchCtrl.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe((search) => {
        this.resetPublicationsSelection();

        this.publicationsTable.setQuickFilter(search);
      });
  }

  private resetPublicationsSelection() {
    this.publicationsTable?.deselectAll();
    this.selectedPublication = null;
  }

  private openPublicationDialog(data: any, options: any) {
    return this.dialogService
      .open<DialogResult>(
        new PolymorpheusComponent(NewPublicationComponent, this.injector),
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