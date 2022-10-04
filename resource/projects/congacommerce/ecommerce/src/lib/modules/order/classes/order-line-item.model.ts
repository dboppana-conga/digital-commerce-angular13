import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Product } from '../../catalog/classes/product.model';
import { PriceListItem } from '../../pricing/classes/price-list-item.model';
import { ProductOptionComponent } from '../../catalog/classes/product-option.model';
import { OrderAttributeValue } from './order-attribute-value.model';
import { Account } from '../../crm/classes/account.model';
import { Cart } from '../../cart/classes/cart.model';
import { CartItem } from '../../cart/classes/cart-item.model';
import { OrderAdjustmentItem } from '../../promotion/classes/order-adjustment-item.model';
import { Order } from './order.model';
import { TaxCode } from '../../tax/classes/tax-code.model';

@ATable({
    sobjectName: 'OrderLineItem'
})
export class OrderLineItem extends AObject {

    @Expose({ name: 'AdjustedPrice' })
    AdjustedPrice: number = null;

    @Expose({ name: 'AdjustmentAmount' })
    AdjustmentAmount: number = null;

    @Expose({ name: 'AdjustmentType' })
    AdjustmentType: string = null;

    @Expose({ name: 'AutoRenew' })
    AutoRenew: boolean = null;

    @Expose({ name: 'AutoRenewalTerm' })
    AutoRenewalTerm: number = null;

    @Expose({ name: 'AutoRenewalType' })
    AutoRenewalType: string = null;

    @Expose({ name: 'BaseCost' })
    BaseCost: number = null;

    @Expose({ name: 'BaseCostOverride' })
    BaseCostOverride: number = null;

    @Expose({ name: 'BaseExtendedCost' })
    BaseExtendedCost: number = null;

    @Expose({ name: 'BaseExtendedPrice' })
    BaseExtendedPrice: number = null;

    @Expose({ name: 'BasePrice' })
    BasePrice: number = null;

    @Expose({ name: 'BasePriceOverride' })
    BasePriceOverride: number = null;

    @Expose({ name: 'BasePriceMethod' })
    BasePriceMethod: string = null;

    @Expose({ name: 'BaseProduct' })
    @Type(() => Product)
    BaseProduct: Product = null;

    @Expose({ name: 'BillingFrequency' })
    BillingFrequency: string = null;

    @Expose({ name: 'BillingRule' })
    BillingRule: string = null;

    @Expose({ name: 'BillToAccount' })
    @Type(() => Account)
    BillToAccount: Account = null;

    @Expose({ name: 'CancelledDate' })
    CancelledDate: Date = null;


    @Expose({ name: 'ChargeType' })
    ChargeType: string = null;

    @Expose({ name: 'Comments' })
    Comments: string = null;

    @Expose({ name: 'CommitmentQuantity' })
    CommitmentQuantity: number = null;

    @Expose({ name: 'Configuration' })
    @Type(() => Cart)
    Configuration: Cart = null;

    @Expose({ name: 'ContractNumbers' })
    ContractNumbers: string = null;

    @Expose({ name: 'Cost' })
    Cost: number = null;

    @Expose({ name: 'CouponCode' })
    CouponCode: string = null;

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

    @Expose({ name: 'ExtendedQuantity' })
    ExtendedQuantity: number = null;

    @Expose({ name: 'FlatOptionPrice' })
    FlatOptionPrice: number = null;

    @Expose({ name: 'FulfilledQuantity' })
    FulfilledQuantity: number = null;

    @Expose({ name: 'GroupAdjustmentPercent' })
    GroupAdjustmentPercent: number = null;

    @Expose({ name: 'Guidance' })
    Guidance: string = null;

    @Expose({ name: 'HasAttributes' })
    HasAttributes: boolean = null;

    @Expose({ name: 'HasIncentives' })
    HasIncentives: boolean = null;

    @Expose({ name: 'HasOptions' })
    HasOptions: boolean = null;

    @Expose({ name: 'HideInvoiceDisplay' })
    HideInvoiceDisplay: boolean = null;

    @Expose({ name: 'ImpactARR' })
    ImpactARR: number = null;

    @Expose({ name: 'ImpactMRR' })
    ImpactMRR: number = null;

    @Expose({ name: 'ImpactTCV' })
    ImpactTCV: number = null;

    @Expose({ name: 'IncentiveAdjustmentAmount' })
    IncentiveAdjustmentAmount: number = null;

    @Expose({ name: 'IncentiveCode' })
    IncentiveCode: string = null;

    @Expose({ name: 'IncentiveExtendedPrice' })
    IncentiveExtendedPrice: number = null;

    @Expose({ name: 'IncentiveType' })
    IncentiveType: string = null;

    @Expose({ name: 'IsAssetPricing' })
    IsAssetPricing: boolean = null;

    @Expose({ name: 'IsCustomPricing' })
    IsCustomPricing: boolean = null;

    @Expose({ name: 'IsOptionRollupLine' })
    IsOptionRollupLine: boolean = null;

    @Expose({ name: 'IsPrimaryLine' })
    IsPrimaryLine: boolean = null;

    @Expose({ name: 'IsPrimaryRampLine' })
    IsPrimaryRampLine: boolean = null;

    @Expose({ name: 'IsUsageTierModifiable' })
    IsUsageTierModifiable: boolean = null;

    @Expose({ name: 'ItemSequence' })
    ItemSequence: number = null;

    @Expose({ name: 'LineNumber' })
    LineNumber: number = null;

    @Expose({ name: 'LineStatus' })
    LineStatus: string = null;

    @Expose({ name: 'LineType' })
    LineType: string = null;

    @Expose({ name: 'ListPrice' })
    ListPrice: number = null;

    @Expose({ name: 'MaxUsageQuantity' })
    MaxUsageQuantity: number = null;

    @Expose({ name: 'MinUsageQuantity' })
    MinUsageQuantity: number = null;

    @Expose({ name: 'NetAdjustmentPercent' })
    NetAdjustmentPercent: number = null;

    @Expose({ name: 'NetPrice' })
    NetPrice: number = null;

    @Expose({ name: 'NetUnitPrice' })
    NetUnitPrice: number = null;

    @Expose({ name: 'Option' })
    @Type(() => Product)
    Option: Product = null;

    @Expose({ name: 'ProductOption' })
    @Type(() => ProductOptionComponent)
    ProductOption: ProductOptionComponent = null;

    @Expose({ name: 'OptionCost' })
    OptionCost: number = null;

    @Expose({ name: 'OptionPrice' })
    OptionPrice: number = null;

    @Expose({ name: 'Order' })
    @Type(() => Order)
    Order: Order = null;

    @Expose({ name: 'OrderARR' })
    OrderARR: number = null;

    @Expose({ name: 'OrderMRR' })
    OrderMRR: number = null;

    @Expose({ name: 'OrderTCV' })
    OrderTCV: number = null;

    @Expose({ name: 'ParentBundleNumber' })
    ParentBundleNumber: number = null;

    @Expose({ name: 'PriceAdjustment' })
    PriceAdjustment: number = null;

    @Expose({ name: 'PriceAdjustmentAmount' })
    PriceAdjustmentAmount: number = null;

    @Expose({ name: 'PriceAdjustmentType' })
    PriceAdjustmentType: string = null;

    @Expose({ name: 'PriceGroup' })
    PriceGroup: string = null;

    @Expose({ name: 'PriceIncludedInBundle' })
    PriceIncludedInBundle: boolean = null;

    @Expose({ name: 'PriceListItem' })
    @Type(() => PriceListItem)
    PriceListItem: PriceListItem = null;

    @Expose({ name: 'PriceMethod' })
    PriceMethod: string = null;

    @Expose({ name: 'PriceType' })
    PriceType: string = null;

    @Expose({ name: 'PricingDate' })
    PricingDate: Date = null;

    @Expose({ name: 'Frequency' })
    Frequency: string = null;

    @Expose({ name: 'Term' })
    Term: number = null;

    @Expose({ name: 'PriceUom' })
    PriceUom: string = null;

    @Expose({ name: 'PrimaryLineNumber' })
    PrimaryLineNumber: number = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;

    @Expose({ name: 'Uom' })
    Uom: string = null;

    @Expose({ name: 'Quantity' })
    Quantity: number = null;

    @Expose({ name: 'ActivatedDate' })
    ActivatedDate: Date = null;

    @Expose({ name: 'ReadyForBillingDate' })
    ReadyForBillingDate: Date = null;

    @Expose({ name: 'FulfilledDate' })
    FulfilledDate: Date = null;

    @Expose({ name: 'ReadyForRevRecDate' })
    ReadyForRevRecDate: Date = null;

    @Expose({ name: 'RebateAmount' })
    RebateAmount: number = null;

    @Expose({ name: 'RenewalAdjustmentAmount' })
    RenewalAdjustmentAmount: number = null;

    @Expose({ name: 'RenewalAdjustmentType' })
    RenewalAdjustmentType: string = null;

    @Expose({ name: 'SellingFrequency' })
    SellingFrequency: string = null;

    @Expose({ name: 'SellingTerm' })
    SellingTerm: number = null;

    @Expose({ name: 'StartDate' })
    StartDate: Date = null;

    @Expose({ name: 'Status' })
    Status: string = null;

    @Expose({ name: 'SubType' })
    SubType: string = null;

    @Expose({ name: 'Taxable' })
    Taxable: boolean = null;

    @Expose({ name: 'TaxCode' })
    @Type(() => TaxCode)
    TaxCode: TaxCode = null;

    @Expose({ name: 'TaxInclusive' })
    TaxInclusive: boolean = null;

    @Expose({ name: 'Type' })
    Type: string = null;

    @Expose({ name: 'DerivedFrom' })
    @Type(() => CartItem)
    DerivedFrom: CartItem = null;

    @Expose({ name: 'AttributeValue' })
    @Type(() => OrderAttributeValue)
    AttributeValue: OrderAttributeValue = null;

    @Expose({ name: 'AdjustmentLineItems' })
    @Type(() => OrderAdjustmentItem)
    AdjustmentLineItems: Array<OrderAdjustmentItem> = null;

}