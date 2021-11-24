import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { NewPublicationComponent } from "./components/new-publication/new-publication.component";
import { PublicationsComponent } from "./components/publications/publications.component";
import { TeacherComponent } from "./pages/teacher/teacher.component";
import { TeacherService } from "./services/teacher.service";
import { TeacherRoutingModule } from "./teacher-routing.module";
import { ConferencesComponent } from "./components/conferences/conferences.component";
import { NewConferenceComponent } from "./components/new-conference/new-conference.component";
import { ImportScopusPublicationsComponent } from "./components/import-scopus-publications/import-scopus-publications.component";
import { StudentsWorkComponent } from "./components/students-work/students-work.component";
import { NewStudentsWorkEntryComponent } from "./components/new-students-work-entry/new-students-work-entry.component";

@NgModule({
  declarations: [
    TeacherComponent,
    PublicationsComponent,
    NewPublicationComponent,
    ConferencesComponent,
    NewConferenceComponent,
    ImportScopusPublicationsComponent,
    StudentsWorkComponent,
    NewStudentsWorkEntryComponent,
  ],
  imports: [CommonModule, TeacherRoutingModule, SharedModule],
  providers: [TeacherService],
})
export class TeacherModule {}
