import { Component, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { get, forEach} from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Category, CategoryService } from '@congacommerce/ecommerce';

/**
 * Category filter component is a way to show the related categories and subcategories for a given product category.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/category_filter.png" style="max-width: 100%">
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
* // Basic Usage
 ```typescript
* <apt-category-filter
*             [category]="category"
*             (onChange)="handleCategoryChange($event)"
* ></apt-category-filter>
 ```
*
* // Setting multiselection on peer categories with a custom limit and title.
 ```typescript
* <apt-category-filter
*             [category]="category"
*             selection="multi"
*             relationship="peers"
*             limit="15"
*             title="Similar Categories"
*             (onChange)="handleCategoryChange($event)"
* ></apt-category-filter>
 ```
*/
@Component({
  selector: 'apt-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterComponent implements OnChanges {
  /**
   * The product category.
   */
  @Input() category: string | Category;
  /**
   * Input selection type.
   */
  @Input() selection: 'single' | 'multi' = 'single';
  /**
   * The relationship the displayed categories should have to the main category.
   */
  @Input() relationship: 'children' | 'peers' = 'children';
  /**
   * Maximum number of categories to display.
   */
  @Input() limit: number = 10;
  /**
   * Title to display on the card for this component.
   */
  @Input() title: string = (this.relationship === 'children') ? String(this.getTranslatedTitle('COMMON.SUB_CATEGORIES')) : String(this.getTranslatedTitle('FILTER.CATEGORIES'));
  /**
   * Event emitter for when the value of this component changes.
   */
  @Output() onChange: EventEmitter<Array<Category>> = new EventEmitter<Array<Category>>();
  /** @ignore */
  categoryList$: Observable<Array<Category>>;
  /** @ignore */
  filterGroup: FormGroup = new FormGroup({});
  /** @ignore */
  timeout: any;
  /** @ignore */
  categoryId: string;

  constructor(private categoryService: CategoryService, private translateService: TranslateService) { }

  ngOnChanges() {
    // to reset category selection
    // TO DO:
    this.filterGroup = new FormGroup({});
    if (this.category) {
      if (this.category instanceof Category) {
        this.categoryId = get(this.category, 'Id');
      } else {
        this.translateService.get('FILTER.WRONG_INPUT').subscribe((val: string) => {
          throw val;
        });
      }

      if (this.relationship === 'children')
        this.categoryList$ = this.categoryService.getSubcategories(this.categoryId, this.limit);
      else
        this.categoryList$ = this.categoryService.getRelatedCategories(this.categoryId, this.limit);
    } else if (this.relationship === 'peers') {
      this.categoryList$ = this.categoryService.getRootCategories();
    }
    if (this.categoryList$) {
      this.categoryList$.pipe(take(1)).subscribe(categoryList => {
      forEach(categoryList,category => {
          this.filterGroup.addControl(category.Id, new FormControl());
        });
      });
    }
  }

  /**
   * @ignore
   */
  onCheckChange(event) {
    let categoryIdList = [];
    if (this.timeout)
      clearTimeout(this.timeout);
    this.categoryList$.pipe(take(1)).subscribe(categoryList => {
      categoryList.forEach(category => {
        if (this.filterGroup.controls[category.Id].value === true) categoryIdList.push(category.Id);
      });
      this.categoryService.getCategoryBranchChildren(categoryIdList).pipe(take(1)).subscribe(categories => {
        this.timeout = setTimeout(() => this.onChange.emit(categories), 1000);
      });
    });
  }
  /** @ignore */
  getTranslatedTitle(key: string) {
    this.translateService.stream(key).subscribe((val: string) => {
      return val;
    });
  }
}
