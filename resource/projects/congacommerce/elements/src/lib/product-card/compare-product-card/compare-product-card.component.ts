
import {take} from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card.component';
/**
 * Compare product card is used as the header in the compare table.
 * Compare cards show product details including images, price, short description, and add to cart button.
 * @ignore
 * <h3>Preview</h3>
 * <img class="jumbotron" src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/compareProductCard.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductCardModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductCardModule, ...]
})
export class AppModule {}
 ```
* @example
* <apt-compare-product-card [product]="product"></apt-compare-product-card>
*/
@Component({
  selector: 'apt-compare-product-card',
  templateUrl: './compare-product-card.component.html',
  styleUrls: ['./compare-product-card.component.scss']
})
export class CompareProductCardComponent extends ProductCardComponent {
  /**
   * The product identifier set in the configuration file.
   * @ignore
   */
  identifier: string = 'Id';

  /**
   * Removes the product associated with this card from the product compare table.
   * @ignore
   */
  removeProduct() {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      let array = params['products'].split(',');
      let filtered = array.filter(value => {
        return value !== this._product[this.identifier];
      });
      this.router.navigateByUrl(`/products/compare?products=${filtered.join(',')}`);
    });
  }

}
