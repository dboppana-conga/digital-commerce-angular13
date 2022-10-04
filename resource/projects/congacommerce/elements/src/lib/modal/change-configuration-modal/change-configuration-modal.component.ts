
import {take, filter} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AssetLineItem, AssetService } from '@congacommerce/ecommerce';
import { CartItemService, CartService } from '@congacommerce/ecommerce';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ExceptionService } from '../../../shared/services/exception.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as  _ from 'lodash';
import { ConfigurationService } from '@congacommerce/core';

/**
 * The change configuration modal is used to create a modal for terminating one or many assets.
 * To open a terminate modal the AssetModalService must be used.
 * @ignore
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

  openChangeConfigModal() {
    this.assetModalService.openChangeConfigurationModal(lineItems[0], lineItems);
  }
}
 ```
 */
@Component({
  selector: 'apt-change-configuration-modal',
  templateUrl: './change-configuration-modal.component.html',
  styleUrls: ['./change-configuration-modal.component.scss']
})
export class ChangeConfigurationModalComponent implements OnInit {
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
   * Form for change configuration
   */
  changeConfigurationform: ChangeConfigurationForm;
  /**
 * List of existing assets for a given account.
 */
  assetList: Array<AssetLineItem>;
  /** @ignore  */
  moment = moment;
  /**
 * start date and end date is set to default to current date.
 */
  minimumStartDate: Date = new Date();
  minimumEndDate: Date = new Date();

  /**@ignore */
  constructor(
    public bsModalRef: BsModalRef,
    private assetService: AssetService,
    private exceptionService: ExceptionService,
    private cartItemService: CartItemService,
    private configurationService: ConfigurationService,
    private router: Router,
    private cartService: CartService) { }

  /**@ignore */
  ngOnInit() {
    this.minimumStartDate = new Date();
    this.minimumEndDate = this.getMinimumEndDate();
    this.changeConfigurationform = {
      startDate: this.minimumStartDate,
      endDate: this.minimumEndDate
    };
  }

  /**
  * This method calculates the end date based on the term and sets the minimum end date.
  *  @param startDate a date value representing the asset line item start date
  *  @returns a date value representing the asset line item end date.
  */
  getMinimumEndDate(startDate: Date = new Date()): Date {
    if (this.assetList) {
      let latestDate = this.moment(_.get(this.assetList[0], 'EndDate',
          this.cartItemService.getEndDate(startDate, this.assetList[0].Term, _.get(this.assetList[0], 'PriceListItem.Frequency'))
      )).toDate();
      return latestDate;
    } else {
      return new Date();
    }
  }
  /**
   * Method calculates the minimum enddate based on start date selected.
   * @param event selected start date
   */
  startDateChange(event: Date) {
    this.minimumEndDate = this.getMinimumEndDate(event);
    this.changeConfigurationform.endDate = this.minimumEndDate;
  }
  /**
   * This method amend current configuration of given assets for a given account.
   * @fires AssetService.amendAssets(listOfAssetsIDToAmend).
   */
  changeConfiguration() {
    this.loading = true;
    this.assetService.amendAssets([this._assetItem.Id])
      .subscribe(
        res => {
           this.cartService.getMyCart().pipe(
              filter(cart => _.some(cart.LineItems, (item => _.get(item, 'LineStatus') === 'Amended' && item.AssetLineItemId === this._assetItem.Id))),
              take(1)
            )
            .subscribe(cart =>{
              this.loading = false;
              this.bsModalRef.hide();
              this.exceptionService.showSuccess('ASSETS.CHANGECONFIGURATION_SUCCESS');
              const amendItem = _.find(cart.LineItems, (item => _.get(item, 'LineStatus') === 'Amended' && item.AssetLineItemId === this._assetItem.Id));
              this.router.navigate(['/products', _.get(this, '_assetItem.ProductId'), amendItem.Id]);
            });
        },
        err => {
          this.loading = false;
          this.bsModalRef.hide();
          this.exceptionService.showError(err);
        }
      );
  }

}

/**
 * Interface to pass dates to and other information to different component/modal.
 * @ignore
 */
interface ChangeConfigurationForm {
  startDate: Date;
  endDate: Date;
}
