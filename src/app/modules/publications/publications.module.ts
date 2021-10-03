import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { NewPublicationComponent } from "./pages/new-publication/new-publication.component";
import { PublicationsRoutingModule } from "./publications-routing.module";
import { PublicationsService } from "./services/publications.service";
import { PublicationsComponent } from './pages/publications/publications.component';

@NgModule({
  declarations: [NewPublicationComponent, PublicationsComponent],
  imports: [CommonModule, PublicationsRoutingModule, SharedModule],
  providers: [PublicationsService],
})
export class PublicationsModule {}
