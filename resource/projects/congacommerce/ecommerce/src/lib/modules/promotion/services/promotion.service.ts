import { Injectable, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { get } from 'lodash';
import { flatMap, tap, catchError } from 'rxjs/operators';
import { AObjectService, ApiService, ConfigurationService } from '@congacommerce/core';
import { AdjustmentItem } from '../classes/adjustment-item.model';
import { Incentive } from '../classes/incentive.model';
import { CartService } from '../../cart/services/cart.service';
import { IncentiveService } from '../services/incentive.service';


/**
 * <strong>This service is a work in progress.</strong>
 * 
 * @ignore
 * Promotion Service defines a way to add/remove promotions to/from the cart.
 */
@Injectable({
  providedIn: 'root'
})

export class PromotionService extends AObjectService {
  type = AdjustmentItem;
  private cartService: CartService = this.injector.get(CartService);
  private readonly configService: ConfigurationService = this.injector.get(ConfigurationService);
  apiService: ApiService = this.injector.get(ApiService);
  private incentiveService: IncentiveService = this.injector.get(IncentiveService);


  /**
     * Method applies promotion to the current cart based on the promo code passed.
     * ### Example:
```typescript
import { PromotionService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    constructor(private promotionService: PromotionService){}

    applyPromotions(promocode: string){
          this.promotionService.applyPromotions(promocode).subscribe({...});
    }
}
```
     * @param promocode a string value representing the promotion code to be applied to the cart.
     * @returns a observable<boolean | HttpErrorResponse> when the operation has completed.
     */
  applyPromotions(promocode: string): Observable<boolean | HttpErrorResponse> {
    return this.apiService.post(`/carts/${CartService.getCurrentCartId()}/promotions?mode=${this.configService.get('pricingMode')}`, { code: promocode })
      .pipe(
        tap(res => {
          if (res)
            this.cartService.priceCart();
        }),
        catchError(e => of(e))
      );
  }

  /**
  * Method returns an observable containing an array of adjustment line items for the current cart.
  * ### Example:
```typescript
  import { PromotionService } from '@congacommerce/ecommerce';
  import { AdjustmentItem } from '@congacommerce/ecommerce';
  import { Observable } from 'rxjs/Observable';

  export class MyComponent implements OnInit{
      adjustmentLineItems$: Observable<Array<AdjustmentLineItem>>;
      adjustmentLineItems; Array<AdjustmentLineItem>;
      constructor(private promotionService: PromotionService){}

      getAppliedPromotionForCart(){
            this.promotionService.getAppliedPromotionForCart().subscribe(res => this.adjustmentLineItems = res);
            or
            this.adjustmentLineItems$ = this.promotionService.getAppliedPromotionForCart();
      }
  }
```
    *@param incentiveCode is the valid incentive code value.
    *@returns an observable containing an array of adjustment line items for the current cart.
    To Do:
  */
  getAppliedPromotionForCart(incentiveCode?: string): Observable<Array<AdjustmentItem>> {
    // return this.cartService.getMyCart(false)
    //   .pipe(
    //     flatMap(cart => {
    //       const conditionList = [
    //         new ACondition(this.type, 'LineItem.ConfigurationId', 'Equal', get(cart, 'Id')),
    //         new ACondition(this.type, 'IncentiveId', 'NotEqual', null),
    //         new ACondition(this.type, 'Type', 'Equal', 'Promotion')
    //       ];
    //       if (incentiveCode)
    //         conditionList.push(new ACondition(this.type, 'Incentive.IncentiveCode', 'Equal', incentiveCode));

    //       return this.query({
    //         conditions: conditionList,
    //         skipCache: true
    //       });
    //     })
    //   );
    return null;
  }

  /**
    * Method returns an observable containing an array of adjustment line items for the lineItem 
    * based on the LineNumber.
    * @param lineNumber is of type number, which accepts the LineNumber of the lineItem.
    * ### Example:
  ```typescript
    import { PromotionService } from '@congacommerce/ecommerce';
    import { AdjustmentItem } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';
  
    export class MyComponent implements OnInit{
        adjustmentLineItems$: Observable<Array<AdjustmentLineItem>>;
        adjustmentLineItems; Array<AdjustmentLineItem>;
        constructor(private promotionService: PromotionService){}
  
        getAppliedPromotionForLineItem(lineNumber: number){
              this.promotionService.getAppliedPromotionForLineItem(lineNumber).subscribe(res => this.adjustmentLineItems = res);
              or
              this.adjustmentLineItems$ = this.promotionService.getAppliedPromotionForLineItem(lineNumber);
        }
    }
  ```
      * @returns an observable containing an array of adjustment line items for the lineItem based on the lineNumber.
      * To Do:
    */
  getAppliedPromotionForLineItem(lineNumber: number): Observable<Array<AdjustmentItem>> {
    // return this.cartService.getMyCart(false)
    //   .pipe(
    //     flatMap(cart => {
    //       const conditionList = [
    //         new ACondition(this.type, 'LineItem.ConfigurationId', 'Equal', get(cart, 'Id')),
    //         new ACondition(this.type, 'IncentiveId', 'NotEqual', null),
    //         new ACondition(this.type, 'LineItem.LineNumber', 'Equal', lineNumber)
    //       ];

    //       return this.query({
    //         conditions: conditionList,
    //         skipCache: true
    //       });
    //     })
    //   );
    return null;
  }

  /**
   * Method to get list of incentives based on matching criteria. Criteria should contain valid incentive codes.
   * @param incentiveCodes List of IncentiveCodes seperated by commas 
   * @returns Return list of Incentives for matching criteria.
   */
  getIncentiveByCode(incentiveCodes?: string): Observable<Array<Incentive>> {
    return this.apiService.post('/Apttus_Config2__Incentive__c/query', {
      'conditions': [
        {
          'field': 'IncentiveCode',
          'filterOperator': 'In',
          'value': incentiveCodes
        }
      ]
    }, this.incentiveService.type);
  }

  /**
     * Method removes the promotion from the current cart if it is already applied.
     * ### Example:
```typescript
import { PromotionService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
      constructor(private promotionService: PromotionService){}

      removeAppliedPromotion(promocode: string, msg: string = 'valid', incentiveName?: string){
          this.promotionService.removeAppliedPromotion(promocode).subscribe({...});
      }
}
```
     * @param incentive is the valid incentive record.
     * @returns a void observable when the operation has completed.
     */
  removeAppliedPromotion(incentive: Incentive): Observable<boolean> {
    const code = incentive.get('couponCode') ? incentive.get('couponCode') : incentive.IncentiveCode;
    return this.apiService.delete(
      `carts/${CartService.getCurrentCartId()}/promotions/${code}?mode=${this.configService.get('pricingMode')}`)
      .pipe(
        tap(() => this.cartService.priceCart())
      );
  }
}