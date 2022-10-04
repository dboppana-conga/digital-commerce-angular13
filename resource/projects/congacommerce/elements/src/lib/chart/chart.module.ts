import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { PricingModule } from '@congacommerce/ecommerce';
import { TranslateModule } from '@ngx-translate/core';

export * from './chart.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PricingModule,
    TranslateModule.forChild()
  ],
  declarations: [ChartComponent],
  exports: [ChartComponent]
})
export class ChartModule { }
