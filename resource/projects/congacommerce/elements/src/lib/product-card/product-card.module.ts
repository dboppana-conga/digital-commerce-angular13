import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card.component';
import { CompareProductCardComponent } from './compare-product-card/compare-product-card.component';
import { ButtonModule } from '../button/button.module';
import { PriceModule } from '../price/price.module';
import { RouterModule } from '@angular/router';
import { ApttusModule } from '@congacommerce/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationSummaryModule } from '../product-configuration-summary/configuration-summary.module';

export * from './product-card.component';
export * from './compare-product-card/compare-product-card.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    PriceModule,
    TooltipModule,
    RouterModule,
    ApttusModule,
    TranslateModule.forChild(),
    ConfigurationSummaryModule
  ],
  declarations: [ProductCardComponent, CompareProductCardComponent],
  exports: [ProductCardComponent, CompareProductCardComponent]
})
export class ProductCardModule { }
