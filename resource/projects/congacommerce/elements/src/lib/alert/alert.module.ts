import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { AlertModule as ngxAlertModule } from'ngx-bootstrap/alert';

export * from './alert.component';
/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    PopoverModule.forRoot(),
    LaddaModule,
    ngxAlertModule
  ],
  declarations: [AlertComponent],
  exports: [AlertComponent]
})
export class AlertModule { }
