import { Component, Input, DoCheck, OnInit, ViewEncapsulation } from '@angular/core';
import { AObject, AObjectError } from '@congacommerce/core';
import { Cart, CartService, StorefrontService } from '@congacommerce/ecommerce';
import { get, filter, find } from 'lodash';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { RevalidateCartService } from '../revalidate-cart-modal/services/revalidate-cart.service';
/**
 * <strong>This component is a work in progress.</strong>
 * 
 * The Alert component is used to display alert messages in the application. This alert display varies with the message type. Errors will be displayed as alert-danger.
 * Warnings will be dispalyed as alert-warning.Information will be displayed as alert-info.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/alert.png" style="max-width: 100%">
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { AlertModule } from '@congacommerce/elements';
@NgModule({
  imports: [AlertModule, ...]
})
export class AppModule {}
```
*
* @example
```typescript
*  <apt-alert 
*           [record]="record"
*           layout="alert"
*           message="error message"  
*  ></apt-alert>
*/
@Component({
  selector: 'apt-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, DoCheck {

  /**
   * Record is instance of an Aobject, to fetch error for
   */
  @Input() record: AObject;
  /**
   * Use to set the layout for error messages to be displayed 
   * either in alert with accordian or inline message.
   */
  @Input() layout: 'alert' | 'inline' = 'alert';
  /**
   * Boolean flag to expand error message.
   */
  @Input() expand: boolean = true;
  /**
   * Use to hold dyanmic error message.
   */
  @Input() message: string = 'ERROR.RECORD_ERROR';
  /**
   * The flag which indicates to invoke  the Pricing call automatically.
   */
  @Input() autoRun: boolean = true;
  /**
   * Use to hold error list of type array of AObjectError.
   */
  errorList: Array<AObjectError>;
  /**
   * Boolean observable to check if any price error.
   */
  priceError$: Observable<boolean>;
  /**
   * Boolean observable to differed price of cart line items.
   */
  deferredPrice$: Observable<boolean>;
  /**
   * Boolean observable to check whether cart item need to revalidate or not.
   */
  revalidateLines$: Observable<boolean>;
  /** 
   * Flag to show loader
   * @ignore
   */
  loading: boolean = false;

  /** @ignore */
  alertColorMap = {
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
    primary: 'alert-primary'
  };

  /**
   * Constructor for Add to Cart Component for injecting dependencies.
   *
   * @param cartService Instance of CartService
   * @param storefrontService Instance of StorefrontService
   * @param revalidateCartService Instance of RevalidateCartService
  */
  constructor(private cartService:CartService, 
              private storefrontService: StorefrontService, 
              private revalidateCartService:RevalidateCartService) {}

  /** @ignore */
  ngOnInit(): void {
    this.priceError$ = this.cartService.getCartPriceStatus();
  }

  ngOnChanges() {
    this.loading = false;
    // TODO: Add this back when we have a support for deferred pricing in RLP/Conga platform.
    // this.deferredPrice$ = this.storefrontService.getDeferredPrice().pipe(map(r => {
    //   return !this.autoRun && this.record instanceof Cart
    //     && (((get(this.record, 'IsPricePending') || this.record.get('IsPriced')) && this.record.LineItems.length > 0)
    //       || filter(get(this.record, 'LineItems'), r => r.PricingStatus == 'Pending').length > 0)
    //     && r;
    // }));
    if (this.record instanceof Cart && (get(this.record, 'IsPricePending') || this.record.get('IsPriced') || find(get(this.record, 'LineItems'), r => r.PricingStatus == 'Pending')) && this.autoRun) {
      this.cartReprice();
    }
    this.revalidateLines$ = this.revalidateCartService.getRevalidateLines().pipe(
      map(res => this.record instanceof Cart && res && get(res.required, 'length') === 0 && get(res.optional, 'length') > 0)
    );
  }

  /** @ignore */
  ngDoCheck() {
    this.errorList = filter(get(this.record, 'errors'), er => er.message !== 'INVALID_QUANTITY');
  }

  /** @ignore */
  trackByFn(index, item) {
    return item.message;
  }

  /**
   * Open revalidate cart modal popup
   */
  openRevalidateCartModal() {
    const modalOptions: ModalOptions = {
      backdrop: true,
      keyboard: true,
      class: 'modal-lg'
    };
    this.revalidateCartService.openRevalidateModal(modalOptions);
  }

  /**
   * An attempt to price cart is made.
   */
  cartReprice() {
    this.loading = true;
    this.cartService.priceCart();
  }

  /**
   * Creates new cart and set it as active.
   */
  createCart() {
    this.loading = true;
    this.cartService.createNewCart().pipe(take(1))
      .subscribe(() => this.loading = false);
  }

}