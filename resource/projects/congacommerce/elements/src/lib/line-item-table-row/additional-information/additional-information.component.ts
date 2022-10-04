import { Component, Input } from '@angular/core';
import { set, isEqual } from 'lodash';
import { take } from 'rxjs/operators';
import { CartItem, CartService } from '@congacommerce/ecommerce';
import { CartItemView } from '../interfaces/line-item-view.interface';

/**
 * Additional information component is used to show additional info section when there are more than three line item fields
 * to be displayed on cart page.
 * <h3>Preview</h3>
 * <img src="https://raw.github.com/Apttus-Ecom/Summer19/master/res/additional-information.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
 import { LineItemTableRowModule } from '@congacommerce/elements';

 @NgModule({
  imports: [LineItemTableRowModule, ...]
})
 export class AppModule {}
 ```
 * @example
 ```typescript
 * <apt-additional-information 
 * [parent]="parent"
 * [cart]="cart" 
 * [editableFields]="editableFields" 
 * [userView]="userView" 
 * [quantity]="quantity">
 * </apt-additional-information>
 ```
 */

@Component({
  selector: 'apt-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss']
})

export class AdditionalInformationComponent {

  /**
   * Line item to show the additional fields information from.
   */
  @Input() parent: any;

  /**
   * Flag defines whether line item fields should be editable.
   */
  @Input() editableFields: boolean = true;

  /**
  * Flag defines whether line item fields should be editable.
  */
  @Input() userView: any;

  /**
 * Flag defines whether line item fields should be editable.
 */
  @Input() cart: any;

  /**
  * Flag defines whether line item fields should be editable.
  */
  @Input() quantity: number;

  constructor(private cartService: CartService) { }


  /**
     * Changes the quantity of the cart item passed to this method.
     * @param cartItem Cart item reference to change quantity.
     * @param event The event object
     * @fires CartService.updateCartItems()
     * @ignore
     */
  changeItemQuantity(cartItem: CartItem) {
    if (!cartItem.Quantity || cartItem.Quantity <= 0) {
      cartItem.Quantity = this.quantity;
    } else {
      this.cartService.updateCartItems([cartItem]).pipe(take(1)).subscribe(
        res => { },
        err => set(this.cart, 'IsPricePending', false)
      );
    }
  }

  /**
   * This method updates the cart item field on cart page.
   * @param view record of type CartItemView with cart item field to be updated.
   * @param parent cart item record to be updated.
   */
  updateValues(view: CartItemView, parent: CartItem) {
    if (!isEqual(view, parent)) {
      if (!parent.Quantity || parent.Quantity <= 0) {
        parent.Quantity = this.quantity;
      }
      parent[view.fieldName] = view;
      this.cartService.updateCartItems([parent]).pipe(take(1)).subscribe(
        res => { },
        err => set(this.cart, 'IsPricePending', false)
      );
    }
  }
}
