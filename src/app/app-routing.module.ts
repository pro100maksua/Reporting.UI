import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "publications",
    pathMatch: "full",
  },
  {
    path: "publications",
    loadChildren: () =>
      import("../app/modules/publications/publications.module").then(
        (m) => m.PublicationsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
