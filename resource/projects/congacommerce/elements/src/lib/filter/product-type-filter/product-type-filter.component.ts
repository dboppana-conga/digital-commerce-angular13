import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import {
  AssetLineItem, AssetService, AccountService, ProductService,
  StorefrontService, Storefront, UserService
} from '@congacommerce/ecommerce';

/**
 * Product Type Filter Component is a way to filter the product list based on product type.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/product-type-filter.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { FilterModule } from '@congacommerce/elements';

@NgModule({
  imports: [FilterModule, ...]
})
export class AppModule {}
 ```
* @example
 ```typescript
* <apt-product-type-filter
*              (onFilterAdd)="handleFilterAdd($event)"
*              (onFilterRemove)="handleFilterRemove($event)"
* ></apt-product-type-filter>
 ```
*/
@Component({
  selector: 'apt-product-type-filter',
  templateUrl: './product-type-filter.component.html',
  styleUrls: ['./product-type-filter.component.css']
})
export class ProductTypeFilterComponent implements OnInit, OnDestroy {
  /**
   * Event emitter for when a new filter is added.
   * TO DO:
   */
  // @Output() onFilterAdd: EventEmitter<ACondition> = new EventEmitter<ACondition>();
  /**
   * Event emitter for when a filter is removed.
   * TO DO:
   */
  // @Output() onFilterRemove: EventEmitter<ACondition> = new EventEmitter<ACondition>();
  /**
   * Current selected value.
   * @ignore
   */
  value: 'Assets' | 'All' = 'All';
  /**
   * Observable instance of the storefront.
   * @ignore
   */
  storefront$: Observable<Storefront>;
  /**
   * Observable instance to get if the user is logged in.
   * @ignore
   */
  isLoggedIn$: Observable<boolean>;
  /**
   * Array of asset line items.
   * @ignore
   */
  assetList: Array<AssetLineItem>;
  /**
   * The current filter condition.
   * @ignore
   * TO DO:
   */
  // filter: ACondition;
  /**
   * @ignore
   */
  private subscription: Subscription;

  constructor(private productService: ProductService, private storefrontService: StorefrontService, private assetService: AssetService, private accountService: AccountService, private userService: UserService) { }

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    this.isLoggedIn$ = this.userService.isLoggedIn();
  }
  /** @ignore */
  // TO DO:
  onCheckChange(event: any) {
    // if(event.target.value === 'Assets'){

    //   this.ngOnDestroy();
    //   this.subscription = this.accountService.getCurrentAccount()
    //     .pipe(
    //       filter(account => !_.isNil(account)),
    //       switchMap(account => this.assetService.query({
    //         conditions: [
    //           new ACondition(this.assetService.type, 'LineType', 'NotEqual', 'Option'),
    //           new ACondition(this.assetService.type, 'IsPrimaryLine', 'Equal', true),
    //           new ACondition(this.assetService.type, 'Product.ConfigurationType', 'NotEqual', 'Option')
    //         ],
    //         groupBy: ['ProductId']
    //       }))
    //     ).subscribe(assetList => {
    //       this.filter = new ACondition(this.productService.type, 'Id', 'In', _.map(assetList, a => a.ProductId));
    //       this.onFilterAdd.emit(this.filter);
    //     });
    // }else{
    //   this.onFilterRemove.emit(this.filter);
    // }
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
