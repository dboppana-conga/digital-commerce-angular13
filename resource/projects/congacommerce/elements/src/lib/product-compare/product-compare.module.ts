import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCompareComponent } from './product-compare.component';
import { CompareTableComponent } from './compare-table/compare-table.component';
import { ProductCardModule } from '../product-card/product-card.module';

export * from './product-compare.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    ProductCardModule
  ],
  declarations: [ProductCompareComponent, CompareTableComponent],
  exports : [ProductCompareComponent]
})
export class ProductCompareModule { }
