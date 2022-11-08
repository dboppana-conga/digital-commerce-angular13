import { Injectable } from '@angular/core';
import { AObjectService, AObject } from '@congacommerce/core';
import { of, Observable } from 'rxjs';
import { some, isNil } from 'lodash';
import { PriceMatrix, PriceListItem } from '../classes/index';
import { PriceListItemService } from './price-list-item.service';

/**
 * <strong>This method is a work in progress.</strong>
 * 
 * Price matrices are used to map various product facets to a price adjustment. For example, there may be matrixes for attributes or quantities that adjust the base price. Use this
 * service to retrieve the data for those matrices.
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { PriceMatrixService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private priceMatrixService: PriceMatrixService)
}
// or
export class MyService extends AObjectService {
     private priceMatrixService: PriceMatrixService = this.injector.get(PriceMatrixService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class PriceMatrixService extends AObjectService {
    type = PriceMatrix;

    priceListItemService = this.injector.get(PriceListItemService);

    /**
     * Method gets all the price matrix data for a specific product.
     * @param productCode the code of the product to retrieve the price matrix data for.
     * @param attributeGroupName An optional parameter defining the specific attribute group to retrieve matrix data for.
     * @returns A hot observable containing an array of price matrix data for the given product.
     */
    public getPriceMatrixDataByCode(productCode: string, attributeGroupName?: string): Observable<Array<PriceMatrix>> {
     //   let groupNameFilter = (attributeGroupName) ? [PriceMatrixService.attributeGroupNameQuery(attributeGroupName, this.type)] : null;
        // return this.where(null, 'AND', groupNameFilter, null, null, [
        //     new AJoin(this.priceListItemService.type, 'PriceListItemId', 'Id', [new ACondition(this.priceListItemService.type, 'Product.ProductCode', 'Equal', productCode)])
        // ]);
        return null;
    }

    /**
     * Method returns the price matrix data for a given array of price list items.
     *
     * @param priceListItemList The array of price list items to return price matrix data for.
     * @param attributeGroupName An optional parameter of defining the specific attribute group to retrieve matrix data for.
     * @returns A hot observable containing an array of price matrix data for the given price list items.
     */
    public getPriceMatrixData(priceListItemList: Array<PriceListItem>, attributeGroupName?: string): Observable<Array<PriceMatrix>> {
        /* TO DO : */
        // const ids = priceListItemList.map(r => r.Id);
     //   const groupNameFilter = (attributeGroupName) ? [PriceMatrixService.attributeGroupNameQuery(attributeGroupName, this.type)] : null;
        // if (ids && ids.length > 0 && some(ids, (i => !isNil(i))))
        //     return this.where([new ACondition(this.type, 'PriceListItemId', 'In', ids)], 'AND', groupNameFilter);
        // else
            return of([]);
    }

    /** @ignore */
  //  private static attributeGroupNameQuery(attributeGroupName: string, type: new (t?) => AObject): AFilter {
        // const conditionList: Array<ACondition> = [];
        // for (let i = 1; i <= 6; i++) {
        //     conditionList.push(new ACondition(type, 'Dimension' + i + '.Id.Attribute.AttributeGroup.Name', 'Equal', attributeGroupName));
        // }
        // return new AFilter(type, conditionList, null, 'OR');
  //  }
}