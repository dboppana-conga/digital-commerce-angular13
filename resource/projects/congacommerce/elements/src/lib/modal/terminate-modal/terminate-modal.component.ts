import { Component, OnInit } from '@angular/core';
import { AssetLineItem, AssetService } from '@congacommerce/ecommerce';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ExceptionService } from '../../../shared/services/exception.service';
import * as moment from 'moment';
import * as _ from 'lodash';
/**
 * The terminate modal is used to create a modal for terminating one or many assets.
 * To open a terminate modal the AssetModalService must be used.
 * @ignore
 * <h3>Preview</h3>
 * <img class="jumbotron" src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/terminateModal.png" style="max-width: 100%">
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

  openRenewModal() {
    this.assetModalService.openTerminateModal(lineItems[0], lineItems);
  }
}
 ```
 */
@Component({
  selector: 'apt-terminate-modal',
  templateUrl: './terminate-modal.component.html',
  styleUrls: ['./terminate-modal.component.scss']
})
export class TerminateModalComponent implements OnInit {
  
  /**
   * Hold end date for an asset intially set current date as end date of an asset.
   */
  endDate: Date = new Date();
  /**
   * Hold minimum date for an asset
   */
  minimumDate: Date;
  /**
   * Oldest end date value from among the existing assets for an account.
   */
  maximumDate: Date;
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
  /** 
   * Falg to determine selected terminate date is valid or not 
   */
  dateIsValid: boolean = false;
  /** @ignore */
  moment = moment;

  constructor(
    public bsModalRef: BsModalRef,
    private assetService: AssetService,
    private exceptionService: ExceptionService) {}

  ngOnInit() {
    if (this.moment(this._assetItem.StartDate).isBefore(this.moment())) {
      if (this.moment(this._assetItem.EndDate).isBefore(this.moment())) {        
        this.minimumDate = this.endDate;
        this.maximumDate = this.endDate;        
      }
      else {
        this.minimumDate = this.endDate;
        this.maximumDate = new Date(this.moment(this._assetItem.EndDate).format());
      }
    }
    else {
      this.endDate = new Date(this.moment(this._assetItem.StartDate).format());
      this.minimumDate = new Date(this.moment(this._assetItem.StartDate).format());
      this.maximumDate = new Date(this.moment(this._assetItem.StartDate).format());
    }
    console.log(this.endDate);
    console.log("MAX:", this.maximumDate, "min::", this.minimumDate);
  }
  /**
   * Fetches the earliest date that can be selected for canceling the group of selected assets.
   * @returns A date value representing the asset line item minimum termination date.
   */
  getMinimumDate(): Date {
    if (this.assetList) {
      let latestDate = new Date(this.moment(this.assetList[0].StartDate).format());
      _.each(this.assetList, asset => {
        if (new Date(this.moment(asset.StartDate).format()) > latestDate) latestDate = new Date(this.moment(asset.StartDate).format());
      });
      return this.moment(latestDate).toDate();
    }
    else return new Date();
  }
  /**
   * This method fetches the oldest end date from among the existing assets for a given account.
   * @returns a date value representing the asset line item maximum termination date.
   */
  getMaximumDate(): Date {
    if (this.assetList) {
      let earliestDate = new Date(this.moment(this.assetList[0].EndDate).format());
      _.each(this.assetList, asset => {
        if (new Date(this.moment(asset.EndDate).format()) < earliestDate) earliestDate = new Date(this.moment(asset.EndDate).format());
      });
      return this.moment(earliestDate).subtract(1, 'day').toDate();
    }
    else return new Date();
  }
  /**
   * This method terminates the existing assets for a given account.
   * @fires AssetService.cancelAssets().
   */
  terminate(){
    this.loading = true;
    this.assetService.cancelAssets(_.map(this.assetList, a => a.Id), this.endDate)
    .subscribe(
      res => {
        this.loading = false;
        this.bsModalRef.hide();
        this.exceptionService.showSuccess('ASSETS.TERMINATE_SUCCESS');
      },
      err => {
        this.loading = false;
        this.bsModalRef.hide();
        this.exceptionService.showError(err);
      }
    );
  }
 /**
  * Event handler for when the datepicker input changes.
  * @param event The event that was fired.
  * @ignore
  */
  handleDateChange(event: any) {
    this.dateIsValid = this.moment(event).isBetween(this.moment(this.minimumDate).subtract(1, 'day').toDate(), this.moment(this.maximumDate).add(1, 'day').toDate());
  }
}
