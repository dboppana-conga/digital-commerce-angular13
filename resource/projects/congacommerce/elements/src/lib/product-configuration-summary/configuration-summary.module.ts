import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PricingModule } from '@congacommerce/ecommerce';
import { TranslateModule } from '@ngx-translate/core';
import { LaddaModule } from 'angular2-ladda';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from '../icon/icon.module';
import { OutputFieldModule } from '../output-field/output-field.module';
import { PriceModule } from '../price/price.module';
import { ProductConfigurationSummaryComponent } from './product-configuration-summary.component';

export * from './product-configuration-summary.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PriceModule,
    PricingModule,
    IconModule,
    RouterModule,
    LaddaModule,
    OutputFieldModule,
    ModalModule,
    NgScrollbarModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ProductConfigurationSummaryComponent
  ],
  exports: [
    ProductConfigurationSummaryComponent
  ]
})
export class ConfigurationSummaryModule {
}