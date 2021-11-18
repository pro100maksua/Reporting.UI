import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HeaderComponent } from "./components/header/header.component";

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [HeaderComponent],
})
export class CoreModule {}
