import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RenewModalComponent } from './renew-modal/renew-modal.component';
import { PricingModule } from '@congacommerce/ecommerce';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LaddaModule } from 'angular2-ladda';
import { TerminateModalComponent } from './terminate-modal/terminate-modal.component';
import { BuyMoreModalComponent } from './buy-more-modal/buy-more-modal.component';
import { ChangeConfigurationModalComponent } from './change-configuration-modal/change-configuration-modal.component';
export * from './buy-more-modal/buy-more-modal.component';
export * from './renew-modal/renew-modal.component';
export * from './terminate-modal/terminate-modal.component';
export * from './change-configuration-modal/change-configuration-modal.component';
import { OutputFieldModule } from '../output-field/output-field.module';
import { InputFieldModule } from '../input-field/input-field.module';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    LaddaModule,
    PricingModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    OutputFieldModule,
    InputFieldModule
  ],
  declarations: [RenewModalComponent, TerminateModalComponent, BuyMoreModalComponent, ChangeConfigurationModalComponent],
  entryComponents: [RenewModalComponent, TerminateModalComponent, BuyMoreModalComponent, ChangeConfigurationModalComponent]
})
export class ApttusModalModule {}
