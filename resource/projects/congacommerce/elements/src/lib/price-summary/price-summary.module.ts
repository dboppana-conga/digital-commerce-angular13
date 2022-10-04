import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PriceSummaryComponent } from './price-summary.component';
import { PriceModule } from '../price/price.module';
import { PricingModule } from '@congacommerce/ecommerce';
export * from './price-summary.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    PriceModule,
    PricingModule,
    CommonModule,
    RouterModule,
    LaddaModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    TranslateModule.forChild()
  ],
  declarations: [PriceSummaryComponent],
  exports: [PriceSummaryComponent]
})
export class PriceSummaryModule { }