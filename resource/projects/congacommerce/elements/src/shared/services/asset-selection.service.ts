import { Injectable } from '@angular/core';
import { AssetLineItemExtended } from '@congacommerce/ecommerce';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

/**
 * Asset selection service keeps track of which assets in the application have been selected for batch actions.
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
export class AssetSelectionService {
  /**
   * List of currently selected assets.
   */
  private assets: Array<AssetLineItemExtended> = [];
  /**
   * List of assets to be subscribed to.
   */
  private _assets: BehaviorSubject<Array<AssetLineItemExtended>> = new BehaviorSubject<Array<AssetLineItemExtended>>([]);
  /**
   * Adds a new asset to the list of selected assets.
   * @param asset Asset to be added to the selection.
   */
  public addAssetToSelection(asset: AssetLineItemExtended) {
    if (!this.assets.includes(asset)) {
      this.assets.unshift(asset);
      this._assets.next(this.assets);
    }
  }
  /**
   * Removes assets from the list of selected assets.
   * @param asset Asset to be removed from the selection.
   */
  public removeAssetFromSelection(asset: AssetLineItemExtended) {
    _.remove(this.assets, a => a.Id === asset.Id);
    this._assets.next(this.assets);
  }
  /**
   * Sets the currently selected assets to the given array of assets.
   * @param assets Array of assets to set as the current selection.
   */
  public setSelectedAssets(assets: Array<AssetLineItemExtended>) {
    this.assets = assets;
    this._assets.next(this.assets);
  }
  /**
   * Gets the list of currently selected assets.
   */
  public getSelectedAssets(): Observable<Array<AssetLineItemExtended>> {
    return this._assets;
  }
  /**
   * Checks if the given asset is part of the selected asset list.
   * @param asset Asset to check against the list of selected assets.
   */
  public isAssetSelected(asset: AssetLineItemExtended): boolean {
    return !!_.find(this.assets, {Id: asset.Id});
  }
  /**
   * Clears the array of currently selected assets and notifies all observers.
   */
  public clearSelection() {
    this.assets = [];
    this._assets.next(this.assets);
  }

}
