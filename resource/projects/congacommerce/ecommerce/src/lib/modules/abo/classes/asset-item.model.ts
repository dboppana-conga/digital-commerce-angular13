import { Expose, Type } from 'class-transformer';
import * as moment from 'moment';
import { get, filter } from 'lodash';
import { AObject, ATable, AField } from '@congacommerce/core';
import { AssetAttributeValue } from './asset-attribute-value.model';
import { Product } from '../../catalog/classes/product.model';
import { PriceListItem } from '../../pricing/classes/price-list-item.model';

/** @ignore */
const _moment = moment;
/**
 * @ignore
 */
@ATable({
    sobjectName: 'AssetLineItem'
})
export class AssetLineItem extends AObject {

    @Expose({ name: 'AdjustedPrice' })
    AdjustedPrice: number = null;

    @Expose({ name: 'AllowedActions' })
    AllowedActions: string = null;

    @Expose({ name: 'AssetARR' })
    AssetARR: number = null;

    @Expose({ name: 'AssetCode' })
    AssetCode: string = null;

    @Expose({ name: 'AssetMRR' })
    AssetMRR: number = null;

    @Expose({ name: 'AssetNumber' })
    AssetNumber: string = null;

    @Expose({ name: 'AssetStatus' })
    AssetStatus: string = null;

    @Expose({ name: 'AutoRenew' })
    AutoRenew: boolean = null;

    @Expose({ name: 'AutoRenewalType' })
    AutoRenewalType: string = null;

    @Expose({ name: 'AvailableBalance' })
    AvailableBalance: number = null;

    @Expose({ name: 'BaseCost' })
    BaseCost: number = null;

    @Expose({ name: 'BaseExtendedCost' })
    BaseExtendedCost: number = null;

    @Expose({ name: 'BaseExtendedPrice' })
    BaseExtendedPrice: number = null;

    @Expose({ name: 'BasePrice' })
    BasePrice: number = null;

    @Expose({ name: 'BasePriceMethod' })
    BasePriceMethod: string = null;

    @Expose({ name: 'BillingEndDate' })
    BillingEndDate: Date = null;

    @Expose({ name: 'BillingFrequency' })
    BillingFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' = null;

    @Expose({ name: 'BillingStartDate' })
    BillingStartDate: Date = null;

    @Expose({ name: 'BillThroughDate' })
    BillThroughDate: Date = null;

    @Expose({ name: 'BillToAccountId' })
    BillToAccountId: string = null;

    @Expose({ name: 'BundleAssetId' })
    BundleAssetId: string = null;

    @Expose({ name: 'BusinessLineItemId' })
    BusinessLineItemId: string = null;

    @Expose({ name: 'BusinessObjectId' })
    BusinessObjectId: string = null;

    @Expose({ name: 'BusinessObjectType' })
    BusinessObjectType: 'Order' | 'Proposal' | 'Agreement' = null;

    @Expose({ name: 'CancelledDate' })
    CancelledDate: Date = null;

    @Expose({ name: 'ChargeType' })
    ChargeType: string = null;

    @Expose({ name: 'Comments' })
    Comments: string = null;

    @Expose({ name: 'DeltaPrice' })
    DeltaPrice: number = null;

    @Expose({ name: 'DeltaQuantity' })
    DeltaQuantity: number = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'EndDate' })
    EndDate: Date = null;

    @Expose({ name: 'ExtendedCost' })
    ExtendedCost: number = null;

    @Expose({ name: 'ExtendedDescription' })
    ExtendedDescription: string = null;

    @Expose({ name: 'ExtendedPrice' })
    ExtendedPrice: number = null;

    @Expose({ name: 'HasAttributes' })
    HasAttributes: boolean = null;

    @Expose({ name: 'HasOptions' })
    HasOptions: boolean = null;

    @Expose({ name: 'HideInvoiceDisplay' })
    HideInvoiceDisplay: boolean = null;

    @Expose({ name: 'IsInactive' })
    IsInactive: boolean = null;

    @Expose({ name: 'InitialActivationDate' })
    InitialActivationDate: Date = null;

    @Expose({ name: 'IsOptionRollupLine' })
    IsOptionRollupLine: boolean = null;

    @Expose({ name: 'IsPrimaryLine' })
    IsPrimaryLine: boolean = null;

    @Expose({ name: 'IsPrimaryRampLine' })
    IsPrimaryRampLine: boolean = null;

    @Expose({ name: 'IsPrimaryService' })
    IsPrimaryService: boolean = null;

    @Expose({ name: 'IsReadOnly' })
    IsReadOnly: boolean = null;

    @Expose({ name: 'IsRenewalPending' })
    IsRenewalPending: boolean = null;

    @Expose({ name: 'IsRenewed' })
    IsRenewed: boolean = null;

    @Expose({ name: 'IsUsageTierModifiable' })
    IsUsageTierModifiable: boolean = null;

    @Expose({ name: 'ItemSequence' })
    ItemSequence: number = null;

    @Expose({ name: 'LastRenewEndDate' })
    LastRenewEndDate: Date = null;

    @Expose({ name: 'LineNumber' })
    LineNumber: number = null;

    @Expose({ name: 'LineType' })
    LineType: string = null;

    @Expose({ name: 'ListPrice' })
    ListPrice: number = null;

    @Expose({ name: 'MaxUsageQuantity' })
    MaxUsageQuantity: number = null;

    @Expose({ name: 'MinUsageQuantity' })
    MinUsageQuantity: number = null;

    @Expose({ name: 'MustUpgrade' })
    MustUpgrade: boolean = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @AField({
        soql: 'NetPrice',
        aggregate: ['SUM']
    })
    @Expose({ name: 'NetPrice' })
    NetPrice: number = null;

    @Expose({ name: 'NetUnitPrice' })
    NetUnitPrice: number = null;

    @Expose({ name: 'NextRenewEndDate' })
    NextRenewEndDate: Date = null;

    @Expose({ name: 'OptionId' })
    OptionId: string = null;

    @Expose({ name: 'OptionCost' })
    OptionCost: number = null;

    @Expose({ name: 'OptionPrice' })
    OptionPrice: number = null;

    @Expose({ name: 'OriginalStartDate' })
    OriginalStartDate: Date = null;

    @Expose({ name: 'ParentAssetId' })
    ParentAssetId: string = null;

    @Expose({ name: 'ParentBundleNumber' })
    ParentBundleNumber: number = null;

    @Expose({ name: 'PriceGroup' })
    PriceGroup: string = null;

    @Expose({ name: 'PriceIncludedInBundle' })
    PriceIncludedInBundle: boolean = null;

    @Expose({ name: 'PriceListId' })
    PriceListId: string = null;

    @Expose({ name: 'PriceListItemId' })
    PriceListItemId: string = null;

    @Expose({ name: 'PriceMethod' })
    PriceMethod: string = null;

    @Expose({ name: 'PriceType' })
    PriceType: string = null;

    @Expose({ name: 'PricingDate' })
    PricingDate: Date = null;

    @Expose({ name: 'Frequency' })
    Frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' = null;

    @Expose({ name: 'Term' })
    Term: number = null;

    @Expose({ name: 'PriceUom' })
    PriceUom: string = null;

    @Expose({ name: 'PrimaryLineNumber' })
    PrimaryLineNumber: number = null;

    @Expose({ name: 'ProductId' })
    ProductId: string = null;

    @Expose({ name: 'ProductType' })
    ProductType: string = null;

    @Expose({ name: 'PurchaseDate' })
    PurchaseDate: Date = null;

    @Expose({ name: 'Quantity' })
    Quantity: number = null;

    @Expose({ name: 'RenewalAdjustmentAmount' })
    RenewalAdjustmentAmount: number = null;

    @Expose({ name: 'RenewalAdjustmentType' })
    RenewalAdjustmentType: string = null;

    @Expose({ name: 'RenewalDate' })
    RenewalDate: Date = null;

    @Expose({ name: 'RenewalFrequency' })
    RenewalFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' = null;

    @Expose({ name: 'RenewalTerm' })
    RenewalTerm: number = null;

    @Expose({ name: 'SellingFrequency' })
    SellingFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | 'One Time' = null;

    @Expose({ name: 'SellingTerm' })
    SellingTerm: number = null;

    @Expose({ name: 'SellingUom' })
    SellingUom: string = null;

    @Expose({ name: 'ShipToAccountId' })
    ShipToAccountId: string = null;

    @Expose({ name: 'AccountId' })
    AccountId: string = null;

    @Expose({ name: 'StartDate' })
    StartDate: Date = null;

    get DaysToRenew() {
        if (this.PriceType && this.PriceType === 'Recurring') {
            let endDate = _moment(this.EndDate);
            // need to consider end date too so using + 1 to calculate the value
            return endDate.diff(_moment(), 'days') + 1;
        } else {
            return null;
        }
    }
}
/**
 * @ignore
 */

@ATable({
    sobjectName: 'AssetLineItem'
})
export class AssetLineItemExtended extends AssetLineItem {

    @Expose({ name: 'AttributeValueId' })
    AttributeValueId: string = null;

    @Expose({ name: 'AttributeValue' })
    @Type(() => AssetAttributeValue)
    AttributeValue: AssetAttributeValue = null;

    @Expose({ name: 'PriceListItem' })
    @Type(() => PriceListItem)
    PriceListItem: PriceListItem = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product = new Product();

    /**
     * check if secondary charge type has recurring or usage price type
     * @returns true if there is no recurring or usage price type
     */
    onlyHasOneTimePriceType(childRecords: Array<AssetLineItemExtended>): boolean {
        let mainAsset = this;
        let childRecordAssetArray = get(childRecords, mainAsset.Id);
        let selectedAsset = filter(childRecordAssetArray, (asset) => asset.BundleAssetId === mainAsset.Id && asset.LineType !== 'Option' && (asset.PriceType === 'Recurring' || asset.PriceType === 'Usage'))
        return this.PriceType === 'One Time'
            && selectedAsset.length === 0;
    }

    canRenew(childRecords?: Array<AssetLineItemExtended>): boolean {
        return this.IsPrimaryLine && !this.onlyHasOneTimePriceType(childRecords) && !this.IsInactive;
    }

    canTerminate(childRecords?: Array<AssetLineItemExtended>): boolean {
        return this.IsPrimaryLine && !this.onlyHasOneTimePriceType(childRecords) && !this.IsInactive;
    }

    canBuyMore(): boolean {
        return this.Product.ConfigurationType !== 'Bundle';
    }

    canChangeConfiguration(): boolean {
        return (this.Product.ConfigurationType === 'Bundle' || this.Product.HasAttributes) && this.AssetStatus !== 'Cancelled' && this.PriceType !== 'One Time';
    }
}