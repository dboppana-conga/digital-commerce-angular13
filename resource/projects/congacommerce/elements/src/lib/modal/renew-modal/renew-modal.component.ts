import { Component, OnChanges, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CartItemService } from '@congacommerce/ecommerce';
import { AssetLineItem, AssetService } from '@congacommerce/ecommerce';
import * as _ from 'lodash';
import { ExceptionService } from '../../../shared/services/exception.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
/**
 * The renew modal is used to create a modal for renewing one or many assets.
 * To open a renew modal the AssetModalService must be used.
 * @ignore
 * <h3>Preview</h3>
 * <img class="jumbotron" src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/renewModal.png" style="max-width: 100%">
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
    this.assetModalService.openRenewModal(lineItems[0], lineItems);
  }
}
 ```
 */
@Component({
  selector: 'apt-renew-modal',
  templateUrl: './renew-modal.component.html',
  styleUrls: ['./renew-modal.component.scss']
})
export class RenewModalComponent implements OnChanges, OnInit {

  /**
   * Latest end date value from among the existing assets for an account.
   */
  minimumDate: Date = new Date();
  /**
   * An arry of term option values.
   */
  termOptions: Array<TermOption> = new Array<TermOption>();
  /** 
   * Form to renew asset.
   */
  renewForm: RenewForm;
  /** 
   * _assetItem is an object of type assetLineItem
   */
  _assetItem: any;
  /**
   * List of existing assets for a given account.
   */
  assetList: Array<AssetLineItem>;
  /** 
   * Flag to show loader
   * @ignore
   */
  loading: boolean = false;

  /**  @ignore */
  moment = moment;

  /** To set renewal type
   * state = term will disable datepicker
   */
  state: 'term' | 'renewal' = 'renewal';

  constructor(
    public bsModalRef: BsModalRef,
    private cartItemService: CartItemService,
    private assetService: AssetService,
    private exceptionService: ExceptionService) {
  }

  ngOnInit() {
    this.minimumDate = this.getMinimumEndDate();
    this.termOptions = this.getTermOptions();
    this.renewForm = {
      endDate: this.minimumDate,
      term: this.termOptions[0]
    };
  }

  ngOnChanges() {
    this.minimumDate = this.getMinimumEndDate();
    this.termOptions = this.getTermOptions();
    this.renewForm = {
      endDate: this.minimumDate,
      term: this.termOptions[0]
    };
  }
  /**
   * This method fetches the most recent end date from among the existing assets for a given account.
   * @returns a date value representing the asset line item end date.
   */
  getMinimumEndDate(): Date{
    if(this.assetList){
      let latestDate = new Date(this.moment(this.assetList[0].EndDate).format()),
      latestAsset: AssetLineItem = Object.assign({}, this.assetList[0]),
      latestAssetTerm, latestAssetFrequency;
      this.assetList.forEach(asset => {
        if (new Date(this.moment(asset.EndDate).format()) > latestDate) {
          latestDate = new Date(this.moment(asset.EndDate).format());
          latestAsset = Object.assign({}, asset);
        }
        latestAssetTerm = (latestAsset) ? latestAsset.SellingTerm : asset.SellingTerm;
        latestAssetFrequency = (latestAsset) ? latestAsset.Frequency : asset.Frequency;
      });
      latestDate.setDate(latestDate.getDate() + 1);
      latestDate = this.cartItemService.getEndDate(latestDate, latestAssetTerm, latestAssetFrequency);
      return latestDate;
    }else
      return new Date();
  }

  /**
   * This method returns a list of unique term options for existing assets of a given account.
   * Each term option item contains the selling term of the asset line item and the term calculated based on its selling term and selling frequency.
   * @fires CartItemService.getReadableTerm()
   */
  getTermOptions(): Array<TermOption>{
    const options = _.uniq(this.assetList.map(asset => {
      return {
          label : this.cartItemService.getReadableTerm(asset.SellingTerm, asset.SellingFrequency),
          value : asset.SellingTerm
        };
      })).filter(y => y != null);
    if(_.get(options, 'length', 0) === 0)
      options.push(1);
    return options;
  }
  /**
   * This method renews the existing assets for a given account.
   * @fires AssetService.renewAssets().
   */
  renew() {
    this.loading = true;
    let obsv$;
    if (this.state === 'renewal') {
      obsv$ = this.assetService.renewAssets(this.assetList.map(asset => asset.Id), new Date(this.renewForm.endDate), null, false);
      obsv$.pipe(take(1))
        .subscribe(
          res => {
            this.successCallback();
          },
          err => {
            this.errorCallback(err);
          }
        );
    }
    else if (this.state === 'term') {
      this.assetService.renewAssets(_.map(this.assetList, a => a.Id), null, null, false)
        .pipe(take(1))
        .subscribe(
          res => this.successCallback(),
          err => this.errorCallback(err)
        );
    }
  }
 /**
   * This method returns success as a response upon successful renew of the existing assets for a given account.
   * @fires  ExceptionService.showSuccess().
   */
  successCallback() {
    this.loading = false;
    this.bsModalRef.hide();
    this.exceptionService.showSuccess('ASSETS.RENEW_SUCCESS');
  }
   /**
   * This method returns error as a response when renewing the existing assets for a given account fails.
   * @fires  ExceptionService.showError().
   */
  errorCallback(objErr) {
    this.loading = false;
    this.bsModalRef.hide();
    this.exceptionService.showError(objErr);
  }
}

/** @ignore */
interface TermOption{
  label: string;
  value: number;
}

/** @ignore */
interface RenewForm{
  endDate: Date;
  term: TermOption;
}
