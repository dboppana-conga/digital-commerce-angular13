import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  Incentive,
  PromotionService,
  AdjustmentItem,
} from '@congacommerce/ecommerce';
import * as _ from 'lodash';
import {
  CartItem,
  OrderLineItem,
  QuoteLineItem,
  CartItemService,
  OrderLineItemService,
  QuoteLineItemService,
} from '@congacommerce/ecommerce';
import { Observable, of } from 'rxjs';
import { ClassType } from 'class-transformer/ClassTransformer';
import { map, tap } from 'rxjs/operators';

/**
 * Promotion modal component is used to show a modal window with all the details of promotions that are applied to items in the cart.
 * <strong>This component is a work in progress.</strong>
 * <h3>Preview</h3>
 * <img class='jumbotron' src='https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/promotionModal.png' style='max-width: 100%'>
 * <h3>Usage</h3>
 *
 ```typescript
import { PromotionModalModule } from '@congacommerce/elements';

@NgModule({
  imports: [PromotionModalModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-pr-modal></apt-pr-modal>
```
*/
@Component({
  selector: 'apt-pr-modal',
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromotionModalComponent implements AfterViewInit {
  /**
   * @ignore
   */
  @ViewChild('appliedPromotionTemplate') appliedPromotionTemplate: TemplateRef<any>;
  @ViewChild('promotionAppliedToTemplate') promotionAppliedToTemplate: TemplateRef<any>;

  /**
   * Observable of AObject record type of Incentive | CartItem | OrderLineItem | QuoteLineItem. 
   */
  record$: Observable<Incentive | CartItem | OrderLineItem | QuoteLineItem>;
  /**
   * Observable of list of AdjustmentItems.
   */
  adjustmentList$: Observable<Array<AdjustmentItem>>;
  /**
   * @ignore
   */
  adjustmentItem: AdjustmentItem = new AdjustmentItem();
  /**
   * Observable to store the total amount of promotion applied.
   */
  totalAmt$: Observable<number>;
  /**
   * reference for modal popup.
   */
  public modalRef: BsModalRef;

  /**@ignore */
  private recordMap: Array<PromotionModalInterface>;

  constructor(private modalService: BsModalService,
    private cartItemService: CartItemService,
    private orderLineItemService: OrderLineItemService,
    private quoteLineItemService: QuoteLineItemService,
    private promotionService: PromotionService) {}

  ngAfterViewInit() {
    this.recordMap = [
      {
        service: this.cartItemService,
        type: this.cartItemService.type,
        template: this.appliedPromotionTemplate
      },
      {
        service: this.orderLineItemService,
        type: this.orderLineItemService.type,
        template: this.appliedPromotionTemplate
      },
      {
        service: this.quoteLineItemService,
        type: this.quoteLineItemService.type,
        template: this.appliedPromotionTemplate
      }
    ];
  }

  /**
   * Open the Modal popup when promotion(s) are applied to the lineItem of type 
   * CartItem | OrderLineItem | QuoteLineItem. It shows the details of adjustemntmentLineItems
   * for the linetitems applied and the total adjusted amount.
   * @param record consists of object type of CartItem | OrderLineItem | QuoteLineItem.
  */
  openLineItemModal(record: CartItem | OrderLineItem | QuoteLineItem) {
    const iface = _.find(this.recordMap, (i) => record instanceof i.type);
    this.adjustmentList$ = this.promotionService.getAppliedPromotionForLineItem(
      record.LineNumber
    );
    // this.record$ = iface.service.get([record.Id], false).pipe(map((list) => _.first(list)));
    this.totalAmt$ = this.adjustmentList$.pipe(map((items) => _.sumBy(items, 'IncentiveAdjustmentAmount')));
    this.modalRef = this.modalService.show(iface.template, iface.config);
  }

  /**
   * Opens the modal dialog on promotion applied to the cart. It displays the list of 
   * adjustment lineitem created for the cart and the total adjusted amount of the incentive.
   * @param record is an object of type Incentive.
   */
  openIncentiveModal(record: Incentive) {
    this.record$ = of(record);
    this.adjustmentList$ = this.promotionService
      .getAppliedPromotionForCart(record.IncentiveCode)
      .pipe(
        tap((adjList) => {
          const option = _.find(adjList,(r) => r.LineItem.LineType === 'Option');
          if (!_.isEmpty(option)) adjList[0].set('columns', option);
        })
      );
    this.totalAmt$ = this.adjustmentList$.pipe(map((items) => _.sumBy(items, 'IncentiveAdjustmentAmount')));
    this.modalRef = this.modalService.show(this.promotionAppliedToTemplate, {class: 'modal-lg'});
  }
}

/** @ignore */
interface PromotionModalInterface {
  service: CartItemService | OrderLineItemService | QuoteLineItemService;
  type: ClassType<Incentive | CartItem | OrderLineItem | QuoteLineItem>;
  template: TemplateRef<any>;
  config?: any;
}
