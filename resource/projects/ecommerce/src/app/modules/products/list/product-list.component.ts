import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get, isNil, isEmpty } from 'lodash';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap } from 'rxjs/operators';
import { FilterOperator } from '@congacommerce/core';
import { Category, ProductService, ProductResult, AccountService, Cart, CartService, ProductFilter } from '@congacommerce/ecommerce';
/**
 * Product list component shows all the products in a list for user selection.
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

  /**
   * Current page used by the pagination component. Default is 1.
   */
  page = 1;
  /**
   * Number of records per page used by the pagination component. Default is 12.
   */
  pageSize = 12;
  /**
   * Layout in which one wants to see products. Grid/list. Default is Grid.
   */
  view = 'grid';
  /**
   * A field name on which one wants to apply sorting.
   */
  sortField: string = 'Relevance';
  /**
   * Value of the product family field filter.
   */

  productFamilyFilter: ProductFilter;
  /**
   * Condition to filter products from all products.
   */
  /**
   * Used to hold the current array of subcategories that are selected.
   */
  subCategories: Array<Category> = [];
  /**
   * Search query to filter products list from grid.
   */
  searchString: string = null;
  data$: BehaviorSubject<ProductResult> = new BehaviorSubject<ProductResult>(null);
  productFamilies$: Observable<Array<string>> = of([]);
  cart$: Observable<Cart>;
  category: Category;
  subscription: Subscription;
  hasSearchError: boolean;
  moveToLast: boolean = false;

  /**
   * Control over button's text/label of pagination component for Multi-Language Support
   */
  paginationButtonLabels: any = {
    first: '',
    previous: '',
    next: '',
    last: ''
  };
  /**
   * Array of product families associated with the list of assets.
   */

  /**
   * @ignore
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private router: Router,
    public productService: ProductService,
    private translateService: TranslateService,
    private cartService: CartService
  ) { }

  /**
   * @ignore
   */
  ngOnDestroy() {
    if (!isNil(this.subscription))
      this.subscription.unsubscribe();
  }

  /**
   * @ignore
   */
  ngOnInit() {
    this.getResults();
    this.productFamilies$ = this.productService.getFieldPickList('Family');
    this.translateService.stream('PAGINATION').subscribe((val: string) => {
      this.paginationButtonLabels.first = val['FIRST'];
      this.paginationButtonLabels.previous = val['PREVIOUS'];
      this.paginationButtonLabels.next = val['NEXT'];
      this.paginationButtonLabels.last = val['LAST'];
    });
  }

  /**
   * @ignore
   */
  getResults() {
    this.ngOnDestroy();
    this.subscription = this.activatedRoute.params.pipe(
      mergeMap(params => {
        this.data$.next(null);
        this.hasSearchError = false;
        this.searchString = get(params, 'query');
        let categories = null;
        const sortBy = this.sortField === 'Name' ? this.sortField : null;
        if (!isNil(get(params, 'categoryId')) && isEmpty(this.subCategories)) {
          this.category = new Category();
          this.category.Id = get(params, 'categoryId');
          categories = [get(params, 'categoryId')];
        } else if (!isEmpty(this.subCategories)) {
          categories = this.subCategories.map(category => category.Id);
        }

        if (get(this.searchString, 'length') < 3) {
          this.hasSearchError = true;
          return of(null);
        } else {
          return this.productService.getProducts(categories, this.pageSize, this.page, sortBy, 'ASC', this.searchString, null, null, null, this.productFamilyFilter);
        }
      }),
    ).subscribe(r => {
      this.data$.next(r);
      if (this.moveToLast) {
        this.onPage({
          'itemPerPage': this.pageSize,
          'page': this.page + 1
        })
      }
      this.moveToLast = false;
    });

  }

  /**
   * This function helps at UI to scroll at the top of the product list.
   */
  scrollTop() {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(this.scrollTop);
      window.scrollTo(0, c - c / 8);
    }
  }

  /**
   * Filters peers Category from the categorylist.
   * @param categoryList Array of Category.
   */
  onCategory(categoryList: Array<Category>) {
    const category = get(categoryList, '[0]') as Category;
    if (category) {
      this.subCategories = [];
      this.page = 1;
      this.router.navigate(['/products/category', category.Id]);
    }
  }

  /**
   * Event handler for the pagination component when the page is changed.
   * @param evt Event object that was fired.
   */
  onPage(evt) {
    if (get(evt, 'page') !== this.page) {
      this.page = evt.page;
      this.getResults();
    }
  }

  /**
   * @ignore
   */
  onPriceTierChange(evt) {
    this.page = 1;
    this.getResults();
  }

  /**
   * Filters child category from the categorylist.
   * @param categoryList Array of Category.
   */
  onSubcategoryFilter(categoryList: Array<Category>) {
    this.subCategories = categoryList;
    this.page = 1;
    this.getResults();
  }

  /**
     * This function is called when adding search filter criteria to product grid.	
   * @param condition Search filter query to filter products.	
   */
  onFilterAdd(condition) {
    /* TODO: Add this back when assets feature is available in RLP.	
    remove(this.conditions, (c) => isEqual(c, condition));	
    this.page = 1;	
    this.conditions.push(condition); */
  }

  /**
     * This function is called when removing search filter criteria to product grid.	
   * @param condition Search filter query to remove from products grid.	
   */
  onFilterRemove(condition) {
    /* TODO: Add this back when assets feature is available in RLP.	
    remove(this.conditions, (c) => isEqual(c, condition));	
    this.page = 1; */
  }

  /**
   * @ignore
   */
  onFieldFilter(evt) {
    this.page = 1;
    this.getResults();
  }

  /**
   * Fired when sorting is changed on products grid.
   * @param evt Event object that was fired.
   */
  onSortChange(evt) {
    this.page = 1;
    this.sortField = evt;
    this.getResults();
  }

  /**
   * Fired when page size is changed for products grid.
   * @param event Event object that was fired.
   */
  onPageSizeChange(event) {
    const recordCount = this.data$?.value.TotalCount;
    this.pageSize = event;
    if (this.page * this.pageSize > recordCount) {
      this.page = Math.floor(recordCount / this.pageSize);
      this.moveToLast = (this.page !== 0 && recordCount % this.pageSize !== 0);
      if (this.page === 0) this.page++;
    }
    this.getResults();
  }

  /**
   * Filter on products grid forby product family.
   * @param event Event Object that was fired.
   */
  handlePicklistChange(event: any) {
    this.productFamilyFilter = null;
    if (event.length > 0) {
      const values = [];
      event.forEach(item => values.push(item));
      this.productFamilyFilter = {
        field: 'Family',
        value: values,
        filterOperator: values.length > 1 ? FilterOperator.IN : FilterOperator.EQUAL
      } as ProductFilter;
    }
    this.getResults();
  }
}