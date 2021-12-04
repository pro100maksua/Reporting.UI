import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FacultyComponent } from "./pages/faculty/faculty.component";

const routes: Routes = [{ path: "", component: FacultyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacultyRoutingModule {}
