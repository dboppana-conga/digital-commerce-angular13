import { Injectable } from '@angular/core';
import { combineLatest, of, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { get, find } from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { CurrencyType } from '../classes/currency-type.model';
import { PriceListService } from './price-list.service';
import { UserService } from '../../crm/services/user.service';
import { StorefrontService } from '../../store/services/storefront.service';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * The conversion service is responsible for pulling conversion rates from your Salesforce instance.
 *  <h3>Usage</h3>
 *
 ```typescript
import { ConversionService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private conversionService: ConversionService)
}
// or
export class MyService extends AObjectService {
     private conversionService: ConversionService = this.injector.get(ConversionService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class ConversionService extends AObjectService {
    type = CurrencyType;
    private userService = this.injector.get(UserService);
    private priceListService = this.injector.get(PriceListService);
    private storefrontService = this.injector.get(StorefrontService);

    /**
     * primary method for pulling conversion rates.
     * ### Example:
```typescript
import { ConversionService, CurrencyType } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    conversionRate: Array<CurrencyType>;
    conversionRate$: Observable<Array<CurrencyType>>;

    constructor(private conversionervice: ConversionService){}

    getConversion(){
        this.conversionervice.getConversionRates().subscribe(a => this.conversionRate = a);
        // or
        this.conversionRate$ = this.conversionService.getConversionRates();
    }
}
```

    /**
     * primary method for pulling conversion rates from Salesforce.
     *
     * @returns a cold observable containing the array of currency type instances
     */
    getConversionRates(): Observable<Array<CurrencyType>> {
        return this.storefrontService.active()
            .pipe(
                map(data => get(data, 'CurrencyTypes'))
            );
    }

    /**
     * Used for getting a single instance of currencytype for the current user
     * ### Example:
```typescript
import { ConversionService, CurrencyType } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    conversionRate: CurrencyType;
    conversionRate$: Observable<CurrencyType>;

    constructor(private conversionervice: ConversionService){}

    getMyCurrencyType(){
        this.conversionervice.getMyCurrencyType().subscribe(a => this.conversionRate = a);
        // or
        this.conversionRate$ = this.conversionService.getMyCurrencyType();
    }
}
```
     * @returns a hot observable containing the currency type of the current user
     */
    getMyCurrencyType(): Observable<CurrencyType> {
        return combineLatest(this.userService.me(), this.getConversionRates()).pipe(map(([user, conversionRates]) => {
            const rates = conversionRates.filter(r => r != null && r.IsoCode === user.DefaultCurrencyIsoCode);
            if (rates && rates.length > 0)
                return rates[0];
            else
                return new CurrencyType();
        }));
    }

    /**
     * Used for getting a single instance of currencytype based on the price List
     *
     * @returns a hot observable containing the currency type of the price List
     */
    getCurrencyTypeForPricelist(): Observable<CurrencyType> {
        /* TODO: Add implementation when corresponding RLP API is available.
        return combineLatest(this.getConversionRates(), this.priceListService.getPriceList())
            .pipe(
                mergeMap(([conversionRates, priceList]) => {
                    return of(find(conversionRates, rate => get(rate, 'IsoCode') === get(priceList, 'CurrencyIsoCode')));
                })
            ); */
        return of(new CurrencyType());
    }

}
