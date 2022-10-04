import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionComponent } from './promotion.component';
import { PromotionModalModule } from '../promotion-modal/promotion-modal.module';
import { OutputFieldModule } from '../output-field/output-field.module';
import { FormsModule } from '@angular/forms';
import { PricingModule } from '@congacommerce/ecommerce';
import { TranslateModule } from '@ngx-translate/core';
import { LaddaModule } from 'angular2-ladda';

export * from './promotion.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PromotionModalModule,
    FormsModule,
    PricingModule,
    OutputFieldModule,
    LaddaModule,
    TranslateModule.forChild()
  ],
  declarations: [PromotionComponent],
  exports : [PromotionComponent]
})
export class PromotionModule { }
