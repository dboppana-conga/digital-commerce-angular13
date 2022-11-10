import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { take, map, tap, retryWhen, delay, switchMap, filter as rfilter, catchError } from 'rxjs/operators';
import {
  map as _map, get, set, first, flatten, find, filter, concat, isEmpty, forEach, isNil, cloneDeep, every,
  keyBy, merge, values, remove, includes, uniqBy, compact, omit, uniq, bind, defaultTo, debounce, last, isArray
} from 'lodash';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';
import { AObjectService, ApiService, ConfigurationService } from '@congacommerce/core';
import { CartError } from '../enums';
import { Cart } from '../classes/cart.model';
import { CartItem } from '../classes/cart-item.model';
import { Product } from '../../catalog/classes/product.model';
import { AppliedRuleActionInfo } from '../../constraint-rules/classes/constraint-rules/applied-rule-action-info.model';
import { FavoriteRequest } from '../../favorite/interfaces/favorite.interface';
import { FieldFilter } from '../../../interfaces';
import { UserService } from '../../crm/services/user.service';
import { ActionQueue } from './action-queue.service';
import { StorefrontService } from '../../store/services/storefront.service';
import { CategoryService } from '../../catalog/services/category.service';
import { PriceListService } from '../../pricing/services/price-list.service';
import { CartItemProductService } from './cart-item-product.service';

/** @ignore */
const _moment = moment;
/**
 * A Cart contains the product and custom cart items that a user may wish to purchase.
 * <h3>Usage</h3>
 *
 ```typescript
import { CartService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private cartService: CartService)
}
// or
export class MyService extends AObjectService {
     private cartService: CartService = this.injector.get(CartService);
 }
```
 */


@Injectable({
  providedIn: 'root'
})

export class CartService extends AObjectService {
  onCartError: EventEmitter<CartError> = new EventEmitter<CartError>();
  type = Cart;

  private static STORAGE_KEY = 'local-cart';
  private static DeferredPrice: boolean;
  private state: BehaviorSubject<Cart> = new BehaviorSubject(null);

  private cartLookups = `AccountId,PriceListId,OrderId,Proposald,Account.PriceListId,Account.OwnerId,ShipToAccountId,BillToAccountId`;
  private cartChildren = `SummaryGroups,Applied_Rule_Infos,AppliedRuleActionInfos`;
  private lineItemLookups = `ProductId,OptionId,PriceListItemId,AttributeValueId,AssetLineItemId,ProductOptionId`;
  private lineItemChildren = `AdjustmentLineItems,TaxBreakups`;

  apiService: ApiService = this.injector.get(ApiService);
  protected userService: UserService = this.injector.get(UserService);
  protected configService: ConfigurationService = this.injector.get(ConfigurationService);
  protected storefrontService: StorefrontService = this.injector.get(StorefrontService);
  protected categoryService: CategoryService = this.injector.get(CategoryService);
  protected priceListService: PriceListService = this.injector.get(PriceListService);
  protected cartItemProductService: CartItemProductService = this.injector.get(CartItemProductService);
  protected ngZone: NgZone = this.injector.get(NgZone);

  protected actionQueue: ActionQueue = this.injector.get(ActionQueue);

  /**
 * Need to use an offset to account for the debounce time. (i.e. user clicking add to cart a really quickly)
 */
  private lineItemOffset = 0;
  private debounceReset;

  onInit() {
    this.refreshCart();
    this.storefrontService.getDeferredPrice().pipe(take(1)).subscribe(response => CartService.DeferredPrice = response);
  }

  /**
       * The Static method fetched the Current Cart's Id stored in local storage.
       * ### Example:
  ```typescript
  import { CartService, Cart} from '@congacommerce/ecommerce';
  import { Observable } from 'rxjs/Observable';
  
  export class MyComponent implements OnInit{
      cartId: string;
  
      getCurrentCart(){
          this.cartId = CartService.getCurrentCartId();
      }
  }
  ```
      **/
  static getCurrentCartId(): string {
    if (localStorage.getItem(this.STORAGE_KEY))
      return localStorage.getItem(this.STORAGE_KEY);
    else return 'active';
  }

  /**
     * The Static method removes the Cart from the local storage.
     * ### Example:
```typescript
import { CartService, Cart} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    deleteCart(){
      CartService.deleteLocalCart();
    }
}
```
    **/
  static deleteLocalCart() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
     * The Static method sets the Current Cart in the local storage.
     * ### Example:
```typescript
import { CartService, Cart} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    SetCart(cartId: string){
        CartService.setCurrentCartId(cartId);
    }
}
```
    **/
  static setCurrentCartId(cartId: string) {
    localStorage.setItem(this.STORAGE_KEY, cartId);
  }

  /**
   * @ignore
   */
  private getQueryParams() {
    const params = [];
    this.configService.get('skipPricing') && params.push('price=skip');
    this.configService.get('skipRules') && params.push('rules=skip');
    params.push(`children=${this.lineItemChildren}`);
    params.push(`lookups=${this.lineItemLookups}`);
    return params.join('&');
  }

  /**
   * The isPricepending method checks the cart is pricepending flag and return the boolean value.
   * ### Example:
```typescript
import { CartService, Cart} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    isPricePending: Boolean;

    constructor(private cartService: CartService){}

    isPricePending(cart: Cart ){
        this.isPricePending = this.cartService.isPricePending(cart);
    }
}
```
   * @param cart  instance of cart
   * @returns boolean value of cart is Pricepending flag.
   */
  isPricePending(cart: Cart): boolean {
    return get(cart, 'IsPricePending', false);
  }

  private loadHeader(): void {
    const cart$ = this.apiService.get(`/cart/v1/carts/${CartService.getCurrentCartId()}`, this.type, false);
    cart$.subscribe((cart) => {
      if (get(this.state, 'value.LineItems'))
        set(cart, 'LineItems', get(this.state, 'value.LineItems'));
      if (CartService.DeferredPrice && this.state.value && this.state.value.get('IsPriced'))
        cart.set('IsPriced', this.state.value.get('IsPriced'));
      this.publish(cart);
    });
  }

  private getCartLineItems(cartId: String): Observable<Array<CartItem>> {
    if (!isNil(cartId)) {
      return this.apiService.get(`/cart/v1/carts/${CartService.getCurrentCartId()}/items`).pipe(
        map(response => plainToClass(this.metadataService.getTypeByApiName('LineItem'), response.LineItems) as unknown as Array<CartItem>)
      )
    } else {
      return of(null);
    }
  }

  /**
   * @ignore 
   */
  reprice(): void {
    (!CartService.DeferredPrice) ? this.priceCart() : this.refreshCart();
  }
  /**
   * @ignore
   * Refreshes a cart based on the given id.
   * ### Example:
```typescript
import { CartService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private cartService: CartService){}

    refreshCart(){
        this.cartService.refreshCart().subscribe(
            () => {...},
            err => {...}
        );
    }
}
```
   * @override
   */
  refreshCart() {
    let attempts = 0;
    return this.userService
      .isLoggedIn()
      .pipe(
        switchMap(loggedIn => {
          //TO DO: RLP  cart/active API 
          if (CartService.getCurrentCartId() === 'active')
            return combineLatest([of(loggedIn), this.createNewCart()])
          else
            return combineLatest([of(loggedIn), of(null)]);
        }),
        switchMap(res => {
          const loggedIn = first(res);
          const cartId = last(flatten(res)) ? get(last(flatten(res)), 'Id') : CartService.getCurrentCartId();
          const cartItemResp$ = this.apiService.get(`/cart/v1/carts/${cartId}/items`);
          const obsv$ = cartItemResp$
            .pipe(
              switchMap(data => combineLatest([of(data), this.cartItemProductService.addProductInfoToLineItems(get(data, 'LineItems'))])),
              switchMap(([res, cartItems]) => {
                const cart = plainToClass(this.type, get(res, 'Cart'));
                const lineItems = plainToClass(CartItem, cartItems, { ignoreDecorators: true });
                // TODO: This is added temporarily for the demo as get cart lines always returns Pricing Status as Pending.
                _map(lineItems, item => set(item, 'PricingStatus', 'Complete'));
                set(cart, 'LineItems', lineItems);
                return of(cart);
              })
            );
          return obsv$.pipe(
            map((cart: Cart) => {
              if (loggedIn && !isNil(get(cart, 'Id')))
                CartService.setCurrentCartId(get(cart, 'Id'));
              else if (isNil(cart) && localStorage.getItem(CartService.STORAGE_KEY)) {
                CartService.deleteLocalCart();
                this.refreshCart();
              }

              if (get(cart, 'IsPricePending') === true && this.configService.get('pricingMode') !== 'turbo') {
                if (attempts <= this.configService.get('cartRetryLimit', 3)) {
                  throw new Error('Cart Pending');
                }
              }

              return cart;
            }),
            retryWhen(errors =>
              errors.pipe(
                tap(e => {
                  if (e.message === 'Cart Pending')
                    attempts += 1;
                  else
                    throw e;
                }),
                delay(500)
              )
            )
          );
        }),
        take(1)
      ).subscribe(c => this.publish(c));
  }

  /**
   * Publish method is used to emit the state of the cart.
   * ### Example:
```typescript
import { CartService, Cart } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private cartService: CartService){}

    publishCart(cart: Cart){
        this.cartService.publish(cart);
    }
}
```
   * @param cart instance of cart.
   */
  public publish(cart: Cart) {
    this.ngZone.run(() => this.state.next(cloneDeep(cart)));
  }

  private republish(pending: boolean = false) {
    this.state.value.IsPricePending = pending;
    if (pending)
      this.ngZone.run(() => this.state.next(this.state.value));
    else
      this.loadHeader();
  }

  private remove(cartId: string | Array<string>): Observable<boolean> {
    const obsv$ =
      cartId instanceof Array
        ? this.apiService.delete(`/cart/v1/carts`, cartId)
        : this.apiService.delete(`/cart/v1/carts/${cartId}`);

    return obsv$.pipe(
      map(deleteList => every(deleteList, l => l === 'Deleted successfully!')),
      tap(c => this.refreshCart())
    );
  }

  private onAdd(cart?: Cart): void {
    set(this.state.value, 'SummaryGroups', get(cart, 'SummaryGroups'));
    this.state.value.IsPricePending = false;
  }

  /**
   *
   * @ignore
   */
  addItem(cartRequestList: Array<CartRequest> | FavoriteRequest): Observable<Array<CartItem>> {
    let cartId;
    let cartRef: Cart;
    const addItemResp$ = this.getMyCart().pipe(
      take(1),
      switchMap(data => (isNil(get(data, 'Id'))) ? this.createNewCart() : of(data)),
      switchMap((cart: Cart) => {
        cartId = cart.Id
        return this.apiService.post(`/cart/v1/carts/${cart.Id}/items`, cartRequestList)
      }),
      switchMap(data => {
        if (get(data, 'Title') === ErrorMessage.SERVER_IS_TAKING_LONGER_THAN_EXPECTED) {
          this.priceCart();
          return of(null);
        } else {
          const items = get(data, 'CartResponse.LineItems');
          cartRef = get(data, 'CartResponse');
          return this.cartItemProductService.addProductInfoToLineItems(items);
        }
      }),
      map(result => {
        if (get(result, 'length') === 0) {
          throw 'Failed to add item(s)';
        }
        else {
          return plainToClass(CartItem, result, { ignoreDecorators: true }) as unknown as Array<CartItem>;
        }
      })
    );
    return this.actionQueue.queueAction(addItemResp$, bind(() => { }, this)).pipe(
      tap(cartItemList => {
        this.onAdd(cartRef);
        this.mergeCartItems(cartItemList);
      })
    );
  }

  private mergeCartItems(cartItemList: Array<CartItem>) {
    if (!isNil(cartItemList) && !isEmpty(cartItemList) && isArray(cartItemList)) {

      const keyFn = (r) => r.LineNumber + '.' + r.PrimaryLineNumber + '.' + r.ItemSequence;

      remove(get(this.state.value, 'LineItems'), (l) => includes(_map(cartItemList, 'LineNumber'), l.LineNumber) && l.LineType === 'Option' && !includes(cartItemList, find(cartItemList, i => keyFn(i) === keyFn(l))));

      set(this.state.value, 'LineItems', values(merge(keyBy(get(this.state.value, 'LineItems'), keyFn), keyBy(cartItemList, keyFn))));
      this.publish(this.state.value);
      const configId = get(first(cartItemList), 'Configuration.Id');
      if (!isNil(configId))
        localStorage.setItem(CartService.STORAGE_KEY, configId);
    }
  }

  private resetOffset() {
    this.lineItemOffset = 0;
  }

  /**
  * 
  * @ignore
  */
  updateItem(cartItemId: string, cartRequestList: Array<CartRequest>, isEmbedded: boolean = false): Observable<Array<CartItem>> {

    const updateItem$ = this.apiService.patch(
      `/cart/v1/carts/${CartService.getCurrentCartId()}/items`,
      cartRequestList
    );
    return updateItem$.pipe(
      map(result => {
        const items = result.CartResponse.LineItems;
        if (isEmpty(items)) {
          throw ErrorMessage.FAILED_TO_UPDATE;
        }
        else return plainToClass(this.metadataService.getTypeByApiName('LineItem'), items) as unknown as Array<CartItem>;
      }),
      tap(response => this.mergeCartItems(response))
    );
  }

  /**
  * @param cartId Cart identifier of the cart to be cloned. If the param is not specified, it creates a clone of active cart in the application.
  * @param targetCartId Optional param to specify the target cart to be cloned to.
  * @returns Observable of the cloned cart when operation completes.
  * @ignore
  */
  cloneCart(cartId: string = CartService.getCurrentCartId(), targetId: string = null): Observable<Cart> {
    //const params = targetId ? `&target=${targetId}` : '';
    // TODO: Integrate with RLP API to clone cart.
    return of(null)
  }

  /**
   * @ignore
   * To DO:
   */
  updateItems(cartItems: Array<CartItem>): Observable<Array<CartItem>> {
    return this.cacheService.buffer(
      'cart-item-update',
      cartItems,
      data => {
        const lineItems = _map(data, cartItem => {
          return {
            'PrimaryLineNumber': cartItem.PrimaryLineNumber,
            'LineNumber': cartItem.LineNumber,
            'Quantity': cartItem.Quantity,
            'ProductId': defaultTo(get(cartItem, 'Product.Id'), cartItem.ProductId),
            'OptionId': get(cartItem, 'Option.Id', null),
            'LineType': cartItem.LineType,
            'PricingStatus': 'Pending',
            'Id': cartItem.Id,
            'StartDate': cartItem.StartDate,
            'EndDate': cartItem.EndDate,
            'AdjustmentType': cartItem.AdjustmentType,
            'AdjustmentAmount': cartItem.AdjustmentAmount,
            'ParentBundleNumber': cartItem.ParentBundleNumber
          };
        });
        let cartRef: Cart;
        const updateItemsResp$ = this.apiService.patch(`/cart/v1/carts/${CartService.getCurrentCartId()}/items`, lineItems)
          .pipe(
            map(response => {
              if (get(response, 'Title') === ErrorMessage.SERVER_IS_TAKING_LONGER_THAN_EXPECTED) {
                this.priceCart();
                return of(null);
              } else {
                const items = response.CartResponse.LineItems;
                cartRef = response.CartResponse;
                return plainToClass(this.metadataService.getTypeByApiName('LineItem'), items) as unknown as Array<CartItem>
              }
            })
          );
        return this.actionQueue.queueAction(updateItemsResp$, bind(() => { }, this)).pipe(
          tap(cartItemList => {
            this.onAdd(cartRef);
            this.mergeCartItems(cartItemList);
          }));
      },
      allItems => {
        filter(allItems, a => includes(_map(cartItems, 'Id'), a.Id));
      },
      1000
    );
  }

  /**
     * The primary method to get the user's current cart. This is a hot observable that will be updated when the state of the cart changes.
     *
     * ### Example:
```typescript
import { CartService } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{
    cart: Cart;
    cart$: Observable<Cart>; // can be used in the template with {{(cart$ | async)?.Name}}

    constructor(private cartService: CartService){}

    ngOnInit(){
        this.cartService.getMyCart().subscribe(cart => this.cart = cart);
        // or
        this.cart$ = this.cartService.getMyCart();
    }
}
```
     * @override
     * @returns A hot observable containing the single cart instance
     * @param reprice true / false will trigger a reprice operation if there are any pending line items
     */
  getMyCart(pending: boolean = false): Observable<Cart> {
    return this.state.pipe(rfilter(c => !isNil(c)));
  }

  /**
     * Creates a new cart. Will set the account id, price list id, effective price list id on the cart and set the status to 'New'
     *
     * ### Example:
```typescript
import { CartService } from '@congacommerce/ecommerce';

export class MyComponent{

    constructor(private cartService: CartService){}

    createNewCart(){
        const cart = new Cart();
        cart.Apttus_Config2__Status__c = 'Finalized';
        this.cartService.createNewCart(cart).subscribe(c => {...});
    }
}
```
     *
     * @override
     * @param cartData an instance of a cart with any prepopulated parameters
     * @returns a cold cart observable with the populated cart after inserting into the database
     */
  createNewCart(cartData: Cart = new Cart()): Observable<Cart> {
    const cart = cloneDeep(cartData);
    return this.priceListService.getEffectivePriceListId().pipe(
      switchMap(priceListId => {
        const cartPayload = Object.assign(cart, { Name: cart.Name ? cart.Name : 'Test' }) as Cart;
        const accountId = localStorage.getItem('account');
        set(cartPayload, 'PriceList.Id', priceListId);
        if (accountId) set(cartPayload, 'Account.Id', accountId);
        cartPayload.ExpectedStartDate = _moment(new Date()).format('YYYY-MM-DD');
        return this.apiService.post(`/cart/v1/carts`, new Array(cartPayload.strip()), this.type, null, false)
      }),
      switchMap(cartResult => {
        const cart = first(cartResult) as Cart;
        const cartpayload = { 'Id': cart.Id, 'Name': cart.Id };
        return isNil(cartData.Name) ? this.apiService.patch(`/cart/v1/carts`, [cartpayload], this.type, false) : of([cart]);
      }),
      tap(cart => CartService.setCurrentCartId(get(first(cart), 'Id'))),
      tap(c => this.publish(first(c))),
      take(1)
    );
  }

  /**
     * Deletes a specified cart instance from the database
     *
     * ### Example:
```typescript
import { CartService } from '@congacommerce/ecommerce';

export class MyComponent{
    private cart: Cart;
    constructor(private cartService: CartService){}

    deleteCart(){
        this.cartService.deleteCart(cart).subscribe(c => {...});
    }
}
```
     * @override
     * @param cart the cart instance to delete
     * @returns a cold boolean observable representing the success state of the delete operation
     */
  deleteCart(cart: Cart | Array<Cart>): Observable<boolean> {
    const cartId = flatten(_map(cart, (cartElement: Cart) => [{ 'Id': cartElement.Id }]));
    const obsv$ = this.apiService.delete(`/cart/v1/carts`, cartId)
    return obsv$.pipe(
      map(deleteList => every(deleteList, l => l === 'Deleted successfully!')),
      tap(c => this.refreshCart())
    );
  }
  /**
     * setActiveCart: Method sets the selected cart as active and deactivates any other carts
     *
     * ### Example:
```typescript
import { CartService, Cart } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{

    constructor(private cartService: CartService){}

    setActive(cart: Cart){
        this.cartService.setCartActive(cart).subscribe(success => {...});
    }
}
```
     * @override
     * @param cart Instance of the cart to be set active 
     * @return Observable<boolean> returns a boolean observable containing true if the cart was successfully set active.
     */
  setCartActive(cart: Cart, priceCart: boolean = false): Observable<Cart> {
    cart.EffectiveDate = _moment(new Date()).format('YYYY-MM-DD');
    const lineItemRes$ = priceCart ? this.getCartLineItems(get(cart, 'Id')) : of(null);
    return combineLatest([
      this.apiService.patch(`/cart/v1/carts`, [{ 'Id': cart.Id, 'EffectiveDate': cart.EffectiveDate }], this.type, false),
      lineItemRes$
    ]).pipe(
      map(([cartList, lineItemRes]) => {
        const cart = first(cartList) as Cart;
        CartService.setCurrentCartId(get(cart, 'Id'));
        if (priceCart) {
          cart.LineItems = lineItemRes;
          this.state.next(cart);
          this.priceCart();
        } else
          this.refreshCart();
        return cart;
      }),
      tap(() => this.categoryService.refresh())
    );

  }
  /**
     * Adding a Product to Cart is the most common Cart action. Will trigger a reprice operation asynchronously.
     *
     * ### Example:
```typescript
import { CartService, Product, ProductAttributeValue } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{

    constructor(private cartService: CartService){}

    addProductToCart(product: Product, quantity: number, productAttributeValueList: Array<ProductAttributeValue>): void{
        this.cartService.addProductToCart(product, quantity, productAttributeValueList, null, true, true).subscribe(
            () => {...},
            err => {...}
        )
    }
}
```
     * @override
     * @param product Product object for method
     * @param quantity number value for quantity
     * @return a void observable when the operation is complete
     */
  addProductToCart(
    product: Product,
    quantity: number = 1,
    cartItems?: Array<CartItem>,
    bundle: boolean = false
  ): Observable<Array<CartItem>> {

    const cartItem = find(cartItems, { IsPrimaryLine: true });
    const request = _map(cartItems, (item) => ({
      Id: item.Id,
      ExternalId: item.ExternalId,
      LineNumber: item.LineNumber,
      PrimaryLineNumber: item.PrimaryLineNumber,
      ProductId: item.Product.Id,
      OptionId: item.LineType === 'Option' ? item.Option.Id : null,
      Quantity: item.Quantity,
      LineType: item.LineType,
      PricingStatus: item.PricingStatus,
      ParentBundleNumber: item.ParentBundleNumber,
    }) as unknown as CartRequest
    );
    if (get(cartItem, 'Id'))
      return this.updateItem(get(cartItem, 'Id'), request, false);
    else if (!isEmpty(request))
      return this.addItem(request);
    else {
      const cartRequestList = [];
      const lineNumber = this.getNextPrimaryLineNumber(this.state.value.LineItems, this.state.value);
      const addItemPayload = {
        'PrimaryTxnLineNumber': lineNumber,
        'ExternalId': this.guid(),
        'ProductId': product.Id,
        'Quantity': quantity,
        'LineType': 'Product/Service',
        'PricingStatus': 'Pending'
      } as CartRequest;

      cartRequestList.push(addItemPayload);

      /* TODO: Below code is added temporarily to add default bundle options to cart.
        * To be removed when the API has an implicit support to add default bundle options.
      */
      if (product.HasOptions) {
        const defaultProductOptions = filter(flatten(_map(get(product, 'OptionGroups'), (group) => get(group, 'Options'))), c => get(c, 'Default') === true);
        forEach(defaultProductOptions, option => {
          cartRequestList.push({
            'PrimaryTxnLineNumber': this.getNextPrimaryLineNumber(this.state.value.LineItems, this.state.value),
            'ExternalId': this.guid(),
            'ProductId': product.Id,
            'OptionId': option.ComponentProduct.Id,
            'Quantity': option.DefaultQuantity,
            'TxnParentBundleNumber': lineNumber,
            'LineType': 'Option',
            'PricingStatus': 'Pending'
          })
        })
      }
      return this.addItem(cartRequestList);
    }
  }

  /** 
  * Adds an option product to a bundle product that is already in the current active cart.
   * ### Example:
```typescript
import { CartService, CartItem, Product } from '@congacommerce/ecommerce';
export class MyComponent {
      constructor(private cartService: CartService) {}
      addOption(cartItem: CartItem, option: Product, quantity: number) {
        this.cartService.addOptionToBundle(cartItem.Id, {
          ProductId: option.Id,
          Quantity: quantity;
        }).subscribe(
          cartItems => {...},
          err => {...}
        );
      }
}
```
   * @param bundleId Id of the CartLineItem object for the bundle product which is getting the option added to it.
   * @param payload CartRequest object that has the productId of the option product and the quantity to add to the bundle.
   * @ignore
   */
  addOptionToBundle(
    bundleId: string,
    payload: CartRequest
  ): Observable<Array<CartItem>> {
    // TODO: Integrate with RLP API.
    // const resp$ = of(null);
    // return this.actionQueue.queueAction(resp$, bind(() => {
    //   this.refreshCart();
    // }));
    return of(null)
  }
  /**
   * Update fields on the items specified in the cart item array. Will trigger a reprice cart operation.
     *
     * ### Example:
```typescript
import { CartService, CartItem } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private cartService: CartService){}
    updateCartItems(cartItem: CartItem, quantity: number): void{
        cartItem.Quantity = quantity;
        this.cartService.updateCartItems([cartItem]).subscribe(
            () => {...},
            err => {...}
        );
    }
}
```
     * @override
     * @param cartItemList an array of cart items. Matches based on the id and updates the related cart items with the new fields.
     * @returns a void observable when the operation has completed.
    * @ignore
     */
  updateCartItems(
    cartItemList: Array<CartItem>
  ): Observable<Array<CartItem>> {
    return this.getMyCart()
      .pipe(
        take(1),
        switchMap(cart => {
          const itemsAndOptions =
            // Flatten the 2d array into a 1d array
            uniqBy(flatten(
              // map will return a 2d array of cart items and their options with the updated end dates
              _map(cartItemList, cartItem => {
                set(cartItem, 'PricingStatus', 'Pending');
                // Get the list of options for the cart item
                const options = _map(filter(cart.LineItems, lineItem => lineItem.LineType === 'Option' && lineItem.ParentBundleNumber === cartItem.PrimaryLineNumber), item => item);

                // Set the end of the options to match the cart item
                forEach(options, o => {
                  set(o, 'EndDate', get(cartItem, 'EndDate'));
                });

                return concat(options, cartItem);
              })
            ), 'Id');
          this.republish(true);
          return this.updateItems(itemsAndOptions);
        })
      );
  }

  /**
     * Removes the specified cart item from the cart. Will trigger a reprice cart operation.
     *
     * ### Example:
```typescript
import { CartService, CartItem } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{

    constructor(private cartService: CartService){}
    removeCartItem(cartItem: CartItem): void{
        cartItem.Apttus_Config2__Quantity__c = quantity;
        this.cartService.removeCartItem(cartItem).subscribe(
            () => {...},
            err => {...}
        );
    }
}
```
     * @override
     * @param cartItem the instance of the cart item to remove
     * @param trigger when set to false, will not notify other components that a product has been added to the cart
     * @returns a void observable when the operation completes
     * @ignore
     */
  removeCartItem(
    cartItem: CartItem,
    async: boolean = true,
    trigger: boolean = true
  ): Observable<void> {
    let cartItems = new Array();
    cartItems.push(cartItem);
    return this.removeCartItems(cartItems).pipe(map(() => { }));
  }

  /**
   * Deletes multiple cart items from the cart.
   * @param cartItems Array of cart items to be deleted from the cart.
   * @ignore
   */
  removeCartItems(cartItems: Array<CartItem>): Observable<void> {
    const payload = [];
    const cartItemIds = _map(cartItems, 'Id');
    _map(cartItems, item => payload.push({ 'PrimaryLineNumber': item.PrimaryLineNumber }));
    const removeCartItems$ = this.apiService.delete(`/cart/v1/carts/${CartService.getCurrentCartId()}/items`, payload).pipe(
      tap(c => {
        const lines = get(this.state, 'value.LineItems');
        const lineNumbers = _map(filter(lines, (l) => includes(cartItemIds, l.Id)), 'LineNumber');
        const PrimaryLineItem = filter(lines, (i) => includes(cartItemIds, i.Id) && i.LineType === 'Product/Service');
        if (PrimaryLineItem.length > 0) {
          remove(get(this.state, 'value.LineItems', []), (o: CartItem) =>
            includes(lineNumbers, o.LineNumber)
          );
        } else {
          remove(get(this.state, 'value.LineItems', []), (o: CartItem) =>
            includes(cartItemIds, o.Id)
          );
        }
      })
    );

    return this.actionQueue.queueAction(removeCartItems$, bind(() => {
      this.priceCart();
    }, this));
  }

  /**
    * Updates a given cart based on the cart object passed.
    *
    * ### Example:
```typescript
import { CartService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{

    constructor(private cartService: CartService){}
    updateCart(cart: Cart): Observable<Cart> {
        this.cartService.updateCart(cart).subscribe(
            () => {...},
            err => {...}
        );
    }
}
```
    * @param cart instance of cart to be updated.
    * @returns observable instance of the updated cart.
   */
  updateCart(cart: Cart): Observable<Cart> {
    return this.apiService.patch(`/cart/v1/carts`, new Array(omit(cart, ['LineItems', 'SummaryGroups']).strip()), this.type, false);
  }

  /**
     * priceCart method triggers the server-side pricing engine for the cart
     *
     * ### Example:
```typescript
import { CartService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private cartService: CartService){}

    priceCart(pricingMode): void{
        this.cartApi.priceCart(pricingMode).subscribe(
            () => {...},
            err => {...}
        );
    }
}
```
   * Price active cart and publishing its state to all subscribing components.
   * @param pricingMode Pass the pricing mode you want to run pricing with. It can be turbo OR default pricing.
  /**
   * @ignore
   */
  priceCart(): void {
    this.apiService
      .post(`/cart/v1/carts/${CartService.getCurrentCartId()}/price`, null)
      .pipe(
        take(1),
        map(r => get(r, 'CartResponse')),
        catchError((e) => of([]))
      )
      .subscribe(priceResponse => {
        if (!isEmpty(priceResponse)) {
          const cart = this.state.value;
          forEach(get(priceResponse, 'LineItems'), (cli) => {
            set(cli, 'Product.IconId', get(find(cart.LineItems, r => r.Id === cli.Id), 'Product.IconId'));
            set(cli, 'Description', get(find(cart.LineItems, r => r.Id === cli.Id), 'Product.Description'));
            set(cli, 'Product.ProductCode', get(find(cart.LineItems, r => r.Id === cli.Id), 'Product.ProductCode'));
          });
          cart.LineItems = plainToClass(CartItem, get(priceResponse, 'LineItems'), { ignoreDecorators: true }) as unknown as Array<CartItem>;
          set(cart, 'SummaryGroups', get(priceResponse, 'SummaryGroups'));

          if (!cart.Id) cart.Id = CartService.getCurrentCartId();
          cart.IsPricePending = false;
          if (CartService.DeferredPrice) cart.set('IsPriced', false);
          this.publish(cart);
        }
      });
  }

  /**
   * @ignore
   */
  getCartWithId(cartId: string): Observable<Cart> {
    return this.fetch(cartId) as Observable<Cart>;
  }

  /**
   * @ignore
   */
  abandonCart(cartId: string): Observable<boolean> {
    //return this.apiService.post(`/carts/${cartId}/abandon`);
    return of(null)
  }

  /**
   * This method gives right state of the cart pricing to client.
   * Returns boolean response,
   * TRUE: Cart is price pending and recent attempt to price the cart has failed.
   * FALSE: Cart is succesfully priced and recent attempt to price the cart is succesfull.
   * @ignore
   */
  getCartPriceStatus(): Observable<boolean> {
    return this.getMyCart()
      .pipe(
        map(c => {
          return c.hasErrors && filter(c.errors, er => er.message === 'Pricing Failed').length > 0
            && (c.IsPricePending || c.LineItems.filter(i => i.PricingStatus !== 'Complete').length > 0);
        }));
  }

  /**
   * This method clones a list of primary cart lines.
   * The cloned items get added to the active cart.
   * @param lineItems Array of cart items to be cloned on the active cart.
   * @returns observable of cloned cart items.
   * @ignore
   */
  clonePrimaryLines(lineItems: Array<CartItem>): Observable<Array<CartItem>> {
    // const lineNumbers = _map(lineItems, item => item.LineNumber);
    // return this.getMyCart().pipe(
    //   take(1),
    //   // TODO: Integrate with RLP API to clone primary lines.
    //   switchMap(cart => of(null)),
    //   map(res => {
    //     const resp = plainToClass(this.metadataService.getTypeByApiName('Apttus_Config2__LineItem__c'), get(res, 'LineItems'), { ignoreDecorators: true }) as unknown as Array<CartItem>;
    //     return resp;
    //   }),
    //   tap(lineItems => this.onAdd(lineItems))
    // )
    return of(null)
  }

  /**
   * Fetches the list of Cart.
   * ### Example:
```typescript
import { CartService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private cartService: CartService){}

    getCartList(){
        this.cartService.getCartList().subscribe(
            cartResult => {...},
            err => {...}
        );
    }
}
```
   * @returns Array of Cart records and its total count..
   */

  getCartList(filters?: Array<FieldFilter>): Observable<CartResult> {
    let queryparam = new URLSearchParams();
    forEach(filters, (filter) => {
      filter.field && queryparam.append('filter', `${filter.filterOperator}(${filter.field}:'${filter.value}')`);
    });
    const params = isEmpty(queryparam.toString()) ? '' : `${queryparam.toString()}`;
    return this.apiService.get(`/cart/v1/carts?${params}`)
      .pipe(
        map(result => {
          return {
            CartList: plainToClass(this.type, result, { excludeExtraneousValues: true }) as unknown as Array<Cart>,
            TotalRecord: get(result, 'TotalCount')
          } as CartResult
        })
      )
  }

  /**
     * @ignore
     */
  getNextPrimaryLineNumber(cartItems: Array<CartItem>, cart: Cart) {
    this.lineItemOffset += 1;
    if (isNil(this.debounceReset))
      this.debounceReset = debounce(this.resetOffset, this.configurationService.get('debounceTime', 500));
    this.debounceReset();
    if (cartItems) {
      let max = Math.max(...compact(cartItems).map(o => o.PrimaryLineNumber), 0);
      if (find(get(cart, 'LineItems'), item => item.PrimaryLineNumber === (max + this.lineItemOffset))) {
        max = Math.max(...compact(get(cart, 'LineItems')).map(o => o.PrimaryLineNumber), 0);
      }
      return max + this.lineItemOffset;
    } else
      return this.lineItemOffset;
  }

}

/*@ignore*/
export interface CartRequest {
  ProductId?: string;
  OptionId?: string;
  PrimaryTxnLineNumber?: number;
  ExternalId?: string;
  TxnParentBundleNumber?: string;
  LineType?: 'Product/Service' | 'Option';
  PricingStatus?: 'Pending' | 'Complete';
  Quantity?: number;
  SellingTerm?: number;
  ProductAttributes?: Object;
  LineItem?: Object;
}

/**@ignore */
export interface LineItem {
  Rules: Array<AppliedRuleActionInfo>;
  LineItems: Array<CartItem>;
}

/**@ignore*/
export enum ErrorMessage {
  SERVER_IS_TAKING_LONGER_THAN_EXPECTED = 'The server is taking longer than expected to respond',
  FAILED_TO_ADD = 'Failed to add item(s)',
  FAILED_TO_UPDATE = 'Failed to update item(s)'
}


/**
 * Result set of List of carts
 */
export interface CartResult {
  /**
   * CartList are Array of cart records.
   */
  CartList: Array<Cart>
  /**
   * Total count of list of cart records.
   */
  TotalRecord: number
}