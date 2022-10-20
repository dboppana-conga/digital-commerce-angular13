
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CartService, BatchAction, StorefrontService, Cart, UserService } from '@congacommerce/ecommerce';
import { AssetSelectionService } from './asset-selection.service';
import { BatchActionService } from './batch-action.service';
import { BatchSelectionService } from './batch-selection.service';
import { ConfigurationService } from '@congacommerce/core';
import { Router } from '@angular/router';
import { AssetLineItem } from '@congacommerce/ecommerce';
import { Observable, combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
/**
 * The asset batch action service is used to provide a filtered set of batch actions specific to assets.
 * This service contains methods for checking if given actions are disabled along with tooltip messages for disabled actions.
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
export class AssetBatchActionService extends BatchActionService {

  constructor(
    private assetSelectionService: AssetSelectionService,
    protected config: ConfigurationService,
    protected BatchSelectionService: BatchSelectionService,
    protected router: Router,
    protected cartService: CartService,
    protected storefrontService: StorefrontService,
    protected translateService: TranslateService,
    protected userService: UserService
  ) {
    super(config, BatchSelectionService, router, cartService, storefrontService, translateService, userService);
    this.subs.push(
      combineLatest(
        this.assetSelectionService.getSelectedAssets(),
        this.cartService.getMyCart()
      )
      .subscribe(([assets, cart]) => {
        this.filterAssetBatchActions(assets, cart);
    }));
  }
  /**
   * Filters the asset batch actions based on the currently selected assets.
   * @param assets The array of selected assets used to filter batch actions.
   * @ignore
   */
  private filterAssetBatchActions(assets: Array<AssetLineItem>, cart: Cart) {
    this.actionMap['Renew'].setDisabled(false);
    this.actionMap['Terminate'].setDisabled(false);
    if (assets.length > 0) {
      assets.forEach(asset => {
        if (asset.PriceType === 'One Time' || asset.AssetStatus !== 'Activated') {
          this.actionMap['Renew'].setDisabled(true);
          this.translateService.stream('SERVICES.UNABLE_TO_RENEW_TOOLTIP').subscribe((val: string) => {
            this.actionMap['Renew'].setTooltipText(val);
          });
          this.actionMap['Terminate'].setDisabled(true);
          this.translateService.stream('SERVICES.UNABLE_TO_TERMINATE_TOOLTIP').subscribe((val: string) => {
            this.actionMap['Terminate'].setTooltipText(val);
          });
        }
        _.forEach(_.get(cart, 'LineItems'), lineItem => {
          if (lineItem.AssetLineItem.Id === asset.Id) {
            this.actionMap['Renew'].setDisabled(true);
            this.actionMap['Terminate'].setDisabled(true);
            this.translateService.stream('SERVICES.ITEMS_ARE_ALREADY_ADDED_TO_CART_TOOLTIP').subscribe((val: string) => {
              this.actionMap['Renew'].setTooltipText(val);
              this.actionMap['Terminate'].setTooltipText(val);
            });
          }
        });
      });
    }
    else {
      this.actionMap['Renew'].setDisabled(true);
      this.actionMap['Terminate'].setDisabled(true);
      this.translateService.stream('SERVICES.SELECTION_OF_ASSETS_MUST_TOOLTIP').subscribe((val: string) => {
        this.actionMap['Renew'].setTooltipText(val);
        this.actionMap['Terminate'].setTooltipText(val);
      });
    }

    const currentActions = [
      this.actionMap['Renew'],
      this.actionMap['Terminate']
    ];

    this._assetBatchActions.next(currentActions);
  }
  /**
   * Gets the current asset batch actions observable.
   * @returns Observable array of batch action objects.
   */
  public getAssetBatchActions(): Observable<Array<BatchAction>> {
    return this._assetBatchActions;
  }
  /**
   * Checks if a batch action is disabled based on the given action key.
   * @param action String key of the represented action.
   */
  public isActionDisabled(action: string): boolean {
    return this.actionMap[action].isDisabled();
  }
  /**
   * Gets the tooltip text for a given action.
   * @param action String key of the represented action.
   */
  public getTooltipForAction(action: string): string {
    return this.actionMap[action].getTooltipText();
  }

}
