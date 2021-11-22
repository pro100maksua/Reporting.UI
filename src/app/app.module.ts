import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  TuiDialogModule,
  TuiNotificationsModule,
  TuiRootModule,
  TUI_SANITIZER,
} from "@taiga-ui/core";
import { TUI_LANGUAGE, TUI_UKRAINIAN_LANGUAGE } from "@taiga-ui/i18n";
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import {
  NgxUiLoaderConfig,
  NgxUiLoaderModule,
  PB_DIRECTION,
  POSITION,
  SPINNER,
} from "ngx-ui-loader";
import { of } from "rxjs";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { AuthService } from "./core/services/auth.service";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsSize: 40,
  fgsColor: "#c3c3c3",
  fgsType: SPINNER.fadingCircle,
  hasProgressBar: false,
  blur: 0,
  delay: 0,
  fastFadeOut: true,
};

const jwtOptionsFactory = (authService: AuthService) => ({
  tokenGetter: () => authService.tokenGetter(),
  allowedDomains: ["localhost:5001"],
});

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
    FontAwesomeModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService],
      },
    }),
  ],
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    { provide: TUI_LANGUAGE, useValue: of(TUI_UKRAINIAN_LANGUAGE) },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
