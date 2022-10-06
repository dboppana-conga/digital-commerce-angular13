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
    AdjustedPrice: number | null = null;

    @Expose({ name: 'AllowedActions' })
    AllowedActions: string | null = null;

    @Expose({ name: 'AssetARR' })
    AssetARR: number | null = null;

    @Expose({ name: 'AssetCode' })
    AssetCode: string | null = null;

    @Expose({ name: 'AssetMRR' })
    AssetMRR: number | null = null;

    @Expose({ name: 'AssetNumber' })
    AssetNumber: string | null = null;

    @Expose({ name: 'AssetStatus' })
    AssetStatus: string | null = null;

    @Expose({ name: 'AutoRenew' })
    AutoRenew: boolean = false;

    @Expose({ name: 'AutoRenewalType' })
    AutoRenewalType: string | null = null;

    @Expose({ name: 'AvailableBalance' })
    AvailableBalance: number | null = null;

    @Expose({ name: 'BaseCost' })
    BaseCost: number | null = null;

    @Expose({ name: 'BaseExtendedCost' })
    BaseExtendedCost: number | null = null;

    @Expose({ name: 'BaseExtendedPrice' })
    BaseExtendedPrice: number | null = null;

    @Expose({ name: 'BasePrice' })
    BasePrice: number | null = null;

    @Expose({ name: 'BasePriceMethod' })
    BasePriceMethod: string | null = null;

    @Expose({ name: 'BillingEndDate' })
    BillingEndDate: Date | null = null;

    @Expose({ name: 'BillingFrequency' })
    BillingFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | null = null;

    @Expose({ name: 'BillingStartDate' })
    BillingStartDate: Date | null = null;

    @Expose({ name: 'BillThroughDate' })
    BillThroughDate: Date | null = null;

    @Expose({ name: 'BillToAccountId' })
    BillToAccountId: string | null = null;

    @Expose({ name: 'BundleAssetId' })
    BundleAssetId: string | null = null;

    @Expose({ name: 'BusinessLineItemId' })
    BusinessLineItemId: string | null = null;

    @Expose({ name: 'BusinessObjectId' })
    BusinessObjectId: string | null = null;

    @Expose({ name: 'BusinessObjectType' })
    BusinessObjectType: 'Order' | 'Proposal' | 'Agreement' | null = null;

    @Expose({ name: 'CancelledDate' })
    CancelledDate: Date | null = null;

    @Expose({ name: 'ChargeType' })
    ChargeType: string | null = null;

    @Expose({ name: 'Comments' })
    Comments: string | null = null;

    @Expose({ name: 'DeltaPrice' })
    DeltaPrice: number | null = null;

    @Expose({ name: 'DeltaQuantity' })
    DeltaQuantity: number | null = null;

    @Expose({ name: 'Description' })
    Description: string | null = null;

    @Expose({ name: 'EndDate' })
    EndDate: Date | null = null;

    @Expose({ name: 'ExtendedCost' })
    ExtendedCost: number | null = null;

    @Expose({ name: 'ExtendedDescription' })
    ExtendedDescription: string | null = null;

    @Expose({ name: 'ExtendedPrice' })
    ExtendedPrice: number | null = null;

    @Expose({ name: 'HasAttributes' })
    HasAttributes: boolean = false;

    @Expose({ name: 'HasOptions' })
    HasOptions: boolean = false;

    @Expose({ name: 'HideInvoiceDisplay' })
    HideInvoiceDisplay: boolean = false;

    @Expose({ name: 'IsInactive' })
    IsInactive: boolean = false;

    @Expose({ name: 'InitialActivationDate' })
    InitialActivationDate: Date | null = null;

    @Expose({ name: 'IsOptionRollupLine' })
    IsOptionRollupLine: boolean = false;

    @Expose({ name: 'IsPrimaryLine' })
    IsPrimaryLine: boolean = false;

    @Expose({ name: 'IsPrimaryRampLine' })
    IsPrimaryRampLine: boolean = false;

    @Expose({ name: 'IsPrimaryService' })
    IsPrimaryService: boolean = false;

    @Expose({ name: 'IsReadOnly' })
    IsReadOnly: boolean = false;

    @Expose({ name: 'IsRenewalPending' })
    IsRenewalPending: boolean = false;

    @Expose({ name: 'IsRenewed' })
    IsRenewed: boolean = false;

    @Expose({ name: 'IsUsageTierModifiable' })
    IsUsageTierModifiable: boolean = false;

    @Expose({ name: 'ItemSequence' })
    ItemSequence: number | null= null;

    @Expose({ name: 'LastRenewEndDate' })
    LastRenewEndDate: Date | null= null;

    @Expose({ name: 'LineNumber' })
    LineNumber: number | null= null;

    @Expose({ name: 'LineType' })
    LineType: string | null= null;

    @Expose({ name: 'ListPrice' })
    ListPrice: number | null = null;

    @Expose({ name: 'MaxUsageQuantity' })
    MaxUsageQuantity: number | null = null;

    @Expose({ name: 'MinUsageQuantity' })
    MinUsageQuantity: number | null = null;

    @Expose({ name: 'MustUpgrade' })
    MustUpgrade: boolean = false;

    @Expose({ name: 'Name' })
    Name: string | null = null;

    @AField({
        soql: 'NetPrice',
        aggregate: ['SUM']
    })
    @Expose({ name: 'NetPrice' })
    NetPrice: number | null = null;

    @Expose({ name: 'NetUnitPrice' })
    NetUnitPrice: number | null = null;

    @Expose({ name: 'NextRenewEndDate' })
    NextRenewEndDate: Date | null = null;

    @Expose({ name: 'OptionId' })
    OptionId: string | null = null;

    @Expose({ name: 'OptionCost' })
    OptionCost: number | null = null;

    @Expose({ name: 'OptionPrice' })
    OptionPrice: number | null = null;

    @Expose({ name: 'OriginalStartDate' })
    OriginalStartDate: Date | null = null;

    @Expose({ name: 'ParentAssetId' })
    ParentAssetId: string | null = null;

    @Expose({ name: 'ParentBundleNumber' })
    ParentBundleNumber: number | null = null;

    @Expose({ name: 'PriceGroup' })
    PriceGroup: string | null = null;

    @Expose({ name: 'PriceIncludedInBundle' })
    PriceIncludedInBundle: boolean = false;

    @Expose({ name: 'PriceListId' })
    PriceListId: string | null = null;

    @Expose({ name: 'PriceListItemId' })
    PriceListItemId: string | null = null;

    @Expose({ name: 'PriceMethod' })
    PriceMethod: string | null = null;

    @Expose({ name: 'PriceType' })
    PriceType: string | null = null;

    @Expose({ name: 'PricingDate' })
    PricingDate: Date | null = null;

    @Expose({ name: 'Frequency' })
    Frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly'| null = null;

    @Expose({ name: 'Term' })
    Term: number | null = null;

    @Expose({ name: 'PriceUom' })
    PriceUom: string | null = null;

    @Expose({ name: 'PrimaryLineNumber' })
    PrimaryLineNumber: number | null = null;

    @Expose({ name: 'ProductId' })
    ProductId: string | null = null;

    @Expose({ name: 'ProductType' })
    ProductType: string | null = null;

    @Expose({ name: 'PurchaseDate' })
    PurchaseDate: Date | null = null;

    @Expose({ name: 'Quantity' })
    Quantity: number | null = null;

    @Expose({ name: 'RenewalAdjustmentAmount' })
    RenewalAdjustmentAmount: number | null = null;

    @Expose({ name: 'RenewalAdjustmentType' })
    RenewalAdjustmentType: string | null = null;

    @Expose({ name: 'RenewalDate' })
    RenewalDate: Date | null = null;

    @Expose({ name: 'RenewalFrequency' })
    RenewalFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | null = null;

    @Expose({ name: 'RenewalTerm' })
    RenewalTerm: number | null = null;

    @Expose({ name: 'SellingFrequency' })
    SellingFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | 'One Time' | null = null;

    @Expose({ name: 'SellingTerm' })
    SellingTerm: number | null = null;

    @Expose({ name: 'SellingUom' })
    SellingUom: string | null = null;

    @Expose({ name: 'ShipToAccountId' })
    ShipToAccountId: string | null = null;

    @Expose({ name: 'AccountId' })
    AccountId: string | null = null;

    @Expose({ name: 'StartDate' })
    StartDate: Date | null = null;

    get DaysToRenew() {
        if (this.PriceType && this.PriceType === 'Recurring') {
            let endDate = _moment(this.EndDate as Date);
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
    AttributeValueId: string | null = null;

    @Expose({ name: 'AttributeValue' })
    @Type(() => AssetAttributeValue)
    AttributeValue: AssetAttributeValue | null = null;

    @Expose({ name: 'PriceListItem' })
    @Type(() => PriceListItem)
    PriceListItem: PriceListItem | null = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product = new Product();

    /**
     * check if secondary charge type has recurring or usage price type
     * @returns true if there is no recurring or usage price type
     */
    onlyHasOneTimePriceType(childRecords: Array<AssetLineItemExtended>): boolean {
        let mainAsset = this;
        let childRecordAssetArray = get(childRecords, mainAsset.Id as string);
        let selectedAsset = filter(childRecordAssetArray, (asset) => asset.BundleAssetId === mainAsset.Id && asset.LineType !== 'Option' && (asset.PriceType === 'Recurring' || asset.PriceType === 'Usage'))
        return this.PriceType === 'One Time'
            && selectedAsset.length === 0;
    }

    canRenew(childRecords: Array<AssetLineItemExtended>): boolean {
        return this.IsPrimaryLine && !this.onlyHasOneTimePriceType(childRecords) && !this.IsInactive;
    }

    canTerminate(childRecords: Array<AssetLineItemExtended>): boolean {
        return this.IsPrimaryLine && !this.onlyHasOneTimePriceType(childRecords) && !this.IsInactive;
    }

    canBuyMore(): boolean {
        return this.Product.ConfigurationType !== 'Bundle';
    }

    canChangeConfiguration(): boolean {
        return (this.Product.ConfigurationType === 'Bundle' || this.Product.HasAttributes) && this.AssetStatus !== 'Cancelled' && this.PriceType !== 'One Time';
    }
}