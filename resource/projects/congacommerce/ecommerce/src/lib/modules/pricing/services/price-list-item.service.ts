import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { isNil, find, get, defaultTo } from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { PriceListItem } from '../../pricing/classes/index';
import { Product } from '../../catalog/classes';
import { ChargeType } from '../enums';

/**
 * <strong>This method is a work in progress.</strong>
 * 
 * The price list items map a product to a specific price list. They provide the base price for any product in your catalog
 * <h3>Usage</h3>
 *
 ```typescript
import { PriceListItemService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private priceListItemService: PriceListItemService)
}
// or
export class MyService extends AObjectService {
     private priceListItemService: PriceListItemService = this.injector.get(PriceListItemService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class PriceListItemService extends AObjectService {
    type = PriceListItem;

    /**
     * Method gets price list for a given product.
     * ### Example:
```typescript
import { PriceListItemService, PriceListItem, Product} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    priceListItem: PriceListItem;

    constructor(private priceListItemService: PriceListItemService){}

    getPriceListItem(product: Product){
        PriceListItemService.getPriceListItemForProduct(product);
    }
}
```
     * @param product the instance of the product to return the price list item for.
     * @param chargeType an optional parameter representing the charge type to return the price list item for.
     * @returns price list item object.
     */
    static getPriceListItemForProduct(product: Product, chargeType?: ChargeType): PriceListItem {
        let pli: PriceListItem;
        if (!isNil(chargeType))
            pli = find(get(product, 'PriceLists', []), (item) => item.ChargeType === chargeType);

        if (isNil(pli))
            pli = defaultTo(find(get(product, 'PriceLists', []), (item) => item.ChargeType === ChargeType.StandardPrice || item.ChargeType === ChargeType.Subscription), get(product, 'PriceLists[0]'));

        return pli;
    }

    /**
     * Method gets a single price list item record for a given product code.
     * @param productCodeList string list representing the product codes to return the price list item for.
     * @returns A hot observable containing the price list item for requested product(s).
     */
    getPriceListItemByCode(productCodeList: Array<string>): Observable<Array<PriceListItem>> {
        // TODO: Replace with RLP API
        // const _productList = productCodeList.filter(code => code != null && code.trim().length > 0);
        // if (get(_productList, 'length', 0) > 0) {
        //     return this.where([
        //         new ACondition(this.type, 'Product.ProductCode', 'In', _productList)
        //     ]);
        // } else {
        //     return of([]);
        // }
        return of(null);
    }
}