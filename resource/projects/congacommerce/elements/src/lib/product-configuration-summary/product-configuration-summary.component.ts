import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, OnChanges, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { get, set, bind, includes, isNil, filter, find, isEmpty, maxBy } from 'lodash';
import { AObjectService, CacheService, AObject } from '@congacommerce/core';
import { CartItem, OrderLineItem, ProductOptionService, Product, CartService, QuoteLineItem } from '@congacommerce/ecommerce';
import { ExceptionService } from '../../shared/services/index';

/**
 * Product configuration summary component is used to show the hierarchical view of the selected configurations for a given cart/order line item in a modal window.
 * The view is a tree like structure containing selected attributes and values within attribute groups, selected options/attributes within option groups, nested at different levels in the hierarchy.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productConfigSummary.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
 import { ProductConfigurationSummaryModule } from '@congacommerce/elements';
 @NgModule({
  imports: [ProductConfigurationSummaryModule, ...]
})
 export class AppModule {}
 ```
 *
 * @example
 * // Basic Usage
 *  ```typescript
 * <apt-product-configuration-summary [product]="product"></apt-product-configuration-summary>
 ```
 *
 * // All inputs and outputs.
 ```typescript
 * <apt-product-configuration-summary
 *             [product]="product"
 *             [relatedTo]="lineItem"
 *             [changes]="lineItems"
 *             [preload]="true"
 *             [position]="'top'"
 *             (onProductAdd)="closeModal()"
 *             (onNavigate)="closeModal()">
 * </apt-product-configuration-summary>
 ```
 */
@Component({
  selector: 'apt-product-configuration-summary',
  templateUrl: './product-configuration-summary.component.html',
  styleUrls: ['./product-configuration-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductConfigurationSummaryComponent implements OnChanges, OnDestroy {

  /**
   * Instance of Cart or Order line item or Product to represent the data displayed on this component.
   */
  @Input() product: string | Product;
  /**
   * Related cart item.
   */
  @Input() relatedTo: CartItem;
  /**
   * List of cart items that this configuration changes.
   */
  @Input() changes: Array<CartItem>;
  /**
   * Will preload the data for the configuration component before showing to speed up initial render
   */
  @Input() preload: boolean = false;
  /**
   * Sets the position.
   */
  @Input() position: 'left' | 'right' | 'middle' = 'middle';
  /**
   * Quantity selected of this product used for adding to cart.
   */
  @Input() quantity: number = 1;
  /**
   * Boolean to show action buttons on configuration component.
   */
  @Input() showActionButtons: boolean = true;
  /**
   * Event emitter for when a product is added to cart.
   */
  @Output() onProductAdd: EventEmitter<void> = new EventEmitter<void>();
  /**
   * Event emitter for when user navigates from summary.
   */
  @Output() onNavigate: EventEmitter<void> = new EventEmitter<void>();
  /** @ignore */
  @ViewChild('summaryModal') summaryModal: ModalDirective;
  /** @ignore */
  addLoading: boolean = false;
  /** 
   * @ignore 
   * Added due to stopgap approach
  */
  changeConfigurationLoader: boolean = false;
  /** @ignore */
  modalRef: BsModalRef;
  /** @ignore */
  subscription: Subscription;
  /** @ignore */
  product$: BehaviorSubject<Product> = new BehaviorSubject<Product>(null);
  /** @ignore */
  filter: 'changes' | 'items' = 'items';
  /** @ignore */
  cartItems: Array<CartItem>;
  /** @ignore */
  cartItem: CartItem;
  /** @ignore */
  optionItems: Array<CartItem>;
  /** @ignore */
  actionButton: ActionButton;
  /** @ignore */
  secondaryButton: ActionButton;
  /** @ignore */
  isOrderLineItem: boolean = false;
  /** @ignore */
  isQuoteLineItem: boolean = false;

  private _uuid;
  /** @ignore */
  get uuid() {
    if (!this._uuid)
      set(this, '_uuid', 'a' + this.aobjectservice.guid());
    return get(this, '_uuid');
  }

  constructor(private productOptionService: ProductOptionService
    , private cartService: CartService, private router: Router, private cacheService: CacheService, private ngZone: NgZone, private exceptionService: ExceptionService, private aobjectservice: AObjectService) { }

  ngOnChanges() {
    if (this.showActionButtons) {
      if (this.relatedTo instanceof CartItem && !includes(['Renewed', 'Cancelled', 'Incremented'], this.relatedTo.LineStatus)) {
        this.actionButton = {
          label: 'PRODUCT_CARD.CHANGE_CONFIGURATION',
          action: bind(this.changeConfiguration, this),
          style: 'btn-outline-primary'
        };
      } else if (isNil(this.relatedTo)) {
        this.actionButton = {
          label: 'COMMON.ADD_TO_CART',
          action: bind(this.addToCart, this, get(this, 'quantity', 1)),
          style: 'btn-primary'
        };
        this.secondaryButton = {
          label: 'PRODUCT_CARD.CHANGE_CONFIGURATION',
          action: bind(this.changeConfiguration, this),
          style: 'btn-link'
        };
      }
    }

    if (!isNil(this.product$.value) || this.preload === true)
      this.setProduct();

    //this.isOrderLineItem = this.relatedTo && this.relatedTo instanceof OrderLineItem; need to check
    //this.isQuoteLineItem = this.relatedTo && this.relatedTo instanceof QuoteLineItem;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  /** @ignore */
  setProduct() {
    this.product$.next(null);
    this.ngOnDestroy();
    this.subscription = this.productOptionService.getProductOptionTree(get(this, 'product.Id', this.product), this.relatedTo, this.filter, this.changes)
      .subscribe(
        product => {
          this.product$.next(product);
        }
      );
    this.cartItems = filter(get(this, 'changes', []), c => c instanceof CartItem);
    this.optionItems = filter(get(this, 'changes', []), c => c instanceof CartItem && get(c, 'LineType') === 'Option');
    this.cartItem = find(get(this, 'changes', []), c => get(c, 'LineType') === 'Product/Service');

  }

  /**
   * @ignore
   */
  isLineItem() {
    return this.relatedTo instanceof CartItem;
  }

  /**
   * @ignore
   */
  // hasChangeConfiguration() {
  //   return !(this.relatedTo instanceof OrderLineItem || this.relatedTo instanceof QuoteLineItem);
  // }

  /**
   * Method to add the bundled product or standalone product with attributes to the cart.
   * This method will add default configurations of the product.
   * @ignore
   */
  addToCart(quantity: number, product: Product): void {
    this.addLoading = true;
    this.cartService.addProductToCart(product, quantity)
      .subscribe(
        res => {
          if (isEmpty(res)){
            this.exceptionService.showError('Failed to add item(s)');
          } else {
            this.exceptionService.showSuccess('SUCCESS.CART.ITEM_ADDED_TOASTR_MESSAGE', 'SUCCESS.CART.ITEM_ADDED_TOASTR_TITLE', { productName: product.Name });
            this.onProductAdd.emit();
          }
          this.hide();
          this.addLoading = false;
        },
        err => this.addLoading = false
      );
  }
  /** @ignore */
  changeConfiguration(product: Product) {
    if (!isNil(get(this, 'relatedTo')))
      this.router.navigate(['/products', get(product, 'Id'), get(this, 'relatedTo.Id')], { state: <any>this.product });
    else {
      this.changeConfigurationLoader = true; 
      /* TODO : Added due to Stopgap approach */
      this.cartService.addProductToCart(product, this.quantity)
      .subscribe(
        res => {
          if (isEmpty(res)) {
            this.exceptionService.showError('Failed to add item(s)');
          } else {
            this.exceptionService.showSuccess('SUCCESS.CART.ITEM_ADDED_TOASTR_MESSAGE', 'SUCCESS.CART.ITEM_ADDED_TOASTR_TITLE', { productName: product.Name });
            const relatedTo = maxBy(filter(res, element => element.Product.Id === product.Id && element.LineType === 'Product/Service'), item => item.LineNumber);     
          this.router.navigate(['/products', get(product, 'Id'), get(relatedTo, 'Id')], { state: <any>this.product });
          }
          this.hide()
          this.addLoading = false;
        })
    }
  }

  /** @ignore */
  show(quantity?: number) {
    if (isNil(this.product$.value))
      this.setProduct();
    this.quantity = quantity;
    this.summaryModal.show();
  }
  /** @ignore */
  trackById(index, record: AObject): string {
    return get(record, 'Id');
  }
  /** @ignore */
  hide() {
    this.summaryModal.hide();
  }
}
/** @ignore */
interface ActionButton {
  label: string;
  style: string;
  action(...args): void;
}