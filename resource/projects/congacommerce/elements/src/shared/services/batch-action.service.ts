import { Injectable,  OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { BatchSelectionService } from './batch-selection.service';
import { StorefrontService, BatchAction, CartService, Product, AssetLineItemExtended, CartItem, UserService, ProductFeatureValue } from '@congacommerce/ecommerce';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { get, every, isEmpty, invoke, some } from 'lodash';
import { ConfigurationService } from '@congacommerce/core';
import { FavoriteModalService } from './favorite-modal.service';
/**
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Batch Action service is used to create and filter batch actions.
 */
export class BatchActionService implements OnDestroy {
  /**
   * Array of batch actions to subscribe to.
   */
  private _batchActions = new BehaviorSubject<Array<BatchAction>>([]);
  /**
   * Array of asset batch actions to subscribe to.
   */
  protected _assetBatchActions = new BehaviorSubject<Array<BatchAction>>([]);
  /**
   * Current subscriptions in this class.
   * @ignore
   */
  protected subs: Array<any> = [];
  /**
   * The array of selected products from the product selection service.
   */
  private products: Array<Product>;
  /**
   * Flag for if ABO is enabled on the storefront.
   */
  private AboEnabled: boolean = false;
  /**
   * Flag for if Show Favorites to enable or not. 
   * */
  private showFavorites: boolean = false;
  /**
   * The array of selected cart items from the product selection service.
   */
  private cartItems: Array<CartItem>;
  /**
   * The product identifier set in the configuration file.
   */
  /**@ignore */
  isGuest: boolean = false;
  identifier: string = 'Id';

  /**
   * flag to set preloader on action in process
   */
  private loading$ = new BehaviorSubject<boolean>(false);

  productSubscription: Subscription;
  cartItemSubscription: Subscription;
  /**
   * Constant values for batch actions
   */
  _renew = 'Renew';
  _terminate = 'Terminate';
  _buyMore = 'Buy More';
  _changeConfiguration = 'Change Configuration';
  _compare = 'Compare';
  _saveFavorite = 'Save Favorite';
  _clone = 'Clone';

  /**
   * Array of batch action keys that are enabled.
   */
  enabledActions: Array<string> = [];
  /**
   * Actions that are mapped to string representations of each batch action.
   */
  protected actionMap = {
    [this._buyMore]: new BatchAction(this._buyMore, null, null),
    [this._changeConfiguration]: new BatchAction(this._changeConfiguration, null, null),
    [this._renew]: new BatchAction(this._renew, 'loop-circular', this.renew.bind(this, [this.router])),
    [this._terminate]: new BatchAction(this._terminate, 'circle-x', this.terminate.bind(this, [this.router])),
    [this._buyMore]: new BatchAction(this._buyMore, 'circle-x', this.buyMore.bind(this, [this.router])),
    [this._changeConfiguration]: new BatchAction(this._changeConfiguration, 'circle-x', this.changeConfiguration.bind(this, [this.router])),
    [this._compare]: new BatchAction(this._compare, 'transfer', this.compare.bind(this, [this.router])),
    [this._saveFavorite]: new BatchAction(this._saveFavorite, 'circle-x', this.saveFavorite.bind(this, [this.router])),
    [this._clone]: new BatchAction(this._clone, 'circle-x', this.clone.bind(this, [this.router]))
  };

  constructor(
    protected config: ConfigurationService,
    protected BatchSelectionService: BatchSelectionService,
    protected router: Router,
    protected cartService: CartService,
    protected storefrontService: StorefrontService,
    protected translateService: TranslateService,
    protected userService: UserService,
    protected favModalService?: FavoriteModalService,
  ) {
    this.identifier = this.config.get('productIdentifier');
    this.subs.push(combineLatest([this.storefrontService.getStorefront(), this.storefrontService.isFavoriteDisabled(), this.userService.isGuest()])
    .subscribe(([storefront, isFavoriteDisabled, isGuest]) => {
      this.AboEnabled = get(storefront, 'EnableABO', false);
      this.enabledActions = (this.AboEnabled && get(storefront, 'AssetActions')) ? get(storefront, 'AssetActions', '').split(';') : [];
      this.showFavorites = isFavoriteDisabled;
      this.isGuest = isGuest;
    }));
    this.activateProductActions();
    this.activateCartitemActions();
  }

  /**
   * @ignore
   */
  public isLoading(): BehaviorSubject<boolean> {
    return this.loading$;
  }

  /**
   * Refresh Product actions when activating product pill
   * @ignore
   */
  activateProductActions() {
    if (this.productSubscription)
      this.productSubscription.unsubscribe();
    this.productSubscription = this.BatchSelectionService.getSelectedProducts().subscribe(products => {
      this.filterBatchActions(products);
      this.products = products;
    });
  }

  /**
   * Refresh cart item actions when activating cart item pill
   * @ignore
   */
  activateCartitemActions() {
    if (this.cartItemSubscription)
      this.cartItemSubscription.unsubscribe();
    this.cartItemSubscription = this.BatchSelectionService.getSelectedLineItems().subscribe(cartItems => {
      this.filterBatchActions(cartItems);
      this.cartItems = cartItems;
    });
  }

  /**
   * Filters the batch actions based on the currently selected products.
   * @param products The array of selected products used to filter batch actions.
   * @ignore
   */
  private filterBatchActions(items: Array<Product | CartItem>) {
    Object.keys(this.actionMap).forEach(key => this.actionMap[key].setDisabled(true));
    Object.keys(this.actionMap).forEach(key => this.actionMap[key].setVisible(false));
    const currentActions = [];
    if (items[0] instanceof Product) {
      if (items.length > 1) {
        if (items.length < 6) {
          let productMissingFeatures = false;
          items.forEach(product => {
            if (get(product, 'ProductFeatureValues')) {
              const productFeatureValues = get(product, 'ProductFeatureValues') as Array<ProductFeatureValue>;
              if (get(productFeatureValues, 'length') < 1) productMissingFeatures = true;
            }
            else productMissingFeatures = true;
          });
          if (productMissingFeatures)
            this.actionMap[this._compare].setDisabled(true);
          else
            this.actionMap[this._compare].setDisabled(false);
        }
        else {
          this.actionMap[this._compare].setDisabled(true);
        }
      }
      else {
        this.actionMap[this._compare].setDisabled(true);
      }
      this.actionMap[this._compare].setVisible(true);
      currentActions.push(this.actionMap[this._compare]);
      currentActions.push(this.filterRenewAction(items as Array<Product>));
      currentActions.push(this.filterTerminateAction(items as Array<Product>));
    } else if (items[0] instanceof CartItem) {
      if (items.length > 0) {
        this.actionMap[this._clone].setDisabled(false);
        this.actionMap[this._clone].setVisible(true);
        currentActions.push(this.actionMap[this._clone]);
      }
    }
    this.actionMap[this._saveFavorite].setVisible(true);
    if(!this.isGuest) {
      if(this.showFavorites) {
        this.actionMap[this._saveFavorite].setDisabled(true);
      } else {
        this.actionMap[this._saveFavorite].setDisabled(false);
      }
    }
    currentActions.push(this.actionMap[this._saveFavorite]);
    this._batchActions.next(currentActions);
  }
  /**
   * Filters the renew actions based on the currently selected products.
   * @param products Products to be filtered.
   * @ignore
   */
  private filterRenewAction(products: Array<Product>) {
    if (this.enabledActions.includes(this._renew)) {
      this.actionMap[this._renew].setVisible(true);
      if (products.length > 1) {
        if (products.length < 6) {
          this.actionMap[this._renew].setDisabled(!this.isSubscriptionProduct(products));
          if (this.actionMap[this._renew].isDisabled()) {
            this.translateService.stream('SERVICES.ONE_OR_MORE_ITEMS_CANNOT_RENEW').subscribe((translatedValue: string) => {
              this.actionMap[this._renew].setTooltipText(translatedValue);
            });
          }
        }
        else {
          this.actionMap[this._renew].setDisabled(true);
          this.translateService.stream('SERVICES.TOO_MANY_PRODUCTS_SELECTED_TO_RENEW_TOOLTIP').subscribe((val: string) => {
            this.actionMap[this._renew].setTooltipText(val);
          });
        }
      }
      else {
        this.actionMap[this._renew].setDisabled(true);
        this.translateService.stream('SERVICES.SELECT_MORE_PRODUCTS_TO_RENEW_TOOLTIP').subscribe((val: string) => {
          this.actionMap[this._renew].setTooltipText(val);
        });
      }
    }
    return this.actionMap[this._renew];
  }
  /**
  * Filters the terminate actions based on the currently selected products.
  * @param products Products to be filtered.
  * @returns List of Terminate Actions
  * @ignore
  */
  private filterTerminateAction(products: Array<Product>) {
    if (this.enabledActions.some(terminateAction => terminateAction === this._terminate)) {
      this.actionMap[this._terminate].setVisible(true);
      if (products.length > 1) {
        if (products.length < 6) {
          this.actionMap[this._terminate].setDisabled(!this.isSubscriptionProduct(products));
          this.translateService.stream('SERVICES.UNABLE_TO_TERMINATE_TOOLTIP').subscribe((val: string) => {
            this.actionMap[this._terminate].setTooltipText(val);
          });
        }
        else {
          this.actionMap[this._terminate].setDisabled(true);
          this.translateService.stream('SERVICES.TOO_MANY_PRODUCTS_SELECTED_TO_TERMINATE_TOOLTIP').subscribe((val: string) => {
            this.actionMap[this._terminate].setTooltipText(val);
          });
        }
      }
      else {
        this.actionMap[this._terminate].setDisabled(true);
        this.translateService.stream('SERVICES.SELECT_MORE_PRODUCTS_TO_TERMINATE_TOOLTIP').subscribe((val: string) => {
          this.actionMap[this._terminate].setTooltipText(val);
        });
      }
    }
    return this.actionMap[this._terminate];
  }
  /**
   * Checks if the given products are able to be renewed or terminated.
   * @param products Array of products to check.
   * @returns boolean
   * @ignore
   */
  private isSubscriptionProduct(products: Array<Product>): boolean {
    return every(products, product =>
      // The product has asset line items
      !isEmpty(get(product, 'AssetLineItems'))
      // and some asset line items can be renewed or terminated
      && some(
        get(product, 'AssetLineItems', []), (asset: AssetLineItemExtended) => {
          return invoke(asset, 'canRenew') || invoke(asset, 'canTerminate');
        }
      )
    );
  }
  /**
   * Gets the current batch actions observable.
   * @returns Observable array of batch action objects.
   */
  public getBatchActions(): Observable<Array<BatchAction>> {
    return this._batchActions;
  }
  /**
  * Renew selected products.
  * @param router Instance of the router
  * @param products Array of selected products
  * @ignore
  */
  private renew(router: Router, products: Array<Product>) {
    const productIdentifier = products.map(product => product[this.identifier]);
    this.router.navigate(['/assets'], { queryParams: { action: 'Renew', productIds: encodeURIComponent(productIdentifier.join(',')) } });
  }
  /**
   * Terminate selected products.
   * @param router Instance of the router
   * @param products Array of selected products
   * @ignore
   */
  private terminate(router: Router, products: Array<Product>) {
    const productIdentifier = products.map(product => product[this.identifier]);
    this.router.navigate(['/assets'], { queryParams: { action: 'Terminate', productIds: encodeURIComponent(productIdentifier.join(',')) } });
  }
  /**
   * Buy more products.
   * @param router Instance of the router
   * @param products Array of selected product
   * @ignore
   */
  private buyMore(router: Router, products: Array<Product>) {
    const productIdentifier = products.map(product => product[this.identifier]);
    this.router.navigate(['/assets'], { queryParams: { action: encodeURIComponent('Buy More'), productIds: encodeURIComponent(productIdentifier.join(',')) } });
  }

  /**
   * Change configuration of products.
   * @param router Instance of the router
   * @param products Array of selected product, usually this in single product
   * @ignore
   */
  private changeConfiguration(router: Router, products: Array<Product>) {
    // change configuration does not have a mass action at this time.
  }

  /**
   * @ignore
   */
  private addToCart(products: Array<Product>) {
    console.log('Adding products to cart', products);
  }
  /**
   * Compares selected products.
   * @param router Instance of the router
   * @param products Array of selected products
   * @ignore
   */
  private compare(router: Router, products: Array<Product>) {
    const productIdentifier = products.map(product => product[this.identifier]);
    this.router.navigateByUrl(`/products/compare?products=${productIdentifier.join(',')}`);
  }

  /**
   * Save Favorite products or cartItems.
   * @param router Instance of the router
   * @param items Array of selected items(Products/CartItems)
   * @ignore
   */
  private saveFavorite(router: Router, items: Array<Product|CartItem>) {
    this.favModalService.openExistingFavModal(items);
  }

  /**
   * Clone primary line Items.
   * @param router Instance of the router
   * @param items Array of selected CartItems
   * @ignore
   */
  private clone(router: Router, items: Array<CartItem>) {
    this.loading$.next(true);
    this.subs.push(this.cartService.clonePrimaryLines(items).subscribe(res => {
      this.loading$.next(false);
    }));
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.productSubscription.unsubscribe();
    this.cartItemSubscription.unsubscribe();
  }

}
