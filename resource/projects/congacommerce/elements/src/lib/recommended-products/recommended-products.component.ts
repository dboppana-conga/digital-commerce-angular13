
import {map} from 'rxjs/operators';
import { Component, Input, OnChanges } from '@angular/core';
import { Product, Cart } from '@congacommerce/ecommerce';
import { ConstraintRuleService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
/**
 * The Constraint Rules Recommended Products Component is used for displaying recommended products for items in cart.
 * <strong>This component is a work in progress.</strong>
 * 
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/recommendedProducts.png" style="max-width: 100%">
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { RecommendedProductsModule } from '@congacommerce/elements';

@NgModule({
  imports: [RecommendedProductsModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-cr-recommended-products
*             [productList]="cartProducts"
*             [cart]="cart$ | async"
* ></apt-cr-recommended-products>
```
*/
@Component({
  selector: 'apt-cr-recommended-products',
  templateUrl: './recommended-products.component.html',
  styleUrls: ['./recommended-products.component.scss']
})
export class CRRecommendedProductsComponent implements OnChanges {
  /**
   * Array of products.
   */
  @Input() productList: Array<Product>;
  /**
   * Instance of cart.
   */
  @Input() cart: Cart;
  /** @ignore */
  productRecommendations$: Observable<Array<Product>>;

  constructor(private crService: ConstraintRuleService) { }

  ngOnChanges() {
    this.productRecommendations$ = this.crService.getRecommendationsForProducts(this.productList).pipe(map(productList => {
      productList.forEach(product => _.set(product, '_metadata.inCart', this.cart.LineItems.filter(item => item.Product.Id === product.Id).length > 0));
      return productList;
    }));
  }

}
