import { Component, Input, EventEmitter, Output, OnChanges, ChangeDetectionStrategy, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { get, isNil } from 'lodash';
import * as momentImported from 'moment';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { CartItemService, CartItem } from '@congacommerce/ecommerce';

/**
 * The date range component includes two date input fields one for start date and one for end date. The input fields use the ngx-bootstrap date picker component.
 *
 * By default the date range component will calculate the begining and ending date for the cart item that is passed to it based on the frequency and term of the product.
 * When the user selects a date in the start date or end date inputs the onStartDateChange and onEndDateChange methods will be fired respectively.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/inputDate.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { InputDateModule } from '@congacommerce/elements';

@NgModule({
  imports: [InputDateModule, ...]
})
export class AppModule {}
 ```
*
* @example
* // Basic Usage.
 ```typescript
* <apt-date-range-input
*             [cartItem]="item"
*             (onStartDateChange)="handleStartChange($event, item)"
*             (onEndDateChange)="handleEndDateChange($event, item)"
* ></apt-date-range-input>
 ```
*
* // Implementation with custom options.
 ```typescript
* <apt-date-range-input
*             (onStartDateChange)="handleStartChange($event, item)"
*             (onEndDateChange)="handleEndDateChange($event, item)"
*             [cartItem]="item"
*             [disableStartDate]="disableStartDate"
*             [disableEndDate]="disableEndDate"
*             [readonly]="false"
* ></apt-date-range-input>
 ```
*/
@Component({
  selector: 'apt-date-range-input',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * The cart item associated with the date range picker.
   */
  @Input() cartItem: CartItem;
  /**
   * Event emitter that fires when start date input is changed.
   */
  @Output() onStartDateChange: EventEmitter<any> = new EventEmitter();
  /**
   * Event emitter that fires when the end date input is changed.
   */
  @Output() onEndDateChange: EventEmitter<any> = new EventEmitter();
  /**
   * Flag to disable the start date input.
   */
  @Input() disableStartDate: boolean = false;
  /**
   * Flag to disable the end date input.
   */
  @Input() disableEndDate: boolean = false;
  /**
   * Flag to check if this component should be read only.
   */
  @Input() readonly: boolean = false;
  /**
   * Flag to apply small class on input field.
   */
  @Input() small: boolean = false;
  /**
  * Flag to display a particular date.
  */
  @Input() displayDate: 'StartDate' | 'EndDate' | 'Both';

  /** @ignore */
  startDate: Date = new Date();
  /** @ignore */
  endDate: Date = new Date();
  /** @ignore */
  bsConfig: Partial<BsDatepickerConfig>;
  /** @ignore */
  moment = momentImported;
  /** @ignore */
  today: Date = new Date();
  /**
   * @ignore
   */
  subscription: Subscription;

  constructor(private cartItemService: CartItemService, private sanitizer: DomSanitizer) {
    this.bsConfig = Object.assign({}, {
      showWeekNumbers: false,
      dateInputFormat: 'MM/DD/YYYY'
    });
  }

  ngOnInit() { }

  ngOnChanges() {
    const today = new Date().toISOString().split('T')[0],
      sellingTerm = get(this.cartItem, 'PriceListItem.DefaultSellingTerm', 1) || 1,
      frequency = get(this.cartItem, 'PricingFrequency'),
      cartItemStartDate = get(this.cartItem, 'StartDate'),
      cartItemEndDate = get(this.cartItem, 'EndDate'),
      startDate = this.moment(cartItemStartDate || today, 'YYYY-MM-DD').toDate(),
      endDate = this.cartItemService.getEndDate(startDate, sellingTerm, frequency);

    this.startDate = startDate;
    this.endDate = this.moment(cartItemEndDate || endDate).toDate();

    // Assign values to cart
    this.cartItem.StartDate = this.moment(this.startDate).format('YYYY-MM-DD');
    this.cartItem.EndDate = this.moment(this.endDate).format('YYYY-MM-DD');
  }

  /**
   * Called when user changes the start date input.
   * @param event The date object from the start date input.
   * @ignore
   */
  startDateChange(event: Date) {
    const sanitizedDate = this.sanitizer.sanitize(SecurityContext.NONE, event);
    const startDate = this.moment(sanitizedDate).format('YYYY-MM-DD');

    if (get(this, 'cartItem.StartDate') !== startDate) {
      this.cartItem.StartDate = startDate;
      this.endDate = this.moment(
        this.cartItemService.getEndDate(get(this.cartItem, 'StartDate') as unknown as Date, get(this.cartItem, 'PriceListItem.DefaultSellingTerm', 1), get(this.cartItem, 'PricingFrequency')).getTime()
      ).toDate();
      this.cartItem.EndDate = this.moment(this.endDate).format('YYYY-MM-DD');
      this.cartItem.SellingTerm = this.cartItemService.getTerm(this.moment(get(this.cartItem, 'StartDate'), 'YYYY-MM-DD'), this.moment(get(this.cartItem, 'EndDate'), 'YYYY-MM-DD'), get(this.cartItem, 'PricingFrequency'));
      this.onStartDateChange.emit();
    }
  }
  /**
   * Called when user changes the end date input.
   * @param event The date object from the end date input.
   * @ignore
   */
  endDateChange(event: Date) {
    const sanitizedDate = this.sanitizer.sanitize(SecurityContext.NONE, event);
    const endDate = this.moment(sanitizedDate).format('YYYY-MM-DD');
    if (get(this, 'cartItem.EndDate') !== endDate) {
      this.cartItem.EndDate = endDate;
      this.cartItem.SellingTerm = this.cartItemService.getTerm(this.moment(get(this.cartItem, 'StartDate'), 'YYYY-MM-DD'), this.moment(get(this.cartItem, 'EndDate'), 'YYYY-MM-DD'), get(this.cartItem, 'PricingFrequency'));
      this.onEndDateChange.emit();
    }
  }
  /** @ignore */
  isValidDate(date: any): boolean {
    return !(isNil(date) || date === 'Invalid date');
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
