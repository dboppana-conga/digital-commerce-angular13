import { Component, OnChanges, Input, ViewEncapsulation, ChangeDetectionStrategy, QueryList, ViewChildren } from '@angular/core';
import { Product, CartItem } from '@congacommerce/ecommerce';
import { ConstraintRuleService, ConstraintRule } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs';
import { get, isNil } from 'lodash';
import { CarouselComponent } from 'ngx-bootstrap/carousel';

/**
 * The Product carousel component is a carousel to display the list of products based on the categories which is populated from the  selected price list.
 * The user can slide and view the products listed in the carousel. When user clicks on any product it launches product detail page of the product selelcted.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productCarousel.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductCarouselModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductCarouselModule, ...]
})
export class AppModule {}
 ```
*
* @example
* // Basic Usage
* ```typescript
* <apt-product-carousel [productList]="products"></apt-product-carousel>
```
*
* // All inputs and outputs.
```typescript
* <apt-product-carousel
*             [productList]="products"
*             [dots]="showingDots"
*             [slides]="numberOfSlides"
*             [draggable]="isDraggable"
*             [leftAlign]="isLeftAlign"
*             [title]="title"
*             [subtitle]="subtitle"
* ></apt-product-carousel>
```
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apt-product-carousel',
  templateUrl: `./product-carousel.component.html`,
  styleUrls: ['./product-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselComponent implements OnChanges {
  /**
   * List of products
   */
  @Input()
  public productList: Array<Product>;
  /**
   * List of cart items
   */
  @Input()
  public cartItemList: Array<CartItem>;
  /**
   * Show the dots in carousel
   */
  @Input()
  public dots: boolean = true;
  /**
   * Set the slide count in carousel
   */
  @Input()
  public slides: number = 5;
  /**
  *  Allow drags in carousel
  */
  @Input()
  public draggable: boolean = true;
  /**
  * Set carousel alignment to left.
  */
  @Input()
  public leftAlign: boolean = true;
  /**
   * The title to show on the carousel.
   */
  @Input()
  public title: string;
  /**
   * The sub title to show on the carousel.
   */
  @Input()
  public subtitle: string;
  /**
   * Flag to set product card type as read only or not.
   */
  @Input() readonly: boolean = false;
  /**
   * Flag to show category name on the product card.
   */
  @Input() showCategory: boolean = true;
  /**
   * Flag to show product code on the product card.
   */
  @Input() showCode: boolean = true;
  /** @ignore */
  @ViewChildren(CarouselComponent) carouselList: QueryList<CarouselComponent>;
  /** @ignore */
  cardType: 'readonly' | 'card' = 'card';
  /** @ignore */
  constraintRules$: Observable<Array<ConstraintRule>>;

  constructor() { }

  ngOnChanges() {
    this.cardType = (this.readonly) ? 'readonly' : 'card';
    if(!isNil(this.carouselList)){
      this.carouselList.forEach(i => i.ngAfterViewInit());
    }
    this.adjustCarouselSlide();
  }

  /** @ignore  */
  trackById(index, record) {
    return get(record, 'Id');
  }

  /** The function used to set number of slides for the carousel based on screen width */
  adjustCarouselSlide() {
    if(window.innerWidth < 576)
      this.slides = 1;
    else if(window.innerWidth < 768)
      this.slides = 2;
    else if (window.innerWidth < 992)
      this.slides = 3;
    else 
      this.slides = 4;
  }

}