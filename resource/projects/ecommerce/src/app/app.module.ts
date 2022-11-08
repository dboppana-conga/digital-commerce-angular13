import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommerceModule, TranslatorLoaderService } from '@congacommerce/ecommerce';
import { ProductDrawerModule, ApttusModalModule } from '@congacommerce/elements';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentModule } from './components/component.module';

// Register locale data
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { registerLocaleData } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';

// If using additional locales, register the locale data here
registerLocaleData(localeMx, 'es-MX', localeMxExtra);
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

// Translations
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommerceModule.forRoot(environment),
    ProductDrawerModule,
    ModalModule.forRoot(),
    ApttusModalModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslatorLoaderService }
    }),
    HttpClientModule,
    ComponentModule,
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