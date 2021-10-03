import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { GridOptions } from "ag-grid-community";
import { DialogResult } from "src/app/core/models/dialog-result";
import { BaseComponent } from "src/app/shared/components/base.component";
import { Publication } from "../../models/publication";
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

  public gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Part Number",
        field: "partNumber",
      },
      {
        headerName: "Fixture Number",
        field: "fixtureNumber",
      },
      {
        headerName: "Facility",
        field: "facilityName",
      },
      {
        headerName: "Department",
        field: "departmentName",
      },
      {
        headerName: "Location",
        field: "locationName",
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

    onCellFocused: (event) =>
      event.api
        .getModel()
        .getRow(event.rowIndex as number)
        ?.setSelected(true, true),
  };

  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {
    super();
  }

  ngOnInit() {}

  public addPublication() {
    this.dialogService
      .open<DialogResult>(
        new PolymorpheusComponent(NewPublicationComponent, this.injector),
        { closeable: false, label: "Нова Публікація", size: "l" }
      )
      .subscribe();
  }
}
