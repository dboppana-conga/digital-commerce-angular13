import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Product } from '../../catalog/classes/product.model';
import { ProductAttributeValue } from '../../catalog/classes/product-attribute-value.model';
import { ProductOptionComponent } from '../../catalog/classes/product-option.model';
import { PriceList } from '../../pricing/classes/price-list.model';
import { PriceListItem } from '../../pricing/classes/price-list-item.model';
import { SummaryGroup } from '../../pricing/classes/summary-group.model';
import { AdjustmentItem } from '../../promotion/classes/adjustment-item.model';
import { AssetLineItemExtended } from '../../abo/classes/asset-item.model';
import { Cart } from './cart.model';
import { Account } from '../../crm/classes/account.model';
@ATable({
    sobjectName: 'LineItem'
})
export class CartItem extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'AssetLineItem' })
    @Type(() => AssetLineItemExtended)
    AssetLineItem: AssetLineItemExtended = null;

    @Expose({ name: 'LineNumber' })
    LineNumber: number = null;

    @Expose({ name: 'PrimaryLineNumber' })
    PrimaryLineNumber: number = null;

    @Expose({ name: 'IncentiveCode' })
    IncentiveCode: string = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;

    @Expose({ name: 'Option' })
    @Type(() => Product)
    Option: Product = null;

    @Expose({ name: 'Quantity' })
    get Quantity(): number {
        return this._quantity;
    }
    set Quantity(value: number) {
        this._quantity = value;
    }

    @Expose({ name: 'TotalQuantity' })
    TotalQuantity: number = null;

    @Expose({ name: 'ItemSequence' })
    ItemSequence: number = null;

    @Expose({ name: 'StartDate' })
    StartDate: string = null;

    @Expose({ name: 'EndDate' })
    EndDate: string = null;

    @Expose({ name: 'Frequency' })
    Frequency: string = null;

    @Expose({ name: 'Configuration' })
    @Type(() => Cart)
    Configuration: Cart = null;

    @Expose({ name: 'ListPrice' })
    ListPrice: number = null;

    @Expose({ name: 'BasePrice' })
    BasePrice: number = null;

    @Expose({ name: 'ExtendedPrice' })
    ExtendedPrice: number = null;

    @Expose({ name: 'BaseExtendedPrice' })
    BaseExtendedPrice: number = null;

    @Expose({ name: 'NetPrice' })
    NetPrice: number = null;

    @Expose({ name: 'NetUnitPrice' })
    NetUnitPrice: number = null;

    @Expose({ name: 'HasOptions' })
    HasOptions: boolean = null;

    @Expose({ name: 'HasAttributes' })
    HasAttributes: boolean = null;

    @Expose({ name: 'LineType' })
    LineType: 'Product/Service' | 'Option' | 'Misc' = null;

    @Expose({ name: 'IsPrimaryLine' })
    IsPrimaryLine: boolean = null;

    @Expose({ name: 'IsOptionRollupLine' })
    IsOptionRollupLine: boolean = false;

    @Expose({ name: 'ConfigStatus' })
    ConfigStatus: string = 'NA';

    @Expose({ name: 'ConstraintCheckStatus' })
    ConstraintCheckStatus: string = 'NA';

    @Expose({ name: 'PricingStatus' })
    PricingStatus: 'Pending' | 'Complete' = null;

    @Expose({ name: 'ParentBundleNumber' })
    ParentBundleNumber: number = null;

    @Expose({ name: 'Term' })
    PricingTerm: number = null;

    @Expose({ name: 'SellingTerm' })
    SellingTerm: number = null;

    @Expose({ name: 'AddedByRuleInfo' })
    AddedByRuleInfo: string = null;

    @Expose({ name: 'ProductOption' })
    @Type(() => ProductOptionComponent)
    ProductOption: ProductOptionComponent = null;

    @Expose({ name: 'AttributeValue' })
    @Type(() => ProductAttributeValue)
    AttributeValue: ProductAttributeValue = null;

    @Expose({ name: 'Currency' })
    Currency: string = null;

    @Expose({ name: 'PriceListItem' })
    @Type(() => PriceListItem)
    PriceListItem: PriceListItem = null;

    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList = null;

    @Expose({ name: 'SummaryGroup' })
    @Type(() => SummaryGroup)
    SummaryGroup: SummaryGroup = null;

    @Expose({ name: 'IncentiveAdjustmentAmount' })
    IncentiveAdjustmentAmount: string = null;

    @Expose({ name: 'LineStatus' })
    LineStatus: string = null;

    @Expose({ name: 'CouponCode' })
    CouponCode: string = null;

    @Expose({ name: 'ChargeType' })
    ChargeType: string = null;

    @Expose({ name: 'PriceType' })
    PriceType: string = null;

    @Expose({ name: 'IsTaxable' })
    IsTaxable: boolean = false;

    @Expose({ name: 'TaxCode' })
    TaxCode: string = null;

    @Expose({ name: 'IsTaxInclusive' })
    IsTaxInclusive: boolean = false;

    @Expose({ name: 'ShipToAccount' })
    @Type(() => Account)
    ShipToAccount: Account = null;

    @Expose({ name: 'BillToAccount' })
    @Type(() => Account)
    BillToAccount: Account = null;

    @Expose({ name: 'AdjustmentLineItems' })
    @Type(() => AdjustmentItem)
    AdjustmentLineItems: Array<AdjustmentItem> = null;

    @Expose({ name: 'ExtendedDescription' })
    ExtendedDescription: string = null;

    @Expose({ name: 'Classification' })
    Classification: string = null;

    @Expose({ name: 'ClassificationHierarchy' })
    ClassificationHierarchy: string = null;

    @Expose({ name: 'ClassificationHierarchyInfo' })
    ClassificationHierarchyInfo: string = null;

    @Expose({ name: 'ProductVersion' })
    ProductVersion: number = null;

    @Expose({ name: 'ExternalId' })
    ExternalId: number = null;

    @Expose({ name: 'AdjustmentType' })
    AdjustmentType: string = null;

    @Expose({ name: 'AdjustmentAmount' })
    AdjustmentAmount: number = null;

    private _quantity: number = null;
}