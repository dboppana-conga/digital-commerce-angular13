import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * The Input Quantity component is an input element with controls to increase/decrease the quantity of cart line items added to user's active cart.
 * @ignore
 * The comonent has an input text box where user can directly update the quantity of items to be added to the cart. It also has two control buttons to decrease/increase the added quantity. The quantity is always defaulted to value 1.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/input-qty.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { InputQuantityModule } from '@congacommerce/elements';

@NgModule({
  imports: [InputQuantityModule, ...]
})
export class AppModule {}
 ```
*
* @example
 ```typescript
* <apt-input-quantity
*              [(ngModel)]="myModel"
*              (ngModelChange)="handleChange($event)"
*              [disabled]="isDisabled"
*              [min]="minValue"
*              [max]="maxValue"
*              [default]="defaultValue"
* ></apt-input-quantity>
 ```
*/

@Component({
  selector: 'apt-input-quantity',
  templateUrl: './input-quantity.component.html',
  styleUrls: ['./input-quantity.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputQuantityComponent,
    multi: true
  }]
})
export class InputQuantityComponent implements ControlValueAccessor, OnInit, OnChanges {
  /**
   * A numberic value representing the quantity of line items to be added to user's active cart.
   */
  quantity: number = 1;
  /**
   * Event emitter for when the value changes.
   */
  @Output() change: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Flag to disable the input.
   */
  @Input() disabled: boolean = false;
  /**
   * The minimum value for this control.
   */
  @Input() min: number;
  /**
   * The maximum value for this control.
   */
  @Input() max: number;
  /**
   * The default value for this control.
   */
  @Input() default: number;

  constructor() { }

  /**
  * The quantity is always set to 1 or the minimum value specified for the line item.
  */
  ngOnInit() {
    this.quantity = (this.min) ? this.min : 1;
  }

  /**
   * Calls the writeValue method to update the quantity every time user changes the input controller. The quantity value ranges from 1 through 9999999.
   */
  ngOnChanges() {
    if (!this.min)
      this.min = 1;
    if (!this.max)
      this.max = 9999999;
    this.writeValue((this.default) ? this.default : this.min);
  }

  /**
   * @param value representing the quantity of items to be added to cart.
   * Updates the quantity every time user changes the input controller. The quantity value ranges from 1 through 9999999.
   */
  writeValue(value: number) {
    if (value < this.min)
      value = this.min;
    this.quantity = value;
    this.propagateChange(this.quantity);
  }
  propagateChange = (_: any) => { };
  registerOnChange(fn: (_: any) => {}): void {
    this.propagateChange = (evt) => {
      fn(evt);
      this.change.emit(evt);
    };
  }
  registerOnTouched(fn) { }

  /**
   * @param evt represnting the event associated with the user action.
   * Increases the quantity value by 1 when the increase button is clicked.
   * Propagates the event associated wit the user action in the event chain.
   */
  increase(evt) {
    this.quantity = (this.quantity < this.max) ? Number(this.quantity) + 1 : this.max;
    this.propagateChange(this.quantity);
    evt.stopPropagation();
  }

  /**
   * @param evt represnting the event associated with the user action.
   * Decreases the quantity value by 1 when the decrease button is clicked.
   * Propagates the event associated wit the user action in the event chain.
   */
  decrease(evt) {
    this.quantity = (this.quantity > this.min) ? Number(this.quantity) - 1 : this.min;
    this.propagateChange(this.quantity);
    evt.stopPropagation();
  }
}
