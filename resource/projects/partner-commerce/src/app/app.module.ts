import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { TelemetryModule } from '@congacommerce/core';
import { TranslatorLoaderService, CommerceModule } from '@congacommerce/ecommerce';
import { TableModule, ApttusModalModule, IconModule, ProductDrawerModule } from '@congacommerce/elements';
import { ComponentModule } from './components/component.module';
import { MainComponent } from './main.component';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Locale data
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeItExtras from '@angular/common/locales/extra/it';
import localeFrExtras from '@angular/common/locales/extra/fr';
import localeEsExtras from '@angular/common/locales/extra/es';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';


registerLocaleData(localeIt, 'it-IT', localeItExtras);
registerLocaleData(localeFr, 'fr-FR', localeFrExtras);
registerLocaleData(localeEs, 'es-MX', localeEsExtras);
@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommerceModule.forRoot(environment),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslatorLoaderService }
    }),
    TableModule,
    ComponentModule,
    ProductDrawerModule,
    ApttusModalModule,
    IconModule,
    //  TelemetryModule, commenting for demo
    MsalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard, MsalBroadcastService, MsalService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
