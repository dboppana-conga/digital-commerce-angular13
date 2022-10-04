import { Component, ViewChild, OnChanges, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { get, set, map as _map, filter, flatten, uniqBy, sumBy, isEmpty, toString, find } from 'lodash';
import { AdjustmentItem, PromotionService, Incentive, Cart, StorefrontService, Storefront } from '@congacommerce/ecommerce';
import { PromotionModalComponent } from '../promotion-modal/promotion-modal.component';
import { ExceptionService } from '../../shared/services/exception.service';

/**
 * Promotion component is used to apply and remove promtoions on the cart.
 * <strong>This component is a work in progress.</strong>
 * Also fetches the list of adjustment line item associated with the cart.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/promotion.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { PromotionModule } from '@congacommerce/elements';

@NgModule({
  imports: [PromotionModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-promotion [cart]="cart"></apt-promotion>
```
*/
@Component({
  selector: 'apt-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromotionComponent implements OnChanges {
  /**
   * Instance of a cart.
   */
  @Input() cart: Cart;
  /** @ignore */
  @ViewChild('promotionModal', { static: false }) promotionModal: PromotionModalComponent;
  /** @ignore */
  adjustmentItemList: Array<AdjustmentItem>;
  /** @ignore */
  promocode: string = null;

  /**
   * Unique observable array of the incentives used for the cart.
   * @ignore
   */
  promoList$: Observable<Array<Incentive>>;
  /** @ignore */
  storefront$: Observable<Storefront>;

  /**
   * Full list of adjustments for the cart
   * @ignore
   */
  adjustmentItemList$: Observable<Array<AdjustmentItem>>;
  /** @ignore */
  loading: boolean = false;

  constructor(private promotionService: PromotionService, private exceptionService: ExceptionService, private storefrontService: StorefrontService, private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    this.storefront$ = this.storefrontService.getStorefront();
    const adjustmentLI = flatten(filter(get(this, 'cart.LineItems'), r => get(r, 'AdjustmentLineItems')).map(k => k.AdjustmentLineItems));
    this.adjustmentItemList$ = of(adjustmentLI);
    const incentiveCodes = adjustmentLI.map(k => k.IncentiveCode);
    const incentiveList$ = isEmpty(incentiveCodes) ? of(null) : this.promotionService.getIncentiveByCode(toString(incentiveCodes));
    this.promoList$ = zip(this.adjustmentItemList$, incentiveList$)
      .pipe(
        map(([adjustmentItems, incentives]) => uniqBy(_map(adjustmentItems, item => {
          const incentive = find(incentives, (i) => i.IncentiveCode === item.IncentiveCode);
          incentive.set('total', sumBy(filter(adjustmentItems, ai => get(ai, 'IncentiveCode') === get(incentive, 'IncentiveCode')), 'IncentiveAdjustmentAmount'));
          const couponCode = get(find(adjustmentItems, (ai) => get(ai, 'IncentiveCode') === get(incentive, 'IncentiveCode')), 'Apttus_Config2__CouponCode__c');
          if(couponCode)
            incentive.set('couponCode', couponCode);
          return incentive;
        }), 'Id')
        )
      );
  }
  /** @ignore */
  trackById(index, record) {
    return get(record, 'Id');
  }


  /**
   * Method triggers to open modal dialog using name of the promotion link from the view at cart level.
   * @param incentiveName The applied promotion name.
   * @param adjustmentItem Adjustment line item from the promotion applied to the cart.
   * @ignore
   */
  openModalForCartPromo(incentive: Incentive) {
    this.promotionModal.openIncentiveModal(incentive);
  }

  /**
   * Method applies the promotion to the cart using the promocode property.
   * @fires promotionService.applyPromotions
   * @ignore
   */
  applyPromotions() {
    this.loading = true;
    this.promotionService.applyPromotions(this.promocode).pipe(take(1)).subscribe(
      res => {
        if(get(res, 'error.data.message')) {
          const title = get(res, 'error.data.message') === 'PROMOTION_OR_COUPON_NOT_AVAILABLE' ? 'INVALID_PROMOTION_TITLE' : 'INVALID_COUPON_TITLE';
          this.exceptionService.showWarning(`ERROR.PROMOTION.${get(res, 'error.data.message')}`, `ERROR.PROMOTION.${title}`, { name: this.promocode });
        } else if(res) {
          this.exceptionService.showSuccess('SUCCESS.PROMOTION.VALID_PROMOTION_MESSAGE', 'SUCCESS.PROMOTION.VALID_PROMOTION_TITLE', { name: this.promocode });
        } else {
          this.exceptionService.showWarning('ERROR.PROMOTION.PROMOTION_OR_COUPON_NOT_AVAILABLE', 'ERROR.PROMOTION.INVALID_PROMOTION_TITLE', { name: this.promocode });
        }
        this.loading = false;
        this.promocode = null;
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * Method removes the promotion from the cart using the promocode property
   * and displays a toaster with the name of the promotion which gets removed.
   * @fires promotionService.removeAppliedPromotion
   * @ignore
   */
  removePromotion(incentive: Incentive) {
    set(incentive, '_metadata.loading', true);
    const code = incentive.get('couponCode') ? incentive.get('couponCode') : get(incentive, 'IncentiveCode');
    this.promotionService.removeAppliedPromotion(incentive).pipe(take(1)).subscribe(res => {
      this.exceptionService.showSuccess('SUCCESS.PROMOTION.REMOVED_TOASTR_MESSAGE', 'SUCCESS.PROMOTION.REMOVED_TOASTR_TITLE', { name: code });
    });
  }
}
