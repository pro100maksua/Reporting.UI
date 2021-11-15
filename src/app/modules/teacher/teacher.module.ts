import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { NewPublicationComponent } from "./components/new-publication/new-publication.component";
import { PublicationsComponent } from "./components/publications/publications.component";
import { TeacherComponent } from "./pages/teacher/teacher.component";
import { TeacherService } from "./services/teacher.service";
import { TeacherRoutingModule } from "./teacher-routing.module";

@NgModule({
  declarations: [
    TeacherComponent,
    PublicationsComponent,
    NewPublicationComponent,
  ],
  imports: [CommonModule, TeacherRoutingModule, SharedModule],
  providers: [TeacherService],
})
export class TeacherModule {}
