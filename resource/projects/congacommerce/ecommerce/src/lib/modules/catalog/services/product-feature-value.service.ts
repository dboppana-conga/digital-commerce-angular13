import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { get, every, map as _map } from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { ProductFeatureValue } from '../classes/product-feature.model';
import { Product } from '../classes/product.model';
import { memoize } from 'lodash-decorators';

/**
 * The service is responsible for fetching the product feature values.
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductFeatureValueService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private productFeatureValueService: ProductFeatureValueService)
}
// or
export class MyService extends AObjectService {
     private productFeatureValueService: ProductFeatureValueService = this.injector.get(ProductFeatureValueService);
 }
```
 */
@Injectable({
  providedIn: 'root'
})
export class ProductFeatureValueService extends AObjectService {
  type = ProductFeatureValue;

  /**
   * This method fecthes the feature values for the list of products.
   * ### Example:
```typescript
import { ProductFeatureValueService, ProductFeatureValue, Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    productFeatureValue$: Observable<Array<ProductFeatureValue>>;
    productFeatureValue: Array<ProductFeatureValue>;

    constructor(private productFeatureValueService ProductFeatureValueService){}

    getFeature(productList: Array<Product> | Array<string>){
       this.productFeatureValueService.getProductFeatureValues(productList).subscribe(a => this.productFeatureValue = a);
        // or
        this.productFeatureValue$ = this.productFeatureValueService.getProductFeatureValues(productList);
    }
}
```
   * @params productlist is an Array of ProductObject or Array of productId.
   * @returns an observable of Array of ProductFeatureValue object.
   */
  @memoize()
  getProductFeatureValues(productList: Array<Product> | Array<string>): Observable<Array<ProductFeatureValue>> {
    if (get(productList, 'length') > 0) {
      let productIds = null;
      if (every(productList, item => typeof (item) === 'string')) {
        productIds = _map(productList, p => p).join(',');
      }
      else {
        productIds = _map(productList, p => p.Id).join(',');
      }
      // To Do:
      // return this.query({
      //   conditions: [new ACondition(this.type, 'ProductId', 'In', productIds)],
      //   lookups: [
      //     {
      //       field: 'Apttus_Config2__FeatureId__c',
      //       lookups: [{ field: 'Apttus_Config2__FeatureSetId__c' }]
      //     }
      //   ]
      // })
      return null;
    }
    else
      return of(null);
  }
}
