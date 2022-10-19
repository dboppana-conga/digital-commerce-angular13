import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { get, isNil } from 'lodash';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';
import { AObjectService, ApiService } from '@congacommerce/core';
import { PriceList } from '../../pricing/classes/price-list.model';
import { StorefrontService } from '../../store/services/storefront.service';
import { UserService } from '../../crm/services/user.service';

/** @ignore */
const _moment = moment;
/**
 * <strong>This method is a work in progress.</strong>
 * 
 * Price lists are the core object for defining the catalog seen by the end user. Categories, products and pricing are all derived from the selected price list.
 * <h3>Usage</h3>
 *
 ```typescript
import { PriceListService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private priceListService: PriceListService)
}
// or
export class MyService extends AObjectService {
     private priceListService: PriceListService = this.injector.get(PriceListService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class PriceListService extends AObjectService {
    type = PriceList;

    storefrontService = this.injector.get(StorefrontService);
    apiService = this.injector.get(ApiService);
    userService = this.injector.get(UserService);

    private priceList: BehaviorSubject<PriceList> = new BehaviorSubject<PriceList>(null);

    onInit() {
        this.refreshPriceList();
    }
    /**
     * @ignore
     */
    refreshPriceList(): void {
        this.userService.getCurrentUser().pipe(
            switchMap(() => this.apiService.get('/catalog/v1/price-lists/active', this.type)),
            take(1),
        )
            .subscribe(res => {
                const priceListResponse = plainToClass(this.type, res, { excludeExtraneousValues: true });
                localStorage.setItem('pricelistId', get(priceListResponse, 'Id'));
                this.priceList.next(priceListResponse);
            });
    }

    /**
     * Method returns the current price list id. If the account is associated with based on price list, this will return the price list id that price list is based on.
     *### Example:
```typescript
import { PriceListService, PriceList } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    priceListId: string;
    priceListId$: Observable<string>;

    constructor(private pricelistService: PriceListService){}

    getPriceListId(){
        this.pricelistService.getPriceListId().subscribe(a => this.priceListId = a);
        // or
        this.priceListId$ = this.pricelistService.getPriceListId();
    }
}
```
     * @returns a hot string observable containing the current price list id.
     */
    getPriceListId(): Observable<string> {
        return this.priceList.pipe(
            filter(r => r != null),
            map(r => get(r, 'BasedOnPriceListId', r.Id))
        );
    }

    /**
     * Method returns the current effective price list id.
     * ### Example:
```typescript
import { PriceListService, PriceList } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    priceListId: string;
    priceListId$: Observable<string>;

    constructor(private pricelistService: PriceListService){}

    getEffectivePriceListId(){
        this.pricelistService.getEffectivePriceListId().subscribe(a => this.priceListId = a);
        // or
        this.priceListId$ = this.pricelistService.getEffectivePriceListId();
    }
}
```
     * @returns a hot string observable containing the current effective price list id.
     */
    getEffectivePriceListId(): Observable<string> {
        return this.priceList.pipe(
            filter(r => r != null),
            map(r => get(r, 'Id'))
        );
    }

    /**
     * Method returns the entire price list instance of the currently selected price list.
     * ### Example:
```typescript
import { PriceListService, PriceList } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    priceList: PriceList;
    priceList$: Observable<PriceList>;

    constructor(private pricelistService: PriceListService){}

    getPriceLists(){
        this.pricelistService.getPriceList().subscribe(a => this.priceList = a);
        // or
        this.priceList$ = this.pricelistService.getPriceList();
    }
}
```
     * @returns a hot observable containing the price list instance.
     */
    getPriceList(): Observable<PriceList> {
        return this.priceList.pipe(filter(r => r != null));
    }

    /**
     * Method returns the entire price list instance of the current effective price list.
     * ### Example:
```typescript
import { PriceListService, PriceList } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    priceList: PriceList;
    priceList$: Observable<PriceList>;

    constructor(private pricelistService: PriceListService){}

    getEffectivePriceList(){
        this.pricelistService.getEffectivePriceList().subscribe(a => this.priceList = a);
        // or
        this.priceList$ = this.pricelistService.getEffectivePriceList();
    }
}
```
     * @returns a hot observable containing the effective price list instance.
     */
    getEffectivePriceList(): Observable<PriceList> {
        return this.priceList.pipe(
            filter(r => r != null),
            map(r => get(r, 'BasedOnPriceList', r))
        ) as Observable<PriceList>
    }

    /**
     * @ignore
     */
    isValidPriceList(pl): boolean {
        if (pl) {
            const today = _moment(new Date()).valueOf();
            const isPlExpired = (!isNil(get(pl, 'ExpirationDate')) && get(pl, 'ExpirationDate') < today) || (!isNil(get(pl, 'EffectiveDate')) && get(pl, 'EffectiveDate') > today);
            return get(pl, 'Active') && !isPlExpired;
        }
        else return false;
    }

    /**
     * @ignore
     */
    isPricelistId(): boolean{ //checks if the pricelist is available or not
        return localStorage.getItem('pricelistId') === 'undefined' ? false : true;
    }
}