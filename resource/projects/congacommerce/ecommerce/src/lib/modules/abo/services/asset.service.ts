import { Injectable } from '@angular/core';
import { throwError as observableThrowError, of, combineLatest } from 'rxjs';
import { take, mergeMap, map, switchMap, tap } from 'rxjs/operators';
import { isEmpty, get, forEach, find, values, keys, set, map as _map, every } from 'lodash';
import { memoize } from 'lodash-decorators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { AObjectService, SimpleDate, ApiService } from '@congacommerce/core';
import { IncrementAssetDO } from '../classes/increment-asset-do';
import { AssetLineItemExtended } from '../classes/asset-item.model';
import { Product } from '../../catalog/classes/product.model';
import { CartService } from '../../cart/services';
import { AccountService } from '../../crm/services';
import { ProductAttributeGroupService } from '../../catalog/services/product-attribute-group.service';
import { StorefrontService } from '../../store/services/storefront.service';

/** @ignore */
const _moment = moment;

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * Assets are the products own by customer and a user may wish to renew/terminate/update existing assets.
 * * <h3>Usage</h3>
 *
 ```typescript
import { AssetService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private assetService: AssetService)
}
// or
export class MyService extends AObjectService {
     private assetService: AssetService = this.injector.get(AssetService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})

export class AssetService extends AObjectService {

    type = AssetLineItemExtended;

    private cartService: CartService = this.injector.get(CartService);

    protected accountService = this.injector.get(AccountService);
    apiService: ApiService = this.injector.get(ApiService);
    protected attributeGroupService = this.injector.get(ProductAttributeGroupService);
    protected storefrontService = this.injector.get(StorefrontService);
    /**
    * The primary method to get the asset line items for given account.
    *
    * ### Example:
```typescript
import { AssetService  } from '@congacommerce/ecommerce';


export class MyComponent implements OnInit{
    assetLineItems: Array<AssetLineItem>;
    assetLineItems$: Observable<Array<AssetLineItem>>;

    constructor(private assetService: AssetService){}

    ngOnInit(){
        this.assetService.getAssetLineItemForAccount().subscribe(assetLineItems => {...});
        // or
        this.assetLineItems$ = this.assetService.getAssetLineItemForAccount();
        // or
        this.assetService.getAssetLineItemForAccount(accountId: string, adtlConditions: Array<ACondition>)subscribe(assetLineItems => {...});
        // or
        this.assetLineItems$ = this.assetService.getAssetLineItemForAccount(accountId: string, adtlConditions: Array<ACondition>);
    }
}
```
    * @override
    * @param accountId optional accountId, if accountId null then account details for logged in user is used to retrieve asset line item records
    * @param adtlConditions optional list of ACondition to filter asset line item records
    * @param sort optional list of ASort objects for sorting the results.
    * @returns Observable<Array<AssetLineItemExtended>> returns an observable list of asset line item records
    * To DO:
    */
    public getAssetLineItemForAccount(accountId?: string): Observable<Array<AssetLineItemExtended>> {
        return null;
        // return this.accountService.getCurrentAccount().pipe(mergeMap(account => {
        //     if (account === null) return of(null);
        //     let conditionList = [];

        //     if (accountId) {
        //         conditionList.push(new ACondition(this.type, 'AccountId', 'Equal', accountId));
        //         conditionList.push(new ACondition(this.type, 'IsInactive', 'NotEqual', true));
        //     } else if (account && account.Id) {
        //         conditionList.push(new ACondition(this.type, 'AccountId', 'Equal', account.Id));
        //         conditionList.push(new ACondition(this.type, 'IsInactive', 'NotEqual', true));
        //     }

        //     if (adtlConditions) {
        //         conditionList = conditionList.concat(adtlConditions);
        //     }

        //     if (conditionList.length > 0) {
        //         return this.where(conditionList, 'AND', null, sort, pageInfo);
        //     } else {
        //         return of(null);
        //     }
        // }));
    }

    /**
        * The primary method to renew the existing assets.
        *
        * ### Example:
```typescript
import { AssetService, AssetLineItemExtended } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{
    lineItemMap: Array<AssetLineItemExtended>;
    lineItemMap$: Observable<Array<AssetLineItemExtended>>;

    constructor(private assetService: AssetService){}

    ngOnInit(){
        this.assetService.renewAssets(assetIds: Array<string>, renewEndDate: Date, renewTerm: number, cartId: string, farthestAssetEndDate: boolean)subscribe(lineItemMap => {...});
        // or
        this.lineItemMap$ = this.assetService.renewAssets(assetIds: Array<string>, renewEndDate: Date, renewTerm: number, cartId: string, farthestAssetEndDate: boolean);
    }
}
```
        * @override
        * @param assetIds list of asset ids to renew
        * @param renewEndDate renew end date for asset renewal
        * @param renewTerm renew term for asset renewal
        * @param farthestAssetEndDate farthest asset end date for asset renewal
        * @returns Observable<Array<AssetLineItemExtended>> returns an observable list of all line items with all their field values.
    */
    public renewAssets(assetIds: Array<string>, renewEndDate: Date, renewTerm: number, farthestAssetEndDate: boolean): Observable<AssetLineItemExtended> {
        if(isEmpty(assetIds))
            throw 'List of asset ids is not valid';
       
        const payload = {
            assetIds : assetIds,
            renewEndDate: renewEndDate ? _moment(renewEndDate).format('YYYY-MM-DD HH:mm:ss') : null,
            renewTerm: renewTerm,
            farthestAssetEndDate: farthestAssetEndDate
        }
            
        return this.apiService.post(`/assets/${CartService.getCurrentCartId()}/renew`, payload, this.type, null, false)
            .pipe(tap(() => this.cartService.reprice()));
    }

    /**
        * The primary method to terminate the existing assets.
        *
        * ### Example:
```typescript
import { AssetService } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{
    lineItemMap: Array<any>;
    lineItemMap$: Observable<Array<any>>;

    constructor(private assetService: AssetService){}

    ngOnInit(){
        this.assetService.cancelAssets(assetIds: Array<string>, cancelDate: Date)subscribe(lineItemMap => {...});
        // or
        this.lineItemMap$ = this.assetService.cancelAssets(assetIds: Array<string>, cancelDate: Date);
    }
}
```
        * @override
        * @param assetIds list of asset ids to terminate
        * @param cancelDate cancel date for asset termination
        * @returns Observable<Array<any>> returns an observable list of all line items with all their field values.
    */
    public cancelAssets(assetIds: Array<string>, cancelDate: Date): Observable<any> {
        return this.cartService.getMyCart().pipe(take(1), mergeMap(
            cart => {
                if (get(assetIds, 'length', 0) === 0)
                    return observableThrowError('List of asset ids is not valid');

                if (!cancelDate)
                    return observableThrowError('CancelDate is not valid or undefined');

                let date = new SimpleDate(cancelDate);

                let cancelAssetRequest = {
                    assetIds: assetIds,
                    cancelDate: date.getSimpleDate()
                };

                return this.apiService.post(`/assets/${cart.Id}/terminate`, cancelAssetRequest, this.type, null, false)
                .pipe(tap(() => this.cartService.reprice()));
            }
        ));
    }

    /**
        * The primary method to increment the existing assets.
        *
        * ### Example:
```typescript
import { AssetService, IncrementAssetDO, IncrementLineAction } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{
    lineItemMap: Array<any>;
    lineItemMap$: Observable<Array<any>>;

    constructor(private assetService: AssetService){}

    ngOnInit(){
        this.assetService.incrementAssets(incrementAssetDO: Array<IncrementAssetDO>)subscribe(lineItemMap => {...});
        // or
        this.lineItemMap$ = this.assetService.incrementAssets(incrementAssetDO: Array<IncrementAssetDO>);
    }
}
```
        * @override
        * @param incrementAssetDOs list of increment asset data objects for incrementing the existing assets
        * @returns Observable<Array<any>> returns an observable list of all line items with all their field values.
    */
    public incrementAssets(incrementAssetDOs: Array<IncrementAssetDO>): Observable<any> {
        return this.cartService.getMyCart().pipe(take(1), mergeMap(
            cart => {
                if (get(incrementAssetDOs, 'length', 0) === 0)
                    return observableThrowError('List of increment asset object is not valid');

                let incrementAssetRequest = {
                    cartId: cart.Id,
                    incrementAssetDOs: incrementAssetDOs
                };

                return this.apiService.post(`/assets/${cart.Id}/increment`, incrementAssetRequest, this.type, null, false)
                .pipe(tap(() => this.cartService.reprice()));
            }
        ));
    }

    /**
    * The primary method to amend the existing assets.
    *
    * ### Example:
```typescript
import { AssetService } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{
    lineItemMap: Array<any>;
    lineItemMap$: Observable<Array<any>>;

    constructor(private assetService: AssetService){}

    ngOnInit(){
        this.assetService.amendAssets(assetIds: Array<string>)subscribe(lineItemMap => {...});
        // or
        this.lineItemMap$ = this.assetService.amendAssets(assetIds: Array<string>);
    }
}
```
    * @override
    * @param assetIds list of asset ids to amend
    * @returns Observable<Array<any>> returns an observable list of all line items with all their field values.
    */
    public amendAssets(assetIds: Array<string>): Observable<any> {
        return this.cartService.getMyCart().pipe(take(1), mergeMap(
            cart => {
                if (get(assetIds, 'length', 0) === 0)
                    return observableThrowError('List of asset ids is not valid');

                let amendAssetRequest = {
                    assetIds: assetIds
                };

                return this.apiService.post(`/assets/${cart.Id}/amend`, amendAssetRequest, null, null, false)
                    .pipe(
                        switchMap((res)=> combineLatest([of(values(res)), this.getAssetsLineItemsById(keys(res))])),
                        map(([cartItems, assetLineItems]) => {
                            forEach(cartItems,(cartItem)=>{
                                const assetLineItem = find(assetLineItems, { 'Id': cartItem.Apttus_Config2__AssetLineItemId__c});
                                set(cartItem, 'AssetLineItem', assetLineItem);
                            });
                            set(cart, 'LineItems', cartItems);
                            this.cartService.publish(cart);
                        }),
                        tap(() => this.cartService.reprice()),
                    );
            }
        ));
    }

    public groupFormItems(items: Array<any>): Object {
        return null;
    }

    /**
     * This method returns the bundled options for the asset line item passed.
     * @param assetLineItem Instance of the quote line item passed.
     * @returns An observable containing the array of asset line items for a given asset line item.
     * To Do:
     */
    public getBundleItemsForAssetLineItem(assetLineItem: string | AssetLineItemExtended): Observable<Array<AssetLineItemExtended>> {
        const assetLineItem$ = (typeof assetLineItem === 'string') ? this.fetch(assetLineItem).pipe(map(res => res[0])) : of(assetLineItem);

        // return assetLineItem$.pipe(mergeMap(item => this.where([
        //     new ACondition(this.type, 'BundleAssetId', 'Equal', item.Id)
        // ])));
        return null;
    }

    /**
    * The primary method to swap the existing assets. Creates line items for the cancelled asset line item and new line items for swapped product.
    *
    * ### Example:
```typescript
import { AssetService } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{
    lineItemMap: Array<any>;
    lineItemMap$: Observable<Array<any>>;

    constructor(private assetService: AssetService){}

    ngOnInit(){
        this.assetService.swapAssets(assetIds: Array<string>)subscribe(lineItemMap => {...});
        // or
        this.lineItemMap$ = this.assetService.swapAssets(assetIds: Array<string>);
    }
}
```
    * @override
    * @param assetIds list of asset ids which are swapped
    * @param productIds list of ids of the product with which the asset is being swapped
    * @param newStartDate new asset start date on swapping
    * @returns Observable<Array<any>> returns an observable list of all line items with all their field values.
    */
    public swapAssets(assetIds: Array<string>, productIds: Array<string>, newStartDate: Date): Observable<any> {
        return this.cartService.getMyCart().pipe(take(1), mergeMap(
            cart => {
                if (get(assetIds, 'length', 0) === 0 || get(productIds, 'length', 0) === 0)
                    return of(null);

                return  this.apiService.post('swapAssets', { cartId: cart.Id, assetIds: assetIds, productIds: productIds, newStartDate: newStartDate },this.type, null, false)
                    .pipe(tap(() => this.cartService.reprice()));
            }
        ));
    }

    /**
    * This method can be used to get the asset line items for given set of products.
    * ABO must be enabled in the storefront to get asset line item records.
    * ### Example:
```typescript
import { AssetService } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{
    assetLineItems: Array<AssetLineItem>;
    assetLineItems$: Observable<Array<AssetLineItem>>;

    constructor(private assetService: AssetService){}

    ngOnInit(){
        this.assetService.getAssetLineItemsforProducts(products: Array<Product>).subscribe(assetLineItems => {...});
        // or
        this.assetLineItems$ = this.assetService.getAssetLineItemsforProducts(products: Array<Product>);
    }
}
```
    * @override
    * @param productList array of products or an array of string representing product ids.
    * @returns Observable<Array<AssetLineItemExtended>> returns an observable list of asset line item records.
    * To Do:
    */
   @memoize()
    public getAssetLineItemsforProducts(productList: Array<Product> | Array<string>): Observable<Array<AssetLineItemExtended>> {
        if (get(productList, 'length') > 0) {
            let productIds = null;
            if (every(productList, item => typeof (item) === 'string')) {
                productIds = _map(productList, p => p).join(',');
            }
            else {
                productIds = _map(productList, p => p.Id).join(',');
                return null;
            }
        }
                // return this.storefrontService.getStorefront()
                // .pipe(
                //     switchMap(storefront => {
                //         if (storefront.EnableABO) {
                //             return this.query({
                //                 conditions: [
                //                     new ACondition(this.type, 'Product.Id', 'In', productIds)
                //                 ],
                //                 filters: [
                //                     new AFilter(
                //                         this.type,
                //                         [
                //                             new ACondition(this.type, 'LineType', 'NotEqual', 'Option'),
                //                             new ACondition(this.type, 'Product.ConfigurationType', 'NotEqual', 'Option'),
                //                             new ACondition(this.type, 'IsPrimaryLine', 'Equal', true)
                //                         ]
                //                     )
                //                 ]
                //             })
                //         }
                //         else {
                //             return of(null);
                //         }
                //     })
                // )}
            //}
        // else {
        //     return of(null);
        // }
    }

    /**
     * Method will return the details of asset details for a given assetLineItemId.
     * @param An array of asset ids.
     * @returns It will return an array of assetLineItem details.
     * TO DO:
    */
    getAssetsLineItemsById(assetIds:Array<string>): Observable<Array<AssetLineItemExtended>>{  
        // const ids = assetIds.toString()
        // return this.apiService.post('/Apttus_Config2__AssetLineItem__c/query', {
        //     'alias': false,
        //     'conditions': [
        //       {
        //         'field': 'Id',
        //         'filterOperator': 'In',
        //         'value':  ids
        //       }
        //     ],
        //   }, this.type, null, false);          
        return of([]);
    }
}