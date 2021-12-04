import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { DownloadReportsComponent } from "./components/download-reports/download-reports.component";
import { NewPublicationComponent } from "./components/new-publication/new-publication.component";
import { PublicationsComponent } from "./components/publications/publications.component";
import { FacultyRoutingModule } from "./faculty-routing.module";
import { FacultyComponent } from "./pages/faculty/faculty.component";
import { FacultyService } from "./services/faculty.service";

@NgModule({
  declarations: [
    FacultyComponent,
    DownloadReportsComponent,
    PublicationsComponent,
    NewPublicationComponent,
  ],
  imports: [CommonModule, FacultyRoutingModule, SharedModule],
  providers: [FacultyService],
})
export class FacultyModule {}
