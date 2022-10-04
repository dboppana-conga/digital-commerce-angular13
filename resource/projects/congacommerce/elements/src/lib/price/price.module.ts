import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingModule } from '@congacommerce/ecommerce';
import { PriceComponent } from './price.component';

export * from './price.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PricingModule
  ],
  declarations: [PriceComponent],
  exports : [PriceComponent]
})
export class PriceModule { }
