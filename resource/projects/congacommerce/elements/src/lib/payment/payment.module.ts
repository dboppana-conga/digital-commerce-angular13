import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCardExtractorPipe } from './pipes/credit-card-extractor.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../icon/icon.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { PaymentIFrameComponent, PaymentMethodComponent, PaymentComponent } from './components/index';

export * from './pipes/index';
export * from './components/index';

/**
 * @ignore
 */
@NgModule({
  imports: [CommonModule,
    IconModule,
    FormsModule,
    BsDropdownModule,
    BsDatepickerModule.forRoot(),
    LaddaModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot()],
  providers: [],
  declarations: [CreditCardExtractorPipe, PaymentIFrameComponent, PaymentMethodComponent, PaymentComponent],
  exports: [PaymentComponent, PaymentIFrameComponent, CreditCardExtractorPipe]
})
export class PaymentComponentModule { }