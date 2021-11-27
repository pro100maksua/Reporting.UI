import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CreativeConnectionsComponent } from "./components/creative-connections/creative-connections.component";
import { DownloadReportsComponent } from "./components/download-reports/download-reports.component";
import { NewCreativeConnectionComponent } from "./components/new-creative-connection/new-creative-connection.component";
import { NewPublicationComponent } from "./components/new-publication/new-publication.component";
import { PublicationsComponent } from "./components/publications/publications.component";
import { DepartmentRoutingModule } from "./department-routing.module";
import { DepartmentComponent } from "./pages/department/department.component";
import { DepartmentService } from "./services/department.service";

@NgModule({
  declarations: [
    DepartmentComponent,
    NewPublicationComponent,
    PublicationsComponent,
    DownloadReportsComponent,
    CreativeConnectionsComponent,
    NewCreativeConnectionComponent,
  ],
  imports: [CommonModule, DepartmentRoutingModule, SharedModule],
  providers: [DepartmentService],
})
export class DepartmentModule {}
