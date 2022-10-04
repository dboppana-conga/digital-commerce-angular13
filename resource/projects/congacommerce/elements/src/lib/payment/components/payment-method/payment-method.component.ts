import { Component, OnInit, NgZone, EventEmitter, Output, Input, Compiler, OnDestroy } from '@angular/core';
import { PaymentService, PaymentMethod, Account, PaymentTransaction } from '@congacommerce/ecommerce';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ExceptionService } from '../../../../shared/services/exception.service';
/**
 * @ignore
 * using moment library for date compare
 */
const _moment = moment;
/**
 * The payment method layout component is a listing component for payment method object
 * It is used to display all available payment method for logged in user and will select add credit/debit card option if no payment method exist.
 * @ignore
 ```typescript
import { PaymentComponentModule } from '../payment/payment.module';

@NgModule({
  imports: [PaymentComponentModule, ...]
})
export class AppModule {}
```
*
* @example
* <apt-payment-method
*              [account]="account"
*              (isAnyMethodExist)='selectDefaultPaymentOption($event)'
* ></apt-payment-method>
*/
@Component({
  selector: 'apt-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})

export class PaymentMethodComponent implements OnInit, OnDestroy {
  /**
    * Input parameter of contaning payment related details
  */
  @Input() paymentTransaction: PaymentTransaction;

  /**   
   * Observable containing list of available payment methods
   */
  paymentMethodList: Array<PaymentMethod>;
  /**   
   * To check is any existing payment method is selected for payment or not
   */
  isPaymentByMethod: boolean = true;;

  /**
  * Send true/false on payment method availability or selection
  */
  @Output() callForNewPaymentMethod = new EventEmitter<boolean>();

  private subscriptions: Subscription[] = [];

  constructor(private paymentService: PaymentService,
    private toastr: ToastrService,
    private _compiler: Compiler,
    private translateService: TranslateService,
    private exceptionService: ExceptionService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.paymentService.getActiveCardsForAccount(this.paymentTransaction.CustomerBillingAccountID).subscribe((result) => {

      /*If no method found send true status so payment Iframe auto open */
      if (result.length == 0)
        this.callForNewPaymentMethod.emit(true);
      else
        this.callForNewPaymentMethod.emit(false);

      this.paymentMethodList = result;
    }, 
    err => {
      this.exceptionService.showError(err);
    }));
  }

  /**
  * Update default method for account and removed existing default method
  * 
  * @param paymentItem PaymentMethod which need to make default
  * 
  */
  ondefaultMethodChange(paymentItem: PaymentMethod) {
    if (paymentItem) {
      let updatePaymnetsItems = new Array<PaymentMethod>();
      const existingDefaultmethod = this.paymentMethodList.find(f => f.IsDefault);
      if (existingDefaultmethod) {
        existingDefaultmethod.IsDefault = false;
        updatePaymnetsItems.push(existingDefaultmethod);
      }
      paymentItem.IsDefault = true;
      updatePaymnetsItems.push(paymentItem);
      this.paymentService.update(updatePaymnetsItems);
      this.callForNewPaymentMethod.emit(false);
      this.isPaymentByMethod = true;
    }
    else {
      this.callForNewPaymentMethod.emit(true);
      this.isPaymentByMethod = false;
    }
  }

  /**
   * Make it inactive only if it's not default method
   * 
   * @param paymentItem PaymentMethod which need to make delete(inactive)
   * 
   */
  deletePayment(paymentItem: PaymentMethod) {
    if (paymentItem.IsDefault) {
      this.subscriptions.push(this.translateService.stream(['PAYMENT_METHOD_LABELS.DEFAULT_MSG', 'PAYMENT_METHOD_LABELS.DEFAULT_TITLE']).subscribe((val: string) => {
        this.toastr.error(val['PAYMENT_METHOD_LABELS.DEFAULT_MSG'], val['PAYMENT_METHOD_LABELS.DEFAULT_TITLE']);
      }));
      return;
    }
    paymentItem.Status = 'Inactive';
    this.subscriptions.push(this.paymentService.update([paymentItem])
    .pipe(
      switchMap(res => this.paymentService.getActiveCardsForAccount(this.paymentTransaction.CustomerBillingAccountID))
    ).subscribe((res: Array<PaymentMethod>) => {
      this.paymentMethodList = res;
      this.exceptionService.showInfo('PAYMENT_METHOD_LABELS.DELETE_MSG', 'PAYMENT_METHOD_LABELS.DELETE_TITLE');
    }, err => {
      this.exceptionService.showError(err);
    }));
      
  }

  /**
   * Comparing current date with credit card expire date
   * 
   * @param month credit card month 
   * @param year credit card year
   * @return return true if date has not expired else false
   * 
   */
  IsDateExpired(month: number, year: number) {

    const  beforeInMoment = _moment(month + '-' + year, "MM-YYYY").add('months', 1).date(0);
    const  afterInMoment = _moment(new Date(), "MM-YYYY");
    if (beforeInMoment.isBefore(afterInMoment)) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this._compiler.clearCache();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}