import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { get } from 'lodash';
import { ConfigurationService } from '@congacommerce/core';
import { Product, CartItem } from '@congacommerce/ecommerce';
import { BatchSelectionService } from '../../shared/services/batch-selection.service';
// import { fade } from '../../shared/directives/animation.directive';

/**
  * The LineItem Card component generates a card template which displays the LineItem information.
  * <h3>Preview</h3>
  * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/line_item_card.png" style="max-width: 100%">
  * <h3>Usage</h3>
 *
 ```typescript
 import { LineItemCardModule } from '@congacommerce/elements';

 @NgModule({
  imports: [LineItemCardModule, ...]
})
 export class AppModule {}
 ```
  * @example
  * // Basic Usage
  ```typescript
  * <apt-lineitem-card [lineItem]="lineItem"></apt-lineitem-card>
  ```
  *
  * // All inputs and outputs
  ```typescript
  * <apt-lineitem-card
  *              [lineItem]="lineItem"
  *              [thumbnail]="showThumbnail"
  *              [showPrice]="showingPrice"
  * ></apt-lineitem-card>
  ```
  */
@Component({
  selector: 'apt-lineitem-card',
  templateUrl: './lineitem-card.component.html',
  styleUrls: ['./lineitem-card.component.scss'],
  // animations: [fade],TO DO:
  encapsulation: ViewEncapsulation.None
})

export class LineitemCardComponent implements OnInit, OnDestroy {
  /**
   * The lineItem associated with this component.
   */
  @Input() lineItem: CartItem | string;
  /**
   * Flag to show the thumbnail image on the product card.
   */
  @Input() thumbnail: boolean = true;
  /**
   * Flag to show the price of the product.
   */
  @Input() showPrice: boolean = true;
  /** @ignore */
  _lineItem: CartItem;
  /** @ignore */
  _product: Product;
  /** @ignore */
  loading: boolean;
  /** @ignore */
  private subs: Array<any> = [];
  /** @ignore */
  identifier: string = 'Id';
  /** @ignore */
  public selected$: Observable<boolean>;
  config$: Observable<boolean>;

  constructor(
    protected config: ConfigurationService,
    protected BatchSelectionService: BatchSelectionService
  ) {
    this.selected$ = of(false);
    this.identifier = this.config.get('productIdentifier');
  }

  ngOnInit() {
    if (this.lineItem instanceof CartItem) {
      this._lineItem = this.lineItem;
      this._product = get(this.lineItem, 'Product');
      this.subs.push(this.BatchSelectionService.getSelectedLineItems().subscribe(cartItems => {
        this.selected$ = this.BatchSelectionService.isLineItemSelected(this._lineItem);
      }));
    } else {
      throw 'apt-lineitem-card lineitem input must be a lineitem or lineitem id';
    }
  }

  /**
    * Remove cart item from Drawer
    * @ignore
   */
  removeCartItem() {
    this.BatchSelectionService.removeLineItemFromSelection(<CartItem>this.lineItem);
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.subs.length > 0) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}
