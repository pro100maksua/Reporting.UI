import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { TaigaUiModule } from "./taiga-ui.module";
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent
  ],
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
