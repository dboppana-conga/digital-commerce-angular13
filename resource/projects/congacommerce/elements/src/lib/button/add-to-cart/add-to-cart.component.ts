import { Component, OnChanges, Input, OnDestroy, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, BehaviorSubject, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  split, get, map as _map, compact, some,
  concat, filter, last, sortBy,
  isNil, forEach, cloneDeep, isEmpty, set,
  flatten, uniq, includes, difference, find
} from 'lodash';
import {
  Product, CartService, StorefrontService, CartItem, Storefront,
  Cart, ProductOptionService, UserService, ConstraintRuleService, ConstraintRule
} from '@congacommerce/ecommerce';
import { ProductConfigurationSummaryComponent } from '../../product-configuration-summary/configuration-summary.module';
import { AssetModalService } from '../../../shared/services/asset-modal.service';
import { ExceptionService } from '../../../shared/services/exception.service';

/**
 * The Add to cart component is a button associated with controls for updating the quantity of cart line items before they are added to user"s active cart.
 *
 * When a user clicks on Add to Cart component, a modal window opens up to the user. The modal window displays the selected line item details. These details include item name, product code, quantity, price. A cart total price and checkout button are also shown in the modal window.
 *
 * The add to cart component also shows a dropdown with further actions that can be taken on the product if it is also an asset.
 * <h3>Preview</h3>
 * <div>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/addToCart.png" style="max-width: 100%">
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/addToCartDropdown.png" style="max-width: 100%">
 * </div>
 * <h3>Usage</h3>
 *
```typescript
import { ButtonModule } from "@congacommerce/elements";
@NgModule({
  imports: [ButtonModule, ...]
})
export class AppModule {}
```
* @example
* // Basic Usage
```typescript
* <apt-add-to-cart [product]="product"></apt-add-to-cart>
```
*
* // All input and output options.
```typescript
* <apt-add-to-cart
*             [product]="product"
*             [showQuantityControls]="quantityControlsShowing"
*             [disabled]="isDisabled"
*             [quantity]="quantity"
*             [configurationEnabled]="isConfigEnabled"
*             [configurationRoute]="route/to/configure/page"
*             [trigger]="willTrigger"
*             [btnClass]="classOfButton"
*             [size]="lg"
*             (onAddToCart)="handleAddToCart($event)"></apt-add-to-cart>
```
*/
@Component({
  selector: 'apt-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Product record associated with this component.
   */
  @Input() product: Product;
  /**
   * Optional cart item list for bundle products. Will override product input
   */
  @Input() cartItems?: Array<CartItem>;
  /**
   * Label to use for this control.
   */
  @Input() label: string = 'COMMON.ADD_TO_CART';
  /**
   * Flag to show number input beside the add to cart button.
   */
  @Input() showQuantityControls: boolean = true;
  /**
   * Initial quantity to set for the component. Defaults to 1.
   */
  @Input() quantity: number = 1;
  /**
   * Flag to enable configuration for this component.
   */
  @Input() configurationEnabled: boolean = true;
  /**
   * Flag to disable the button if not valid.
   */
  @Input() disabled: boolean = false;
  /**
   * Flag for if ABO is enabled.
   */
  @Input() aboEnabled: boolean = true;

  /**
   * Bootstrap class to set on this button.
   */
  @Input() btnClass: string = 'btn-outline-primary';
  /**
   * Define the size of the add to cart input
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  /** @ignore */
  @Input()
  trigger: boolean;

  /**
   * Rules to be skipped or not.
   */
  @Input() skipRules: boolean = false;

  /**
   * Observable instance to get if the user is logged in.
   * @ignore
   */
  isLoggedIn$: Observable<boolean>;

  /**
   * Event emitter called when something is added to the cart.
   */
  @Output() onAddToCart: EventEmitter<Array<CartItem>> = new EventEmitter<Array<CartItem>>();

  /**
   * @ignore
   * Added due to stopgap approach.
   */
  @Output() updateProductQuantity = new EventEmitter();

  /** @ignore */
  @ViewChild('productConfiguration', { static: false }) productConfiguration: ProductConfigurationSummaryComponent;
  /** @ignore */
  view$: BehaviorSubject<View> = new BehaviorSubject<View>({
    actions: new Array<ButtonAction>(),
    rules: new Array<ConstraintRule>(),
    cart: null,
    disabled: false
  });
  /** @ignore */
  viewSubscriptions: Subscription[] = [];
  /** 
   * Flag to show loader
   * @ignore
   */
  loading: boolean = false;
  /** Flag to show configuration popup while adding product to cart 
   * @ignore
   */
  renderConfiguration = false;
  /** Flag to check user is loggedin or not */
  isLoggedIn: boolean = false;
  /**
   * Observable instance of the storefront.
   * @ignore
   */
  storefront: Storefront;

  /** @ignore */
  get buttonClass(): string {
    return `${this.btnClass} btn-${this.size}`;
  }
  /** @ignore */
  get inputClass(): string {
    return `d-flex flex-column align-items-stretch input-group-${this.size}`;
  }

  /**
   * Constructor for Add to Cart Component for injecting dependencies.
   *
   * @param cartService Instance of CartService
   * @param storefrontService Instance of StorefrontService
   * @param crService Instance of ConstraintRuleService
   * @param assetModalService Instance of AssetModalService
   * @param productOptionService Instance of ProductOptionService
   * @param exceptionService Instance of ExceptionService
   * @param router Instance of Angular Router
   * @param userService Instance of UserService
  */
  constructor(private cartService: CartService, private storefrontService: StorefrontService,
    private assetModalService: AssetModalService, private crService: ConstraintRuleService,
    private exceptionService: ExceptionService, private router: Router, private productOptionService: ProductOptionService,
    private userService: UserService) {
    this.isLoggedIn$ = this.userService.isLoggedIn();
    this.isLoggedIn$.subscribe(s => this.isLoggedIn = s);
  }

  ngOnInit() {
    const exclusionAction$ = of(null); // this.skipRules ? of(null) : this.crService.getExclusionProductActionsForCart();
    // TODO: Integrate with RLP API to fetch storefront details.
    this.viewSubscriptions.push(combineLatest([of(null), exclusionAction$, this.cartService.getMyCart()])
      .pipe(
        map(([storefront, exclusionActions, cart]) => {
          this.storefront = storefront;
          const excludedProducts = uniq(flatten(_map(exclusionActions, a => split(get(a, 'SuggestedProductIds'), ', '))));
          const configLoading = (this.product.HasAttributes || this.product.HasOptions) && isEmpty(this.cartItems) && this.configurationEnabled === false;
          return {
            actions: filter(this.getAssetActions(storefront, this.product, cart), { enabled: true }),
            disabled: this.product.hasErrors || includes(excludedProducts, this.product.Id) || configLoading,
            cart: cart
          };
        })
      )
      .subscribe(r => this.view$.next(r)));
  }

  ngOnChanges() {
    const viewState = this.view$.value;
    if (get(viewState, 'cart')) {
      const temp = cloneDeep(viewState.cart);
      temp.LineItems = concat(temp.LineItems, this.cartItems);
      // Get the list of Product Option Components for the bundle.
      let productOptionComponents = this.productOptionService.getProductOptions(this.product);
      // Get required Option Components based on the current selection in the configuration.
      let requiredOptionComponents = this.productOptionService.getRequiredOptions(productOptionComponents, this.cartItems);
      let requiredProducts = _map(requiredOptionComponents, action => get(action, 'ComponentProductId'));
      let selectedProducts = compact(_map(this.cartItems, item => item.ProductOption && item.ProductOption.ComponentProductId));

      let hasDifference = (difference(requiredProducts, selectedProducts).length > 0);
      viewState.disabled = this.product.hasErrors || hasDifference;
      this.view$.next(viewState);
    }
  }

  /**
   * The method is fired when user clicks on Add to Cart button.
   * Runs a constraint rule engine to look for any product recommendations for the selected cart line item.
   * Fetches the price of the selected line item, opens up a modal window to display the price, quantity and name of the selected line item.
   * The selected item is also added to user's current active cart.
   *
   * @fires ConstraintRuleService.getConstraintRules()
   * @fires CartService.getMyCart()
   * @fires CartService.addProductToCart()
   * @fires PriceService.getProductPrice()
   *
  */
  addToCart() {
    if (this.quantity <= 0) {
      this.exceptionService.showError('INVALID_QUANTITY');
      this.quantity = 1;
      this.onAddToCart.emit(null); // To revert back the quantity to 1 in product details page
    }

    else if ((this.product.HasAttributes || this.product.HasOptions) && this.configurationEnabled) {
      this.showProductConfiguration();
    } else {
      this.loading = true;
      // Set the quantity to all the cart items.
      if (this.cartItems)
        forEach(this.cartItems, (cartItem: CartItem) => {
          if (get(cartItem, 'LineType') === 'Product/Service')
            set(cartItem, 'Quantity', this.quantity);
        });
      let obs$ = this.cartService.addProductToCart(this.product, this.quantity, this.cartItems as Array<CartItem>);

      obs$.subscribe(
        cartItemList => {
          this.loading = false;
          if (isEmpty(cartItemList)) {
            this.exceptionService.showError('Failed to add item(s)');
          }
          else {
            // Updating a cart item
            if (some(this.cartItems, (item) => !isNil(get(item, 'Id')))) {
              this.exceptionService.showSuccess('SUCCESS.CART.CONFIGURATION_UPDATED', 'SUCCESS.TITLE', { productName: this.product.Name });
              // Adding a new cart item
            } else {
              this.exceptionService.showSuccess('SUCCESS.CART.ITEM_ADDED_TOASTR_MESSAGE', 'SUCCESS.CART.ITEM_ADDED_TOASTR_TITLE', { productName: this.product.Name });
            }
            let items = this.cartItems;
            const primaryItem = find(this.cartItems, r => r.LineType === "Product/Service");
            if(primaryItem)  items = filter(cartItemList, r => (r.ParentBundleNumber || r.PrimaryLineNumber) === primaryItem.PrimaryLineNumber);
            this.onAddToCart.emit(items);
          }
        },
        err => {
          this.loading = false;
          this.exceptionService.showError(err);
        }
      );
    }
  }

  ngOnDestroy() {
    this.viewSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /** @ignore */
  showProductConfiguration() {
    this.renderConfiguration = true;
    setTimeout(() => this.productConfiguration.show(this.quantity));
  }

  private getAssetActions(storefront: Storefront, product: Product, cart: Cart): Array<ButtonAction> {

    const actionList: Array<string> = split(get(storefront, 'AssetActions'), ';');
    const assetList = filter(get(product, 'AssetLineItems'), {
      IsPrimaryLine: true,
      LineType: 'Product/Service'
    });

    const asset = last(sortBy(assetList, 'CreatedDate'));
    const assetsInCart = filter(assetList, (list) => filter(cart.LineItems, (item) => get(item, 'AssetLineItemId') === list.Id).length > 0);
    const inCart = assetList.length === assetsInCart.length;
    const aboEnabled = !isNil(asset) && storefront.EnableABO && this.aboEnabled && !inCart;
    const canBuyMore = aboEnabled && asset.canBuyMore() && includes(actionList, 'Buy More') && this.isLoggedIn;

    const primaryAction: ButtonAction = {
      label: this.label,
      enabled: !canBuyMore,
      onClick: () => this.addToCart()
    };

    const assetActions = _map(actionList, action => {
      switch (action) {
        case AssetAction.BUY_MORE: {
          return {
            label: AssetAction.BUY_MORE
            , enabled: canBuyMore
            , onClick: () => {
              if (assetList.length > 1)
                this.router.navigate(['/assets'], { queryParams: { action: AssetAction.BUY_MORE, productIds: this.product.Id } });
              else
                this.assetModalService.openBuyMoreModal(asset, this.product.AssetLineItems);
            }
          };
        }
        case AssetAction.RENEW: {
          return {
            label: AssetAction.RENEW
            , enabled: aboEnabled && asset.canRenew() && includes(actionList, 'Renew')
            , onClick: () => {
              if (assetList.length > 1)
                this.router.navigate(['/assets'], { queryParams: { action: AssetAction.RENEW, productIds: this.product.Id } });
              else
                this.assetModalService.openRenewModal(asset, assetList);
            }
          };
        }
        case AssetAction.TERMINATE: {
          return {
            label: AssetAction.TERMINATE
            , enabled: aboEnabled && asset.canTerminate() && includes(actionList, 'Terminate')
            , onClick: () => {
              if (assetList.length > 1)
                this.router.navigate(['/assets'], { queryParams: { action: AssetAction.TERMINATE, productIds: this.product.Id } });
              else
                this.assetModalService.openTerminateModal(asset, assetList);
            }
          };
        }
        case AssetAction.CHANGE_CONFIGURATION: {
          return {
            label: AssetAction.CHANGE_CONFIGURATION
            , enabled: aboEnabled && asset.canChangeConfiguration() && includes(actionList, 'Change Configuration')
            , onClick: () => {
              if (assetList.length > 1)
                this.router.navigate(['/assets'], { queryParams: { action: AssetAction.CHANGE_CONFIGURATION, productIds: this.product.Id } });
              else
                this.assetModalService.openChangeConfigurationModal(asset, this.product.AssetLineItems);
            }
          };
        }
      }
    });

    return concat(primaryAction, assetActions);
  }

  /** 
   * @ignore
   * Added due to stopgap approach
  */
  emitQuantity(value) {
    this.updateProductQuantity.emit(value);
  }
}
/**@ignore */
export interface View {
  actions: Array<ButtonAction>;
  rules?: Array<ConstraintRule>;
  cart?: Cart;
  disabled?: boolean;
}
/**@ignore */
export interface ButtonAction {
  label: string;
  enabled?: boolean;
  onClick?(): void;
}
/**@ignore */
export enum PriceType {
  RECURRING = 'Recurring',
  USAGE = 'Usage',
  ONE_TIME = 'One Time'
}
/**@ignore */
export enum AssetAction {
  RENEW = 'Renew',
  TERMINATE = 'Terminate',
  BUY_MORE = 'Buy More',
  CHANGE_CONFIGURATION = 'Change Configuration'
}