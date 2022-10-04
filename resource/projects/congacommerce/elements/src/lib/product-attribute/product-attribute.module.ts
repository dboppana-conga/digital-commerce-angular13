import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAttributeComponent } from './product-attribute.component';
import { InputFieldModule } from '../input-field/input-field.module';

export * from './product-attribute.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    InputFieldModule
  ],
  declarations: [ProductAttributeComponent],
  exports : [ProductAttributeComponent]
})
export class ProductAttributeModule { }
