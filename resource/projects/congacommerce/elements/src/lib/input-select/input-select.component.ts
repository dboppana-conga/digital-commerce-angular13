import { Component, Input, Output, EventEmitter } from '@angular/core';
/**
 * Input select component is used to create a single or multi select input. This input uses the angular ng-select third party component to create the picklists.
 *  <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/input-select.png" style="max-width: 100%">
 * <h3>Usage</h3>
 * <h3>Usage</h3>
 *
 ```typescript
import { InputSelectModule } from '@congacommerce/elements';

@NgModule({
  imports: [InputSelectModule, ...]
})
export class AppModule {}
 ```
* @example
 ```typescript
* <apt-input-select
*              [picklistType]="picklist"
*              [values]="picklistValues"
*              (onChange)="handleChange($event)"
* ></apt-input-select>
 ```
*/
@Component({
  selector: 'apt-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss']
})
export class InputSelectComponent {
  /**
   * The type of picklist to be rendered.
   */
  @Input() picklistType: 'multipicklist' | 'picklist' = 'picklist';
  /**
   * Event emitter for the change event of the picklist.
   */
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Array of picklist values to populate the picklist.
   */
  @Input() values: Array<any> = [];
  /**
   * The placeholder value for a select tag to be rendered.
   */
  @Input() placeholder: string = 'Select values';
  /**
   * Value of the picklist.
   * @ignore
   */
  modelValue: any;

}
