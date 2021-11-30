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
import { ActivityIndicatorsComponent } from './components/activity-indicators/activity-indicators.component';
import { NewActivityIndicatorComponent } from './components/new-activity-indicator/new-activity-indicator.component';
import { DissertationsComponent } from './components/dissertations/dissertations.component';
import { NewDissertationComponent } from './components/new-dissertation/new-dissertation.component';

@NgModule({
  declarations: [
    DepartmentComponent,
    NewPublicationComponent,
    PublicationsComponent,
    DownloadReportsComponent,
    CreativeConnectionsComponent,
    NewCreativeConnectionComponent,
    ActivityIndicatorsComponent,
    NewActivityIndicatorComponent,
    DissertationsComponent,
    NewDissertationComponent,
  ],
  imports: [CommonModule, DepartmentRoutingModule, SharedModule],
  providers: [DepartmentService],
})
export class DepartmentModule {}
