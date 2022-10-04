import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService, StorefrontService } from '@congacommerce/ecommerce';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

/**
 * <strong>This component is a work in progress.</strong>
 * 
 * The asset dropdown button is used to create a split dropdown button with all of the enabled ABO actions on the storefront record.
 * By default the first action in the list of enabled actions is set as the primary action on the button, however, users can set the desired primary action with the 'primaryAction' input.
 * An onClick event is emitted when a user clicks on the main button or one in the dropdown.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/assetDropdownButton.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
```typescript
import { ButtonModule } from '@congacommerce/elements';

@NgModule({
  imports: [ButtonModule, ...]
})
export class AppModule {}
```
* @example
```typescript
* <apt-asset-dropdown-button
*              [buttonType]="'btn-outline-primary'"
*              [setDisabled]="isDisabled"
*              [setTooltipText]="'Asset selection disabled.'"
*              (onClick)="handleAssetDropdownClick($event)"
* ></apt-asset-dropdown-button>
```
*/
@Component({
  selector: 'apt-asset-dropdown-button',
  templateUrl: './asset-dropdown-button.component.html',
  styleUrls: ['./asset-dropdown-button.component.scss']
})
export class AssetDropdownButtonComponent implements OnInit {
  /**
   * Value of the operation type.
   */
  @Input() operation: string;
  /**
   * value of asset price type
   */
  @Input() priceType: string;
  /**
   * value of asset configuration type
   */
  @Input() configurationType:  string;
  /**
   * Override for what the primary action of this button is. This will set what is on the face of the button.
   */
  @Input() primaryAction: string;
  /**
   * Flag to check if this button should be set to disabled.
   */
  @Input() setDisabled: boolean = false;
  /**
   * The text to show on the tooltip when this button is disabled.
   */
  @Input() setTooltipText: string;
  /**
   * Bootstrap class name for the button type.
   */
  @Input() buttonType: string = 'btn-primary';
  /**
   * Event emitter for when an action is clicked.
   */
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  /**
    * Does this product has attributes
   */
  @Input() hasAttributes: boolean;

  view$: Observable<AssetDropdownView>;

  constructor(
    private userService: UserService,
    private storefrontService: StorefrontService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.view$ = combineLatest(
      this.userService.isLoggedIn(),
      this.storefrontService.getStorefront(),
      this.translateService.stream('BUTTON.LOGIN_MUST_TOOLTIP')
    )
    .pipe(
      map(([isLoggedIn, storefront, buttonTooltip]) => {
        let enabledActions;
        // Check if pricetype is available before populating value for dropdown.
        if (this.priceType) enabledActions = (_.get(storefront, 'AssetActions')) ? _.get(storefront, 'AssetActions').split(';') : [];
        // Check if configurationType is Bundle and dropdown has 'Buy More' then remove buymore action from dropdown
        if (this.configurationType === 'Bundle' && !this.operation && enabledActions.filter(action => action === 'Buy More').length > 0) enabledActions = enabledActions.filter(action => action !== 'Buy More');
        // check if operation is 'Buy More' or dropdown has 'Buy More' and price type as one time, then enable only 'Buy More' action.
        if ((this.operation === 'Buy More') || (enabledActions.filter(action => action === 'Buy More').length > 0 && this.priceType === 'One Time')) enabledActions = enabledActions.filter(action => action === 'Buy More');
        // check if operation is 'Change Configuration' or dropdown has 'Change Configuration' and price type as one time, then enable only 'Change Configuration' action.
        if ((this.operation === 'Change Configuration') || (enabledActions.filter(action => action === 'Change Configuration').length > 0 && this.priceType === 'One Time')) enabledActions = enabledActions.filter(action => action === 'Change Configuration');

        // Do not show Change Configuration action for standalone product which does not have any attributes
        if (this.configurationType === 'Standalone' && !this.hasAttributes && !this.operation && enabledActions.filter(action => action === 'Change Configuration').length > 0) enabledActions = enabledActions.filter(action => action !== 'Change Configuration');

        if (this.primaryAction && enabledActions.includes(this.primaryAction)) {
          let action = enabledActions.splice(enabledActions.indexOf(this.primaryAction), 1);
          enabledActions.unshift(action[0]);
        }

        return {
          isLoggedIn: isLoggedIn,
          enabledActions: enabledActions,
          buttonTooltip: buttonTooltip
        } as AssetDropdownView;
      })
    );
  }

}

/** @ignore */
export interface AssetDropdownView {
  isLoggedIn: boolean;
  enabledActions: Array<string>;
  buttonTooltip: string;
}
