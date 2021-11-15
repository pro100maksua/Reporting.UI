import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "teacher",
    pathMatch: "full",
  },
  {
    path: "teacher",
    loadChildren: () =>
      import("../app/modules/teacher/teacher.module").then(
        (m) => m.TeacherModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
