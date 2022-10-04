import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthProviderInterceptor } from './auth-provider.interceptor';
import { AuthProviderService } from './auth-provider.service';

export * from './auth-provider.interceptor';
export * from './auth-provider.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthProviderInterceptor, multi: true },
    AuthProviderService
  ]
})
export class AuthProviderModule { }
