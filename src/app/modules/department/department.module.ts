import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { NewPublicationComponent } from "./components/new-publication/new-publication.component";
import { PublicationsComponent } from "./components/publications/publications.component";
import { DepartmentRoutingModule } from "./department-routing.module";
import { DepartmentComponent } from "./pages/department/department.component";
import { DepartmentService } from "./services/department.service";
import { DownloadReportsComponent } from './components/download-reports/download-reports.component';

@NgModule({
  declarations: [DepartmentComponent, NewPublicationComponent, PublicationsComponent, DownloadReportsComponent],
  imports: [CommonModule, DepartmentRoutingModule, SharedModule],
  providers: [DepartmentService],
})
export class DepartmentModule {}
