import { Component, Input, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '@congacommerce/core';
import { Product, ProductService } from '@congacommerce/ecommerce';
import { map } from 'rxjs/operators';
/**
 * The Product Compare component is used to display a side by side comparison of product records.
 * <strong>This component is a work in progress.</strong>
 * Each product is shown as a card at the top of the component with a table below each card listing the features.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productCompare.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductCompareModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductCompareModule, ...]
})
export class AppModule {}
 ```
* @example
```typescript
* <apt-product-compare [identifiers]="identifierArray"></apt-product-compare>
```
*/
@Component({
  selector: 'apt-product-compare',
  templateUrl: './product-compare.component.html',
  styleUrls: ['./product-compare.component.scss']
})
export class ProductCompareComponent implements OnChanges {
  /**
   * List of product identifiers to use to populate the comparison table.
   */
  @Input() identifiers: Array<string>;
  /**
   * Observable array of products to compare.
   * @ignore
   */
  products$: Observable<Array<Product>>;
  /**
   * The product identifier set in the configuration file.
   * @ignore
   */
  identifier: string = 'Id';
  /**
   * Object used to set the min-width style property for the table based on the number of columns.
   * @ignore
   */
  widths = {
    2: '600px',
    3: '800px',
    4: '1000px',
    5: '1200px'
  };

  constructor(private config: ConfigurationService, private productService: ProductService) {
    this.identifier = this.config.get('productIdentifier');
  }

  ngOnChanges() {
    // TODO: Replace with RLP integration
    // const conditions: Array<ACondition> = new Array(new ACondition(this.productService.type, this.identifier, 'In', this.identifiers));
    // this.products$ = this.productService.getProducts(null, null, null, null, null, null, conditions).pipe(map(res => res.Products));
    this.products$ = of(null);
  }
}
