import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionModalComponent } from './promotion-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PricingModule } from '@congacommerce/ecommerce';
import { TranslateModule } from '@ngx-translate/core';
import { OutputFieldModule } from '../output-field/output-field.module';
import { IconModule } from '../icon/icon.module';

export * from './promotion-modal.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PricingModule,
    ModalModule.forRoot(),
    TranslateModule.forChild(),
    OutputFieldModule,
    IconModule
  ],
  declarations: [PromotionModalComponent],
  exports: [PromotionModalComponent]
})
export class PromotionModalModule { }
