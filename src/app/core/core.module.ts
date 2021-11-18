import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiPrimitiveTextfieldModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiRadioBlockModule,
  TuiRadioLabeledModule,
  TuiRadioListModule,
  TuiRadioModule,
  TuiSelectModule,
} from "@taiga-ui/kit";
import { HeaderComponent } from "./components/header/header.component";
import { UpdateUserComponent } from "./components/update-user/update-user.component";

@NgModule({
  declarations: [HeaderComponent, UpdateUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TuiHostedDropdownModule,
    TuiSvgModule,
    TuiDataListModule,
    TuiPrimitiveTextfieldModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiFieldErrorModule,
    TuiErrorModule,
    TuiLabelModule,
    TuiGroupModule,
    TuiRadioModule,
    TuiRadioBlockModule,
    TuiRadioLabeledModule,
    TuiRadioListModule,
    TuiSelectModule,
    TuiButtonModule,
  ],
  exports: [HeaderComponent],
})
export class CoreModule {}
