import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentTransaction } from '@congacommerce/ecommerce';
/**
 * Payment component is used for processing order payments.
 *  <h3>Preview</h3>
 *  <div>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/payment.PNG" style="max-width: 100%">
 *  </div>
 * <h3>Usage</h3>
 *
 ```typescript
import { PaymentComponentModule } from '@congacommerce/elements';

@NgModule({
  imports: [PaymentComponentModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-payment
*             [paymentTransaction]="paymentTransaction"
*             (onSelectingPayment)="handleSelectPayment($event)"
*             (onPaymentComplete)="handlePaymentComplete($event)"
* ></apt-payment>
```
*/
@Component({
  selector: 'apt-payment',
  templateUrl: './payment.component.html',
  styles: []
})
export class PaymentComponent implements OnInit {
  /**
    * Input parameter of contaning payment related details
  */
  @Input() paymentTransaction: PaymentTransaction;
  /**
    * Output parameter from payment method component for checking is payment is selected or availble
  */
  @Output() onSelectingPayment: EventEmitter<boolean> = new EventEmitter();
  /**
    * Output parameter from payment Iframe component for checking is payment completed
  */
  @Output() onPaymentComplete: EventEmitter<string> = new EventEmitter();
  /**
    * Is requesting for payment for order
    * @ignore
  */
  paymentForOrder: boolean = false;
  /**
    * Requested payment type
    * @ignore
  */
  paymentType: 'Sale' | 'SaleCapture' | 'SilentSale' = 'Sale';
  /**
    * Is requesting for saving credit card details
    * @ignore
  */
  isSalesCardSaved: boolean = false;

  ngOnInit() {
    if (!this.paymentTransaction.isUserLoggedIn)
    {
      this.paymentForOrder = true;
      this.onSelectingPayment.emit(false);
    }
  }

  /**
  * Check is user requesting for new payment method.
  * @param isNewRequest flag to check the request status
  * @ignore
  */
  requestNewPaymentMethod(isNewRequest: boolean) {
    if (isNewRequest) {
      this.isSalesCardSaved = false;
      this.paymentType = 'Sale';
      this.paymentForOrder = true;
      this.onSelectingPayment.emit(false);
    }
    else {
      this.paymentForOrder = false;
      this.onSelectingPayment.emit(true);
    }
  }
  /**
  * Check the status after paymenty submit
  * @param transactionResponse contain status message after payment
  * @ignore
  */
  onSubmitPaymentRequestForOrder(transactionResponse: string) {
    this.paymentForOrder = false;
    this.onPaymentComplete.emit(transactionResponse); 
  }

  /**
  * Set flag and load payment Iframe based on the selection for saving credit card details.
  * @param isRequestForSave flag to check save request
  * @ignore
  */
  transactionType(isRequestForSave) {
    this.paymentForOrder = false;
    if (isRequestForSave)
      this.paymentType = 'SaleCapture';
    else {
      this.paymentType = 'Sale';
    }
    setTimeout(() => this.paymentForOrder = true, 50);
  }
}
