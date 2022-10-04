import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, CartItem } from '@congacommerce/ecommerce';
import { BatchSelectionService } from '../../shared/services/batch-selection.service';
import { BatchActionService } from '../../shared/services/batch-action.service';
import { ProductDrawerService } from './product-drawer.service';

/**
 * Product drawer component is used to create a toggleable drawer on the bottom of the screen that displays currently selected products and their associated batch actions.
 * <strong>This component is a work in progress.</strong>
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productDrawer.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductDrawerModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductDrawerModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-product-drawer [products]="products"></apt-product-drawer>
```
*/
@Component({
  selector: 'apt-product-drawer',
  templateUrl: './product-drawer.component.html',
  styleUrls: ['./product-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDrawerComponent implements OnInit, OnDestroy {
  /**
   * Array of products used to populate the carousel.
   */
  @Input() products: Array<Product>;
  /**
   * Flag used to show/hide the drawer.
   * @ignore
   */
  hidden: boolean = false;
  /**
   * Current subscriptions in this class.
   * @ignore
   */
  private subs: Array<any> = [];
  /**
   * Observable boolean for checking the drawer open/close state.
   * @ignore
   */
  drawerIsOpen$: Observable<boolean>;
  /**
   * Observable array of products to display in the drawer.
   * @ignore
   */
  products$: Observable<Array<Product>>;
  /**
   * Observable array of cart Items to display in the drawer.
   * @ignore
   */
  cartItems$: Observable<Array<CartItem>>;
  /**
   * Use to hold currect active tab for drawer.
   */
  activePill: String = '';

  constructor(private batchSelectionService: BatchSelectionService,
    private productDrawerService: ProductDrawerService,
    private batchActionService: BatchActionService) { }

  ngOnInit() {
    this.drawerIsOpen$ = this.productDrawerService.isDrawerOpen();
    this.products$ = this.batchSelectionService.getSelectedProducts();
    this.subs.push(this.batchSelectionService.getSelectedProducts().subscribe((product) => {
      this.activePill = (product && product.length > 0) ? 'Product' : 'CartItem';
      this.productDrawerService.openDrawer();
    }));

    this.cartItems$ = this.batchSelectionService.getSelectedLineItems();
    this.subs.push(this.batchSelectionService.getSelectedLineItems().subscribe((cartItem) => {
      this.activePill = (cartItem && cartItem.length > 0) ? 'CartItem' : 'Product';
      this.productDrawerService.openDrawer();
    }));
  }
  /**
   * Event method that is called when a batch action is clicked.
   * @param event Event from batch action being clicked.
   * @ignore
   */
  onAction(event: boolean) {
    if (event) this.productDrawerService.closeDrawer();
  }
  /**
   * Toggles the drawer between hidden and visible.
   * @ignore
   */
  toggleDrawer() {
    this.productDrawerService.toggleDrawer();
  }
  /**
   * Sets the drawer to visibile.
   * @ignore
   */
  openDrawer() {
    this.hidden = false;
  }
  /**
   * Sets the drawer to hidden.
   * @ignore
   */
  closeDrawer() {
    this.hidden = true;
  }

  /**
   * Activate Product/CartItem Pill in the drawer.
   * @ignore
   */
  setActivePill(pill) {
    this.activePill = pill;
    if (pill === 'Product')
      this.batchActionService.activateProductActions();
    else if (pill === 'CartItem')
      this.batchActionService.activateCartitemActions();
  }

  /**
   * Remove all products from drawer
   * @ignore
   */
  removeAllProducts(event) {
    event.stopPropagation();
    if (confirm('Do you want to remove all selected products?')) {
      this.batchSelectionService.removeAllProducts();
      return true;
    } else
      return false;
  }

  /**
   * Remove all cart items from drawer
   * @ignore
   */
  removeAllCartItems(event) {
    event.stopPropagation();
    if (confirm('Do you want to remove all selected cart items?')) {
      this.batchSelectionService.removeAllLineitems();
      return true;
    } else
      return false;
  }

  ngOnDestroy() {
    if (this.subs && this.subs.length > 0) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}
