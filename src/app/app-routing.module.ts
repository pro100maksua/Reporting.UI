import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { LoginGuard } from "./core/guards/login.guard";

const routes: Routes = [
  {
    path: "",
    children: [
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
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("../app/modules/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
