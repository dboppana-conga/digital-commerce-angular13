import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PricingModule } from '@congacommerce/ecommerce';
import { InputFieldModule } from '../input-field/input-field.module';
import { ProductTypeFilterComponent } from './product-type-filter/product-type-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';

export * from './product-type-filter/product-type-filter.component';
export * from './category-filter/category-filter.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    InputFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PricingModule,
    TranslateModule.forChild()
  ],
  declarations: [ProductTypeFilterComponent, CategoryFilterComponent],
  exports: [ProductTypeFilterComponent, CategoryFilterComponent]
})
export class FilterModule { }
