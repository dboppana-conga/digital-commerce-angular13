
import {take} from 'rxjs/operators';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AssetSelectionService } from '../../../shared/services/asset-selection.service';
import { AssetBatchActionService } from '../../../shared/services/asset-batch-action-service';
import { AssetLineItem } from '@congacommerce/ecommerce';
import { Observable, Subscription } from 'rxjs';
import { StorefrontService } from '@congacommerce/ecommerce';
import { AssetModalService } from '../../../shared/services/asset-modal.service';
import * as _ from 'lodash';
/**
 * Asset list header is used to create the header for the asset list component that holds the batch action buttons.
 * @ignore
 */
@Component({
  selector: 'apt-asset-list-header',
  templateUrl: './asset-list-header.component.html',
  styleUrls: ['./asset-list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AssetListHeaderComponent implements OnInit, OnDestroy {
  /**
   * Value of the operation type.
   */
  @Input() operation: string;
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
   * Observable array of all currently selected assets.
   */
  selectedAssets$: Observable<Array<AssetLineItem>>;
  /**
   * Array of batch action keys that are enabled.
   */
  enabledActions: Array<string> = [];
  /**
   * A subscription to the storefront.
   */
  storefrontSubscription: Subscription;
  /**
   * Observable array of all the assets pertaining to the current search filters.
   */
  // totalAssets$: string;

  constructor(
    public assetBatchActionService: AssetBatchActionService,
    private assetSelectionService: AssetSelectionService,
    private storefrontService: StorefrontService,
    private assetModalService: AssetModalService) {}

  ngOnInit() {
    this.selectedAssets$ = this.assetSelectionService.getSelectedAssets();
    this.storefrontSubscription = this.storefrontService.getStorefront().subscribe(storefront => {
      this.enabledActions = (_.get(storefront, 'AssetActions')) ? _.get(storefront, 'AssetActions').split(';') : [];
    });
  }

  /**
   * Event handler for showing only the selected assets in the asset list.
   * @param event Array of asset line items that was fired on this event.
   */
  handleSelectedAmountClick(event: any) {
    event.preventDefault();
    this.selectedAssets$.pipe(take(1)).subscribe(assets => {
      this.onSelectedAmountClick.emit(assets);
    });
  }
  /**
   * Event handler for showing the full list of assets both selected and not selected.
   */
  handleFullListClick(event: any) {
    event.preventDefault();
    this.onFullListClick.emit();
  }
  /**
   * Event handler for when a batch action button is clicked.
   * @param action The action event that was fired.
   */
  handleBatchButtonClick(action: string) {
    let selectedAssets;
    this.selectedAssets$.pipe(take(1)).subscribe(assets => selectedAssets = assets);
    switch(action) {
      case 'Renew':
        this.assetModalService.openRenewModal(selectedAssets[0], selectedAssets);
      break;
      case 'Terminate':
        this.assetModalService.openTerminateModal(selectedAssets[0], selectedAssets);
      break;
    }
  }

  ngOnDestroy() {
    this.assetSelectionService.clearSelection();
    this.storefrontSubscription.unsubscribe();
  }

  /** @ignore */
  notAMassAction(action: string): boolean {
    return (action.toLowerCase() !== 'buy more' && action.toLowerCase() !== 'change configuration');
  }
}
