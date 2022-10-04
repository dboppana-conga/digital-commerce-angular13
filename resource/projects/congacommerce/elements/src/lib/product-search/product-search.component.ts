import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TypeaheadMatch, TypeaheadDirective } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { ConfigurationService } from '@congacommerce/core';
import { Product, ProductService } from '@congacommerce/ecommerce';

/**
 * Product Search Component can be used to render typeahead search implementation, while searching for 
 * a list of products matching a given input string.
 * This component can search for products matching a product name, product code or product description.
 * The minimum number of characters in the search string must be 3.
 * 
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productSearch.png" style="max-width: 100%">
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductSearchModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductSearchModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-product-search></apt-product-search>
```
*/
@Component({
  selector: 'apt-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductSearchComponent implements OnInit {

  /** Element refrence for input box of search dailog */
  @ViewChild('searchBox', { static: false }) searchBox: ElementRef;
  /** Element refrence for search dailog */
  @ViewChild('searchModal', { static: false }) searchModal: ElementRef;
  /** Bootstrap typeAhead directive refrence to show matched product with search string */
  @ViewChild('typeAheadItem', { static: false }) typeAheadItem: TypeaheadDirective;

  /**
   * typeAheadLimit specifies the maximum number of search results to be shown (defaults to 5).
   */
  @Input() typeAheadLimit: number = 5;
  /**
   * Observable instance of type Product to show result based on search.
   */
  typeahead$: Observable<Array<Product>> = new Observable<Array<Product>>();
  /**
   * Flag to show loader.
   */
  typeaheadLoading: boolean = false;
  /**
   * Search string to search a product.
   */
  searchString: string;
  /**
   * Event to specify any key is pressed.
   */
  keyupEvent: any;
  /**
   * Query for search a product.
   */
  searchQuery: string;
  /** 
   * refrence for modal dialog
   * @ignore
   */
  modalRef: BsModalRef;

  noResult: boolean = false;

  constructor(private modalService: BsModalService, private productService: ProductService, private router: Router, private config: ConfigurationService) {
    this.typeahead$ = Observable.create((observer: any) => {
      observer.next(this.searchQuery);
    }).pipe(
      switchMap((query: string) => {
        return this.productService.searchProducts(query, 5);
      })
    );
  }

  /** @ignore */
  ngOnInit() {
  }

  /** @ignore */
  onSubmit() {
    this.router.navigate(['/search', this.searchQuery]);
  }

  /** @ignore */
  typeaheadOnSelect(evt) {
    if (this.searchString !== this.searchQuery) {
      this.searchQuery = this.searchString;
      this.doSearch();
    } else {
      this.modalRef.hide();
      this.typeaheadLoading = false;
      this.router.navigate(['/products', evt.item[this.config.get('productIdentifier')]]);
    }
  }

  /** @ignore */
  onInputChange(evt: any) {
    if (evt.key.toLowerCase() === 'enter' && !isEmpty(this.searchQuery) && this.searchQuery.length > 2) {
      this.searchString = this.searchQuery;
      this.doSearch();
    }
  }

  /** @ignore */
  onTemplateMatch(match: TypeaheadMatch) {
    this.searchString = match.value;
  }

  /** @ignore */
  openModal(template: TemplateRef<any>) {
    this.searchQuery = '';
    this.modalRef = this.modalService.show(template);
  }

  /** @ignore */
  doSearch() {
    this.modalRef.hide();
    this.typeaheadLoading = false;
    if (this.searchQuery) this.router.navigate(['/search', this.searchQuery]);
  }

  /** @ignore */
  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

}
