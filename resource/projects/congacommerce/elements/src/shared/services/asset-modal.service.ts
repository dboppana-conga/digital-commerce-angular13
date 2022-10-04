import { Injectable } from '@angular/core';
import { BsModalService} from 'ngx-bootstrap/modal';
import { AssetLineItem } from '@congacommerce/ecommerce';
import { BuyMoreModalComponent } from '../../lib/modal/buy-more-modal/buy-more-modal.component';
import { ChangeConfigurationModalComponent } from '../../lib/modal/change-configuration-modal/change-configuration-modal.component';
import { TerminateModalComponent } from '../../lib/modal/terminate-modal/terminate-modal.component';
import { RenewModalComponent } from '../../lib/modal/renew-modal/renew-modal.component';
/**
 * Asset modal service is used to open asset modals.
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
export class AssetModalService {

  constructor(private modalService: BsModalService) {}
  /**
   * Opens the renew asset modal.
   * @param assetItem The first asset in the list
   * @param assetList The list of asset items.
   */
  public openRenewModal(assetItem: AssetLineItem, assetList: Array<AssetLineItem>) {
    this.modalService.show(RenewModalComponent, {initialState: { _assetItem: assetItem, assetList: assetList }});
  }
  /**
   * Opens the terminate asset modal.
   * @param assetItem The first asset in the list.
   * @param assetList The list of asset items.
   */
  public openTerminateModal(assetItem: AssetLineItem, assetList: Array<AssetLineItem>) {
    this.modalService.show(TerminateModalComponent, {initialState: { _assetItem: assetItem, assetList: assetList }});
  }
  /**
   * Opens the Buy more asset modal.
   * @param assetItem The first asset in the list.
   * @param assetList The list of asset items.
   */
  public openBuyMoreModal(assetItem: AssetLineItem, assetList: Array<AssetLineItem>) {
    this.modalService.show(BuyMoreModalComponent, {initialState: { _assetItem: assetItem, assetList: assetList }});
  }

  /**
   * Opens the Change Configuration asset modal.
   * @param assetItem The first asset in the list.
   * @param assetList The list of asset items.
   */
  public openChangeConfigurationModal(assetItem: AssetLineItem, assetList: Array<AssetLineItem>) {
    this.modalService.show(ChangeConfigurationModalComponent, {initialState: { _assetItem: assetItem, assetList: assetList }});
  }
}
