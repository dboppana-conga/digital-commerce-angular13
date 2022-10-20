import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ConfigurationState } from '../../../shared/interfaces/configuration-state.interface';
import { CartItem, Product, CartService, CartRequest, ProductOptionComponent } from '@congacommerce/ecommerce';
import { CacheService } from '@congacommerce/core';
import { map as _map, includes, filter, set } from 'lodash';
import { take } from 'rxjs/operators';

/**
 * Product configuration are a complex feature when configuring products with option groups and attribute groups based
 * on business logic.
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductConfigurationService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private productConfigurationService: ProductConfigurationService)
}
// or
export class MyService extends AObjectService {
     private productConfigurationService: ProductConfigurationService = this.injector.get(ProductConfigurationService);
 }
```
 */
@Injectable({
  providedIn: 'root'
})

export class ProductConfigurationService {

  constructor(private cacheService: CacheService, private cartService: CartService) { }

  /**
   * Behavior subject emits the configuration state change.
   */
  configurationChange: BehaviorSubject<ConfigurationState> = new BehaviorSubject({} as ConfigurationState);

  /** stores the quantity of the primary product */
  public productQuantity: number = 1;

  /**
   * Method responsible to emit the latest configuration State.
   * ### Example:
```typescript
import { ProductConfigurationService } from '@congacommerce/ecommerce';
import { ConfigurationState } from '../../../shared/interfaces/configuration-state.interface';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    constructor(private productConfigurationService: ProductConfigurationService){}

    onChangeConfiguration(configuration: ConfigurationState){
         this.productConfigurationService.onChangeConfiguration(configuration);
    }
}
```
   * @param configuration accepts the info about the current configuration state in product detail page.
   */
  onChangeConfiguration(configuration: ConfigurationState) {
    this.configurationChange.next(configuration as ConfigurationState);
  }

  /**
   * This method will accepts and stores the quantity of the Primary product in its local state.
   * ### Example:
```typescript
import { ProductConfigurationService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    constructor(private productConfigurationService: ProductConfigurationService){}

    changeProductQuantity(qty: number){
         this.productConfigurationService.changeProductQuantity(qty);
    }
}
```
   * @param qty is of type number.
  */
  changeProductQuantity(qty: number) {
    this.productQuantity = qty;
  }
  /**
   * Method responsible for fetching the primary lineitem of the product.
   * ### Example:
```typescript
import { ProductConfigurationService, Product, CartItem } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    primaryLineItem: CartItem;

    constructor(private productConfigurationService: ProductConfigurationService){}

    getProductAttributeGroups(product: Product){
        this.primaryLineItem = this.productConfigurationService.getPrimaryItem(product);
    }
}
```
   * @param product requires instance of product object.
   * @returns an instance of cartItem object.
   */
  getPrimaryItem(product: Product): CartItem {
    const primaryItem: CartItem = plainToClass(CartItem, product.get('item'), {ignoreDecorators: true});
    if (primaryItem && primaryItem.Quantity !== this.productQuantity) {
      primaryItem.Quantity = this.productQuantity;
      return primaryItem;
    }
  }

  /**
  *  @ignore
  */
  addOption(cartItems: Array<CartItem>) {
    return this.cacheService.buffer(
      'cart-item-add',
      cartItems,
      data => {
        const lineItems = _map(data, (cartItem, index) => {
          return {
            'PrimaryTxnLineNumber': cartItem.PrimaryLineNumber+index,// need to send unique txn no. when multiple options are passed in the same call
            'ProductId': cartItem.Product.Id,
            'OptionId': cartItem.ProductOption.ComponentProduct.Id,
            'ExternalId': this.cartService.guid(),
            'ParentBundleNumber': cartItem.ParentBundleNumber,
            'LineType': 'Option',
            'PricingStatus': 'Pending'
          } as unknown as CartRequest;
        });
        return this.cartService.addItem(lineItems)
      },
      allItems => {
        filter(allItems, a => includes(_map(cartItems, 'Id'), a.Id));
      },
      2000
    );
  }

  /**
  *  @ignore
  */
  removeOption(cartItems: Array<CartItem>, component: ProductOptionComponent) {
    set(component, 'ComponentProduct._metadata.loading', true);
    this.cacheService.buffer(
      'cart-item-add',
      cartItems,
      data => {
        return this.cartService.removeCartItems(data)
      },
      allItems => {
        filter(allItems, a => includes(_map(cartItems, 'Id'), a.Id));
      },
      2000
    ).pipe(take(1)).subscribe(res => {
        set(component, 'ComponentProduct._metadata.loading', false);
    });
  }

  /**
  *  @ignore
  */
  updateOption(cartItem: Array<CartItem>, component: ProductOptionComponent) {
    set(component, 'ComponentProduct._metadata.loading', true);
    this.cartService.updateItems(cartItem).pipe(take(1)).subscribe((res) => {
      set(component, 'ComponentProduct._metadata.loading', false);
    });
  }

}

