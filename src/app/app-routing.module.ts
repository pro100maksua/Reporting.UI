import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { LoginGuard } from "./core/guards/login.guard";
import { RoleGuard } from "./core/guards/role.guard";
import { Role } from "./core/models/role";

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
          import("../app/modules/teacher/teacher.module").then((m) => m.TeacherModule),
      },
      {
        path: "department",
        loadChildren: () =>
          import("../app/modules/department/department.module").then((m) => m.DepartmentModule),
        canActivate: [RoleGuard],
        data: { requiredRole: Role.Department },
      },
      {
        path: "faculty",
        loadChildren: () =>
          import("../app/modules/faculty/faculty.module").then((m) => m.FacultyModule),
        canActivate: [RoleGuard],
        data: { requiredRole: Role.Faculty },
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () => import("../app/modules/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
