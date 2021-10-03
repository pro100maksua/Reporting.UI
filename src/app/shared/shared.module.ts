import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { TaigaUiModule } from "./taiga-ui.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaigaUiModule,
    AgGridModule,
  ],
  exports: [FormsModule, ReactiveFormsModule, TaigaUiModule, AgGridModule],
})
export class SharedModule {}
