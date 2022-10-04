import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { Product, CartItem } from '@congacommerce/ecommerce';
import { BatchSelectionService } from '../../shared/services/batch-selection.service';
import { filter, some, get } from 'lodash';
import { Subscription } from 'rxjs';

/**
 * The select all component is used for selecting all the products/cart items and adding them to the drawer.
 * 
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/selectAll.png" style="max-width: 100%">
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { SelectAllModule } from '@congacommerce/elements';

@NgModule({
  imports: [SelectAllModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-select-all 
*                 [items]="items"
* ></apt-select-all>
```
*
*/
@Component({
  selector: 'apt-select-all',
  templateUrl: './select-all.component.html',
  styleUrls: ['./select-all.component.scss']
})
export class SelectAllComponent implements OnChanges, OnDestroy {
  /** The array of selected products of type Product or Cart Item */
  @Input() items: Array<Product | CartItem> = [];
  /** @ignore  */
  type: string = null;
  /** Use to determine the state of checkbox  */
  SelectionState: String = SelectionState.UNCHECKED;
  /** @ignore */
  private subscriptions: Subscription[] = [];

  constructor(private batchSelectionService: BatchSelectionService) { }

  ngOnChanges(): void {
    if (this.items[0] instanceof Product) {
      this.type = 'product';
      this.subscriptions.push(this.batchSelectionService._products.subscribe(res => {
        this.setStatus(res, this.items);
      }));
    } else if (this.items[0] instanceof CartItem) {
      this.type = 'lineitem';
      this.subscriptions.push(this.batchSelectionService._lineItems.subscribe(res => {
        this.setStatus(res, this.items);
      }));
    }
  }

  /** @ignore */
  setStatus(selectedItem, allItems) {
    const selectedItems = filter(allItems, (item) => some(selectedItem, { 'Id': item.Id }));
    if (selectedItems.length === this.items.length)
      this.SelectionState = SelectionState.CHECKED;
    else if (selectedItems.length === 0)
      this.SelectionState = SelectionState.UNCHECKED;
    else
      this.SelectionState = SelectionState.INDETERMINATE;
  }

  /** @ignore */
  toggleAllItems(items) {
    if (items[0] instanceof Product) {
      (this.SelectionState === SelectionState.UNCHECKED || this.SelectionState === SelectionState.INDETERMINATE)
        ? this.batchSelectionService.addAllProductstoSelection(items)
        : this.batchSelectionService.removeAllProductsFromSelection(items);
    } else if (items[0] instanceof CartItem) {
      (this.SelectionState === SelectionState.UNCHECKED || this.SelectionState === SelectionState.INDETERMINATE)
        ? this.batchSelectionService.addAllLineItemstoSelection(items)
        : this.batchSelectionService.removeAllLineItemsFromSelection(items);
    }
  }

  /** @ignore */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

/** @ignore */
export enum SelectionState {
  CHECKED = 'checked',
  INDETERMINATE = 'indeterminate',
  UNCHECKED = 'unchecked'
}
