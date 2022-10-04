import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputFieldComponent } from './output-field.component';
import { AddressModule } from '../address/address.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { InputFieldModule } from '../input-field/input-field.module';
import { LaddaModule } from 'angular2-ladda';
import { PricingModule } from '@congacommerce/ecommerce';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export * from './output-field.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    PopoverModule.forRoot(),
    TranslateModule.forChild(),
    InputFieldModule,
    RouterModule,
    LaddaModule,
    PricingModule
  ],
  declarations: [OutputFieldComponent],
  exports : [OutputFieldComponent]
})
export class OutputFieldModule { }
