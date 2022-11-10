import { Component, OnChanges, Input, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, empty, Observable } from 'rxjs';
import { get, split } from 'lodash';
import { map, take } from 'rxjs/operators';
import { ConfigurationService } from '@congacommerce/core';
import { ProductService, UserService, Product, ConstraintRule, StorefrontService } from '@congacommerce/ecommerce';
import { ProductConfigurationSummaryComponent } from '../product-configuration-summary/configuration-summary.module';
import { BatchSelectionService } from '../../shared/services/index';
import { ProductConfigurationService } from '../product-configuration/services/product-configuration.service';

/**
 * The Product Card component generates a card template which displays the product information.
 * A product description is displayed if type input is set to 'media'.
 * <h3>Preview</h3>
 * <div >
 *    <h4>1.) Card</h4>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productCard.png" style="max-width: 100%">
 *    <h4>2.) Media</h4>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productCardMedia.png" style="max-width: 100%">
 * </div>
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductCardModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductCardModule, ...]
})
export class AppModule {}
 ```
*
* @example
* // Basic Usage
* ```typescript
* <apt-product-card [product]="product"></apt-product-card>
```
*
* // All inputs and outputs
```typescript
* <apt-product-card
*              [product]="product"
*              [thumbnail]="showThumbnail"
*              [type]="card"
*              [showCategory]="showingCategory"
*              [showCode]="showingCode"
*              [showPrice]="showingPrice"
*              [canAddToCart]="canAddToCart"
* ></apt-product-card>
```
*/
@Component({
  selector: 'apt-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductCardComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * The product associated with this component.
   */
  @Input() product: Product | string;
  /**
   * Flag to show the thumbnail image on the product card.
   */
  @Input() thumbnail: boolean = true;
  /**
   * Display type of the product card.
   */
  @Input() type: 'card' | 'media' | 'readonly' = 'card';
  /**
   * Flag to show the category of the product.
   */
  @Input() showCategory: boolean = true;
  /**
   * Flag to show the code of the product.
   */
  @Input() showCode: boolean = true;
  /**
   * Flag to show the price of the product.
   */
  @Input() showPrice: boolean = true;
  /**
   * Flag to show the add to cart button on the card.
   */
  @Input() canAddToCart: boolean = true;
  /**
   * Rules to be skipped or not.
   */
  @Input() skipRules: boolean = false;
  /** @ignore */
  _product: Product;
  /** @ignore */
  loading: boolean;
  /** @ignore */
  aboEnabled: boolean;
  /**
   * Boolean observable to check if user is logged in.
   * @ignore
   */
  isLoggedIn$: Observable<boolean>;
  /** @ignore */
  private subs: Array<any> = [];
  /** @ignore */
  identifier: string = 'Id';
  /** @ignore */
  public selected$: Observable<boolean>;
  /**
   * Array of batch action keys that are enabled.
   * @ignore
   */
  enabledActions: Array<string> = [];
  /**
   * Boolean observable for configuration state.
   * @ignore
   */
  config$: Observable<boolean>;

  /** 
   * @ignore 
   * Added due to stopgap approach
   */
  @ViewChild('productConfiguration', { static: false }) productConfiguration: ProductConfigurationSummaryComponent;

  /** 
   * @ignore 
   * Added due to stopgap approach
   */
  quantity = 1;

  constructor(
    protected config: ConfigurationService,
    protected BatchSelectionService: BatchSelectionService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected storefrontService: StorefrontService,
    private userService: UserService,
    private productConfigurationService: ProductConfigurationService
  ) {
    this.selected$ = of(false);
    this.identifier = this.config.get('productIdentifier');
  }

  ngOnInit() {
    this.isLoggedIn$ = this.userService.isLoggedIn();
    this.storefrontService.getStorefront().pipe(take(1)).subscribe(storefront => {
      this.aboEnabled = get(storefront, 'EnableABO', false);
      this.enabledActions = split(get(storefront, 'AssetActions', ''), ';');
    });
    if (typeof this.product === 'string') {
      this.productService
        .fetch(this.product).pipe(
          map(res => res[0]))
        .subscribe(p => {
          this._product = p;
          this.onProduct();
        });
    } else if (this.product instanceof Product) {
      this._product = this.product;
      this.onProduct();
    } else {
      throw 'apt-product-card product input must be a product or product id';
    }
  }
  /** @ignore */
  onProduct() {
    this.subs.push(this.BatchSelectionService.getSelectedProducts().subscribe(products => {
      this.selected$ = this.BatchSelectionService.isProductSelected(this._product);
    }));
  }

  /**
   * @ignore
   */
  ngOnChanges() { }
  /** @ignore */
  handleCheckbox(e) {
    if (e.target.checked) this.BatchSelectionService.addProductToSelection(this._product);
    else this.BatchSelectionService.removeProductFromSelection(this._product);
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.subs.length > 0) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

  /**
    * Remove product from Drawer
    * @ignore
  */
  removeProduct() {
    this.BatchSelectionService.removeProductFromSelection(<Product>this.product);
  }

  /** 
   * @ignore
   * Added due to stopgap approach
  */
  fetchQuantity(value) {
    this.quantity = value;
  }

  /** 
   * @ignore
   * Added due to stopgap approach
  */
  showProductConfiguration() {
    if (this._product.HasAttributes || this._product.HasOptions) {
      setTimeout(() => this.productConfiguration.show(this.quantity));
    } else {
      this.router.navigate(['/products', this._product[this.identifier]]);
    }
  }
}
