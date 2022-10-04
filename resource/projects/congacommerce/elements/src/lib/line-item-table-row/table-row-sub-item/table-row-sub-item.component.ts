import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { set, isEqual, get } from 'lodash';
import { CartItem, CartService, Cart, Storefront, StorefrontService } from '@congacommerce/ecommerce';
import { CartItemView } from '../interfaces/line-item-view.interface';

/**
 * Creates the child rows on line items.
 * @ignore
 */
@Component({
  selector: 'apt-table-row-sub-item',
  templateUrl: './table-row-sub-item.component.html',
  styleUrls: ['./table-row-sub-item.component.scss']
})
export class TableRowSubItemComponent implements OnInit, OnChanges {
  /**
   * Cart item reference for this component.
   */
  @Input() subItem: CartItem;
  /**
   * Instance of the current cart.
   */
  @Input() cart: Cart;
  /**
   * Flag defines whether line item fields should be editable.
   */
  @Input() editableFields: boolean = true;
  /**
   * Observable instance of the storefront.
   */
  storefront$: Observable<Storefront>;

  /**
   * Flag defines whether line item fields should be editable.
   */
  @Input() userView: any;
  /**
   * Flag defines whether custom fields to be shown or not.
   */
  @Input() showCustomFields: boolean = false;
  /**
   * Flag to check if this component should be read only.
   */
  readonly: boolean = false;
  /**
  * Flag to check favorite configuration item
  */
  isFavoriteConfigurationItem: boolean = false;
  private quantity: number;

  constructor(
    private cartService: CartService,
    private storefrontService: StorefrontService
  ) { }

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    if (!(this.subItem instanceof CartItem) || get(this.subItem, 'IsOptionRollupLine')) {
      this.readonly = true;
    }
  }

  ngOnChanges() {
    this.quantity = this.subItem.Quantity;
  }
  /**
   * Changes the quantity of the cart item passed to this method.
   * @param cartItem Cart item reference to change quantity.
   * @param event The event object
   * @fires CartService.updateCartItems()
   */
  changeItemQuantity(cartItem: CartItem) {
    if (!cartItem.Quantity || cartItem.Quantity <= 0) {
      cartItem.Quantity = this.quantity;
    } else {
      this.cartService.updateCartItems([cartItem]).pipe(take(1)).subscribe();
    }
  }
  /**
   * Event handler for when the start date changes.
   * @param cartItem Cart item to update.
   */
  handleStartChange(cartItem: CartItem) {
    this.cartService.updateCartItems([cartItem])
      .pipe(take(1)).subscribe();
  }
  /**
   * Event handler for when the end date changes.
   * @param cartItem Cart item to update.
   */
  handleEndDateChange(cartItem: CartItem) {
    this.cartService.updateCartItems([cartItem])
      .pipe(take(1)).subscribe();
  }

  /** 
   * method checks if the lineitem is of type cartlineitem.
   * @param lineItem is the lineitem to check the type.
   */
  isCartLineItem(lineItem) {
    return lineItem instanceof CartItem && !this.isFavoriteConfigurationItem;
  }
  /**
    * Changes the values of the cart item passed to this method.
    * @param subItem Cart item reference to change values of the fields.
    * @param  view is the view object that has changes done on the fields
    * @fires CartService.updateCartItems()
    */
  updateValues(view: CartItemView, subItem: CartItem) {
    if (!isEqual(view, subItem)) {
      if (!subItem.Quantity || subItem.Quantity <= 0) {
        subItem.Quantity = this.quantity;
      }
      subItem[view.fieldName] = view;
      this.cartService.updateCartItems([subItem]).pipe(take(1)).subscribe(
        res => { },
        err => set(this.cart, 'IsPricePending', false)
      );
    }
  }

}
