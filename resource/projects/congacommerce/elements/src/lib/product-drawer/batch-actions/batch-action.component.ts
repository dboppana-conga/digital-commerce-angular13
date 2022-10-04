import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { filter } from 'lodash';
import { BatchAction, Product, CartItem } from '@congacommerce/ecommerce';
import { BatchActionService } from '../../../shared/services/batch-action.service';
import { BatchSelectionService } from '../../../shared/services/batch-selection.service';

/**
 * Batch action component is used to display the list of currently active batch actions as buttons on the UI of the product drawer component.
 * @ignore
*/
@Component({
  selector: 'apt-batch-action',
  templateUrl: './batch-action.component.html',
  styleUrls: ['./batch-action.component.scss']
})
export class BatchActionComponent implements OnInit, OnDestroy {
  /**
   * Output that is called when a batch action button is clicked.
   */
  @Output() actionFired: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
  * Input for active pill
  */
  @Input() activePill: string = null;
  /**
   * The currently selected products.
   */
  public products: Array<Product>;
  /**
  * The currently selected cart items.
  */
  public cartItems: Array<CartItem>;
  /**
   * list of current batch actions from the batch action service.
   */
  public actionList: Array<BatchAction>;
  /**
   * Current subscriptions in this class.
   * @ignore
   */
  private subs: Array<any> = [];
  /** Use to hold batch action available for selected items. */
  public actionBatch: BatchAction;
  /** 
   * Flag to show loader
   * @ignore
   */
  public loading: boolean = false;

  constructor(
    protected batchSelectionService: BatchSelectionService,
    protected batchActionService: BatchActionService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.subs.push(this.batchSelectionService.getSelectedProducts().subscribe(res => this.products = res));
    this.subs.push(this.batchSelectionService.getSelectedLineItems().subscribe(res => this.cartItems = res));
    this.subs.push(this.batchActionService.getBatchActions().pipe(
      map(actions => filter(actions, action => !action.disabled))
    ).subscribe(res => {
      // TODO: Uncomment below, on integrating with Favorite RLP APIs.
      // this.actionList = res;
      this.actionList = null;
      this.actionBatch = res[0];
    }));
    this.subs.push(this.batchActionService.isLoading().subscribe(res => {
      this.loading = res;
    }));
  }

  /**
   * Calls the given batch action's action method and calls the actionFired output.
   * @param action Batch action that was triggered.
   */
  handleClick() {
    const items = (this.activePill === 'Product') ? this.products : this.cartItems;
    this.actionBatch.getActionMethod()(items);
    this.actionFired.emit(true);
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
