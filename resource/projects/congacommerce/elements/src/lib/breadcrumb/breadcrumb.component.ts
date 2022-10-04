import { Component, OnChanges, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { of, Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ClassType } from 'class-transformer/ClassTransformer';
import { AObjectService, AObject } from '@congacommerce/core';
import { Category, Product, CategoryService } from '@congacommerce/ecommerce';

/**
 * The Breadcrumb component generates links which allow users to navigate to different pages.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/breadcrumb.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
```typescript
import { BreadcrumbModule } from '@congacommerce/elements';

@NgModule({
  imports: [BreadcrumbModule, ...]
})
export class AppModule {}
```
* @example
* // Generate breadcrumb from AObject record
```typescript
* <apt-breadcrumb [sobject]="product"></apt-breadcrumb>
```
*
* // Pass in a defined array of breadcrumbs.
```typescript
* <apt-breadcrumb
*              [label]="myLabel"
*              [breadcrumbs]="myBreadcrumbs"
*              [autoGenerated]="false"
* ></apt-breadcrumb>
```
*/

@Component({
  selector: 'apt-breadcrumb',
  template: `
    <nav aria-label="breadcrumb" class="container-fluid">
      <div class="d-flex justify-content-between align-items-center">
        <ol class="breadcrumb p-0">
          <li class="breadcrumb-item">
            <a href="javascript:void(0)" [routerLink]="['/']">{{'BREADCRUMB.HOME' | translate}}</a>
          </li>
          <li class="breadcrumb-item" [class.active]="breadcrumb.active" *ngFor="let breadcrumb of breadcrumbs$ | async">
            <a href="javascript:void(0)" [routerLink]="breadcrumb.route" *ngIf="!breadcrumb.active; else inactive">{{breadcrumb.label}}</a>
            <ng-template #inactive>{{breadcrumb.label}}</ng-template>
          </li>
          <li class="breadcrumb-item active" [attr.aria-current]="label" *ngIf="label">{{label}}</li>
        </ol>
        <ng-content></ng-content>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnChanges, OnDestroy {
  /**
   * AObject record to use for this component to generate breadcrumbs.
   */
  @Input() sobject: AObject;
  /**
   * Label to use for current location.
   */
  @Input() label: string;
  /**
   * Route to use for breadcrumb navigation.
   */
  @Input() route: string;
  /**
   * Array of breadcrumb links to use to create the set of breadcrumbs. This will override the system from generating breadcrumbs based on any given AObject record.
   */
  @Input() breadcrumbs: Array<BreadcrumbLink>;
  /**
   * Flag to generate the breadcrumbs based on the given AObject record.
   */
  @Input() autoGenerated: boolean = true;
  /** @ignore */
  productCatalogLabel: string;
  /** @ignore */
  breadcrumbs$: Observable<Array<BreadcrumbLink>>;
  /** @ignore */
  private aobjectLabels;
  /** @ignore */
  private readonly subscriptions: Subscription[] = [];

  constructor(private categoryService: CategoryService, private aobjectService: AObjectService, private translateService: TranslateService) {
    this.subscriptions.push(this.translateService.stream(['HEADER', 'AOBJECTS']).subscribe((val: string) => {
      this.productCatalogLabel = val['HEADER']['PRODUCT_CATALOG'];
      this.aobjectLabels = val['AOBJECTS'];
    }));
  }

  ngOnChanges() {
    if (_.get(this.breadcrumbs, 'length', 0) > 0)
      this.breadcrumbs$ = of(this.breadcrumbs);
    else if (this.sobject instanceof Product)
      this.breadcrumbs$ = this.categoryService.getCategoryBranchForProduct(this.sobject).pipe(map(cList => this.mapCategories(cList)));
    else if (this.sobject instanceof Category)
      this.breadcrumbs$ = this.categoryService.getCategoryBranch(_.get(this.sobject, 'Id')).pipe(map(cList => this.mapCategories(cList)));
    else if (this.sobject instanceof AObject && this.autoGenerated === true)
      this.breadcrumbs$ = this.getAObjectBreadcrumbs();
    else
      this.breadcrumbs$ = of(null);
  }
  /** @ignore */
  mapCategories(categoryList: Array<Category>): Array<BreadcrumbLink> {
    if (!categoryList)
      categoryList = [];
    return [{
      label: this.productCatalogLabel, route: ['/products']
    }]
      .concat(
        categoryList
          .filter(category => category.Label !== this.label)
          .map(category => {
            return {
              label: category.Label, route: ['/products/category', _.get(category, 'Id')]
            };
          })
      );
  }
  /** @ignore */
  getAObjectBreadcrumbs(): Observable<Array<BreadcrumbLink>> {
    let translatedLables = this.aobjectLabels;
    return this.aobjectService.describe(this.sobject.constructor as ClassType<AObject>, null, null).pipe(
      map(metadata => {
        const routeLabel = this.route ? this.route : metadata.DisplayName;
        return [
          {
            route: [`/${encodeURIComponent(routeLabel.toLowerCase())}`],
            label: _.defaultTo(translatedLables[_.upperCase(routeLabel)], routeLabel)
          },
          {
            route: [`/${encodeURIComponent(routeLabel.toLowerCase())}/${_.get(this.sobject, 'Id')}`],
            label: _.get(this.sobject, 'Name'),
            active: !_.get(this, 'label')
          }
        ]
      })
    );
  }

  /** @ignore */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
/**
 * Special type for breadcrumb elements used by the BreadcrumbComponent.
 */
export interface BreadcrumbLink {
  /**
   * Label shown on the breadcrumb.
   */
  label: string;
  /**
   * Route that breadcrumb will link to when clicked on.
   */
  route: Array<string>;
  /**
   * Flag to set this breadcrumb as an active clickable link.
   */
  active?: boolean;
}