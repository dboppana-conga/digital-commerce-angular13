
import { Component, ChangeDetectionStrategy, Input, OnChanges, OnDestroy } from '@angular/core';
import { of, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { isArray, some, defaultTo, get } from 'lodash';
import { AObject } from '@congacommerce/core';
import {
  PriceService, Cart, CartItem, Product, ProductOptionComponent,
  Order, ProductAttributeValue, Price, OrderLineItem, Quote, QuoteLineItem,
  LocalCurrencyPipe, AssetLineItem
} from '@congacommerce/ecommerce';
/**
 * Wrapper component for displaying the price of a record. Supports cart, product, cart item, product options and orders.
 * <strong>This component is a work in progress.</strong>
 * Change detection on this component has been tuned, so use this component in favor of using the price pipes directly.
 * <h3>Preview</h3>
 *  <div>
 *    <h4>Price component used to display prices on mini cart</h4>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/price.PNG" style="max-width: 100%">
 *  </div>
 * <h3>Usage</h3>
 *
 ```typescript
import { PriceModule } from '@congacommerce/elements';

@NgModule({
  imports: [PriceModule, ...]
})
export class AppModule {}
 ```
* @example
* // Basic Usage
* ```typescript
* <apt-price [record]="product"></apt-price>
```
*
* // All inputs and outputs.
```typescript
* <apt-price
*             [record]="product"
*             [quantity]="1"
*             [attributeValue]="attributeValue"
*             [formatted]="false"
*             [type]="total"
*             [term]="term"
*             [bundle]="true"
* ></apt-price>
```
*/
@Component({
  selector: 'apt-price',
  template: `
    <ng-container *ngIf="price$ | async as price; else empty">
      {{price}}
    </ng-container>
    <ng-template #empty>-</ng-template>
  `,
  styles: [`
    :host{
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceComponent implements OnChanges, OnDestroy {

  /**
   * The input record to display the price for. Can be of type Cart, Product, CartItem, ProductOptionComponent or Order
   */
  @Input() record: Cart |
    Product |
    CartItem |
    ProductOptionComponent |
    Order |
    OrderLineItem |
    Quote |
    QuoteLineItem |
    AssetLineItem |
    Array<CartItem | AssetLineItem | QuoteLineItem | CartItem>;
  /**
   * Instance of ProductAttributeValue used to calculate the price of bundle product record.
   */
  @Input() attributeValue: ProductAttributeValue;
  /**
   * Term used to calculate price of bundle product.
   */
  @Input() term: number;
  /**
   * The quantity of the record (defaults to 1)
   */
  @Input() quantity?: number = 1;
  /**
   * Flag to set this product type as a bundle
   */
  @Input() bundle: boolean = false;
  /**
   * Optional boolean argument to display the price as a formatted currency or as a raw number (defaults to true)
   */
  @Input() formatted: boolean = true;
  /**
   * The type of the output; net price, base price, discounted price or unit price (defaults to net)
   */
  @Input() type: 'net' | 'base' | 'discount' | 'baseExtended' | 'list' | 'listExtended' = 'net';
  /**
   * The input option to display the price for line items. 
   * option type Can be Array of asset line items or Array of quote line item or Array of order line items
   */
  @Input() options: Array<AssetLineItem | QuoteLineItem | OrderLineItem>;
  /** @ignore */
  price$: BehaviorSubject<number | string> = new BehaviorSubject(0);
  /** @ignore */
  subscription: Subscription;

  constructor(private priceService: PriceService, private localCurrencyPipe: LocalCurrencyPipe) { }

  /**
   * @ignore
   */
  getObservable(): Observable<Price> {
    if (this.record instanceof Quote)
      return this.priceService.getQuotePrice(this.record as Quote);
    else if (this.record instanceof Cart)
      return this.priceService.getCartPrice(this.record as Cart);
    else if (this.record instanceof Product)
      return this.priceService.getProductPrice(this.record as Product, this.quantity, this.term, this.attributeValue, this.bundle);
    else if (this.record instanceof ProductOptionComponent)
      return this.priceService.getOptionAdjustmentPrice(this.record as ProductOptionComponent, this.quantity);
    else if (this.record instanceof Order)
      return this.priceService.getOrderPrice(this.record as Order);
    else if (this.isItem(this.record))
      return this.priceService.getLineItemPrice(this.record, this.options);
    else
      return of(null);
  }
  /** @ignore */
  isItem(record: AObject | Array<AObject>) {
    const check = (i: AObject) => {
      return i instanceof OrderLineItem
        || i instanceof CartItem
        || i instanceof AssetLineItem
        || i instanceof QuoteLineItem;
    };
    return isArray(record) ? some(record, check) : check(record as AObject);
  }

  ngOnChanges() {
    this.ngOnDestroy();
    this.subscription = this.getObservable()
      .pipe(
        map((price: Price) => defaultTo(price, new Price(this.localCurrencyPipe))),
        switchMap((price: Price) => (this.formatted) ? get(price, `${this.type}Price$`) : of(get(price, `${this.type}Price`)))
      )
      .subscribe((price: number | string) => {
        this.price$.next(price);
      });
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
