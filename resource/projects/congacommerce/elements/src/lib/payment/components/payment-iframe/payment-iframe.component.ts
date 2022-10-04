import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, OnDestroy, Compiler, HostListener, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';
import { GatewayCommunicationService, PaymentService, PaymentTransaction} from '@congacommerce/ecommerce';
import { Subscription } from 'rxjs';
import { get, isNil} from 'lodash';

/**
 * This payment Iframe component layout has iframe which will integrate with payment gateway to create payment method
 * <h3>Preview</h3>
 *  <div>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/paymentIFrame.PNG" style="max-width: 100%">
 *  </div>
```typescript
import { PaymentComponentModule } from '../payment/payment.module';

@NgModule({
  imports: [PaymentComponentModule, ...]
})
export class AppModule {}
```
*
* @example
```typescript
* <apt-payment-iframe
*              [account]="account"
*              [primaryContact]="primaryContact"
*              [user]="user"
* ></apt-payment-iframe>
```
*/
@Component({
  selector: 'apt-payment-iframe',
  templateUrl: './payment-iframe.component.html',
  styleUrls: ['./payment-iframe.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class PaymentIFrameComponent implements OnInit, OnDestroy {

  /**
    * Input parameter of contaning payment related details.
  */
  @Input() paymentTransaction: PaymentTransaction;
  /**
    * Requested payment type.
  */
  @Input() paymentType: 'SaleCapture' | 'Sale' | 'SilentSale';
  /**
   * Output parameter for sending payment response.
   */
  @Output() onSubmitPaymentRequest: EventEmitter<string> = new EventEmitter();
  /** @ignore */
  @ViewChild('iframeAuthorizeNet') iframe: ElementRef;
  /**
    * unique ID of gateway transaction to track the status.
    * @ignore
  */
  gatewayTransactionId: string;
  /**
    * loading flag
    * @ignore
  */
  isLoading: boolean;
  /**
    * transaction request details
    * @ignore
  */
  transactionRequestModel: any;
  /** @ignore */
  private subscriptions: Subscription[] = [];

  constructor(private ngZone: NgZone,
    private paymentService: PaymentService,
    private gatewayCommunicationService: GatewayCommunicationService,
    private _compiler: Compiler) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.transactionRequestModel = {};
    this.paymentTransaction.PaymentType=this.paymentType;
    if (this.paymentType === 'SilentSale')
      this.paymentForOrder();
    else
      this.saleCaptureMethod();

  }

   /**
   * Method to get transaction details and redirect to third party payment system for transaction
   * @ignore
   */
  saleCaptureMethod() {
    this.subscriptions.push(this.paymentService.saleCaptureMethod(this.paymentTransaction).subscribe(response => {
      this.ngZone.run(() => {
        if (response === null) return;
        this.transactionRequestModel = response[0];
        this.gatewayTransactionId = response[1];
      });
      setTimeout(() => {
        let element: HTMLElement = document.getElementById('addPaymentMethod') as HTMLElement;
        if (element) element.click();
      }, 100);

    }));

  }
   /**
   * Method to get transaction details and do the transaction silent at client side
   * @ignore
   */
  paymentForOrder() {
    this.subscriptions.push(this.paymentService.silentOrderPayment(this.paymentTransaction).subscribe(response => {
      this.ngZone.run(() => {
        if (response === null) return;
        this.transactionRequestModel = response[0];
        this.gatewayTransactionId = response[1];
      });
      setTimeout(() => {
        let element: HTMLElement = document.getElementById('addPaymentMethod') as HTMLElement;
        if (element) element.click();
      }, 100);
    }));

  }
  /**
  * This method has been called everytime whenever page will load inside IFrame
  * @ignore
  */
  onLoadIframe() {
    setTimeout(() => this.isLoading = false, 5000);
  }
  /** @ignore */
  @HostListener('window:message',['$event'])
  /** @ignore */
  getCommunicationResponse(e) {
    if(this.gatewayTransactionId && get(e.data,'payment') === 'true'){
      this.isLoading = true;
      let subscription$ = this.gatewayCommunicationService.getResponseUpdate(this.gatewayTransactionId).subscribe(response => {
        if (!isNil(response)) {
          this.isLoading = false;
          this.onSubmitPaymentRequest.emit(get(response, 'GatewayTransactiont.Status'));
        }
    });
      this.subscriptions.push(subscription$);
    }
  }
  ngOnDestroy() {
    this._compiler.clearCache();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

