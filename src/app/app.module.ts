import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  TuiDialogModule,
  TuiNotificationsModule,
  TuiRootModule,
  TUI_SANITIZER,
} from "@taiga-ui/core";
import { TUI_LANGUAGE, TUI_UKRAINIAN_LANGUAGE } from "@taiga-ui/i18n";
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { of } from "rxjs";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiDialogModule,
    TuiNotificationsModule,
  ],
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    { provide: TUI_LANGUAGE, useValue: of(TUI_UKRAINIAN_LANGUAGE) },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
