import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AssetLineItem } from '@congacommerce/ecommerce';
import { AccordionRows } from './accordion-rows.interface';
/**
 * <strong>This component is a work in progress.</strong>
 * 
 * Asset list component is used to show a list of assets grouped by product.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/assetList.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { AssetListModule } from '@congacommerce/elements';

@NgModule({
  imports: [AssetListModule, ...]
})
export class AppModule {}
 ```
* @example
```typescript
* <apt-asset-list
*              [pageAssets]="pageItems"
*              [operation]="operation"
*              (onSelectedAmountClick)="handleSelectedAmountClick($event)"
*              (onFullListClick)="handleFullListClick()"
* ></apt-asset-list>
```
*/
@Component({
  selector: 'apt-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent {
  /**
   * Assets to actually display on the current page.
   */
  @Input() pageAssets: Array<AccordionRows>;
  /**
   * Array of the conditions that are being used on the installed products page.
   */
  @Input() totalAssets: string;
  /**
   * Event emitter for when to show selected assets only.
   */
  @Output() onSelectedAmountClick: EventEmitter<Array<AssetLineItem>> = new EventEmitter<[]>();
  /**
   * Event emitter for when to show all assets both selected and not selected.
   */
  @Output() onFullListClick: EventEmitter<void> = new EventEmitter<void>();
  /**
   * Value of the operation type.
   */
  @Input() operation: string;
  /**
   * Event handler for showing only the selected assets in the asset list.
   * @param event Array of asset line items that was fired on this event.
   * @ignore
   */
  handleSelectedAmountClick(event: Array<AssetLineItem>) {
    this.onSelectedAmountClick.emit(event);
  }
  /**
   * Event handler for showing the full list of assets both selected and not selected.
   * @ignore
   */
  handleFullListClick() {
    this.onFullListClick.emit();
  }

  /** @ignore */
  showAssetHeader(operation: any): boolean {
    return (operation !== 'Buy More' && operation !== 'Change Configuration');
  }
}
