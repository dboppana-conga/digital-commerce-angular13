import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AssetLineItem, AssetService, IncrementAssetDO, IncrementLineAction } from '@congacommerce/ecommerce';
import { CartItemService } from '@congacommerce/ecommerce';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ExceptionService } from '../../../shared/services/exception.service';
import * as moment from 'moment';
import * as  _ from 'lodash';
/**
 * The buy more modal is used to create a modal for buying more of one or many assets.
 * To open a buy more modal the AssetModalService must be used.
 * @ignore
 * <h3>Preview</h3>
 * <img class="jumbotron" src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/buyMoreModal.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { AssetModalService } from '@congacommerce/elements';

@Component({
  ...
})
export class AppComponent {

  private lineItems: Array<AssetLineItem>;

  constructor(private assetModalService: AssetModalService) {}

  openBuyMoreModal() {
    this.assetModalService.openBuyMoreModal(lineItems[0], lineItems);
  }
}
 ```
 */
@Component({
  selector: 'apt-buy-more-modal',
  templateUrl: './buy-more-modal.component.html',
  styleUrls: ['./buy-more-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuyMoreModalComponent implements OnInit {
  /** 
   * Flag to show loader
   * @ignore
   */
  loading: boolean = false;
  /** 
   * _assetItem is an object of type assetLineItem
   */
  _assetItem: any;
  /**
 * List of existing assets for a given account.
 */
  assetList: Array<AssetLineItem>;
  moment = moment;
  buyMoreForm: BuyMoreForm;
  /**
 * start date and end date is set to default to current date.
 */
  minimumStartDate: Date = new Date();
  minimumEndDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private assetService: AssetService,
    private exceptionService: ExceptionService,
    private cartItemService: CartItemService) { }

  ngOnInit() {
    this.minimumStartDate = new Date();
    this.minimumEndDate = this.getMinimumEndDate();
    this.buyMoreForm = {
      quantity: 1,
      startDate: this.minimumStartDate,
      endDate: this.minimumEndDate
    };
  }

  /**
  * This method calculates the end date based on the term and sets the minimum end date.
  * @param startDate a date value representing the asset line item start date
  * @returns a date value representing the asset line item end date.
  */
  getMinimumEndDate(startDate: Date = new Date()): Date {
    const assetList = _.first(this.assetList);
    const endDate = this.cartItemService.getEndDate(startDate, _.get(assetList, 'SellingTerm'), _.get(assetList, 'SellingFrequency') as unknown as any);
    if (!_.isNil(endDate) && endDate > new Date())
      return endDate;
    else
      return this.moment(startDate).add(1, 'y').toDate();
  }
  /**
   * Method calculates the minimum enddate based on start date selected.
   * @param event selected start date
   */
  startDateChange(event: Date) {
    this.minimumEndDate = this.getMinimumEndDate(event);
    this.buyMoreForm.endDate = this.minimumEndDate;
  }
  /**
   * This method buy more assets for a given account.
   * @fires AssetService.incrementAssets().
   */
  buyMore() {
    if (this.buyMoreForm.quantity <= 0) {
      this.exceptionService.showError('INVALID_QUANTITY');
      this.buyMoreForm.quantity = 1;
      return;
    }
    this.loading = true;
    const incrementAssetDoObj: IncrementAssetDO = {
      AssetId: this._assetItem.Id,
      NewStartDate: this._assetItem.PriceType !== 'One Time' ? this.moment(this.buyMoreForm.startDate).format('YYYY-MM-DD') : null,
      NewEndDate: this._assetItem.PriceType !== 'One Time' ? this.moment(this.buyMoreForm.endDate).format('YYYY-MM-DD') : null,
      Quantity: (this._assetItem.Quantity + this.buyMoreForm.quantity),
      LineAction: IncrementLineAction.INCREMENT
    };
    this.assetService.incrementAssets([incrementAssetDoObj])
      .subscribe(
        res => {
          this.loading = false;
          this.bsModalRef.hide();
          this.exceptionService.showSuccess('ASSETS.BUYMORE_SUCCESS');
        },
        err => {
          this.loading = false;
          this.bsModalRef.hide();
          this.exceptionService.showError(err);
        }
      );
  }

}

/** @ignore */
export interface BuyMoreForm {
  quantity: number;
  startDate: Date;
  endDate: Date;
}