import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApttusModule } from '@congacommerce/core';

import { PriceModule } from '../price/price.module';
import { ButtonModule } from '../button/button.module';
import { InputFieldModule } from '../input-field/input-field.module';
import { PopoverModule } from '../popover/popover.module';
import { IconModule } from '../icon/icon.module';
import { ProductAttributeModule } from '../product-attribute/product-attribute.module';
import { AlertModule } from '../alert/alert.module';

import { ProductConfigurationComponent } from './product-configuration.component';

export * from './product-configuration.component';
export * from './services/product-configuration.service';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PriceModule,
    ButtonModule,
    InputFieldModule,
    FormsModule,
    ApttusModule,
    PopoverModule,
    IconModule,
    ProductAttributeModule,
    AlertModule
  ],
  declarations: [
    ProductConfigurationComponent
  ],
  exports : [ProductConfigurationComponent]
})
export class ProductConfigurationModule { }
