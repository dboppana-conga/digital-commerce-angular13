import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRRecommendedProductsComponent } from './recommended-products.component';
import { PriceModule } from '../price/price.module';
import { ButtonModule } from '../button/button.module';
import { ApttusModule } from '@congacommerce/core';

export * from './recommended-products.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PriceModule,
    ButtonModule,
    ApttusModule
  ],
  declarations: [CRRecommendedProductsComponent],
  exports: [CRRecommendedProductsComponent]
})
export class RecommendedProductsModule { }
