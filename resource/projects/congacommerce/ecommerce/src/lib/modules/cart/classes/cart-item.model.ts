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
    Name: string | null = null;

    @Expose({ name: 'AssetLineItem' })
    @Type(() => AssetLineItemExtended)
    AssetLineItem: AssetLineItemExtended | null = null;

    @Expose({ name: 'LineNumber' })
    LineNumber: number | null = null;

    @Expose({ name: 'PrimaryLineNumber' })
    PrimaryLineNumber: number | null = null;

    @Expose({ name: 'IncentiveCode' })
    IncentiveCode: string | null = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product | null = null;

    @Expose({ name: 'Option' })
    @Type(() => Product)
    Option: Product | null = null;

    @Expose({ name: 'Quantity' })
    get Quantity(): number {
        return this._quantity;
    }
    set Quantity(value: number) {
        this._quantity = value;
    }

    @Expose({ name: 'TotalQuantity' })
    TotalQuantity: number | null = null;

    @Expose({ name: 'ItemSequence' })
    ItemSequence: number | null = null;

    @Expose({ name: 'StartDate' })
    StartDate: string | null = null;

    @Expose({ name: 'EndDate' })
    EndDate: string | null = null;

    @Expose({ name: 'Frequency' })
    Frequency: string | null = null;

    @Expose({ name: 'Configuration' })
    @Type(() => Cart)
    Configuration: Cart | null = null;

    @Expose({ name: 'ListPrice' })
    ListPrice: number | null = null;

    @Expose({ name: 'BasePrice' })
    BasePrice: number | null = null;

    @Expose({ name: 'ExtendedPrice' })
    ExtendedPrice: number | null = null;

    @Expose({ name: 'BaseExtendedPrice' })
    BaseExtendedPrice: number | null = null;

    @Expose({ name: 'NetPrice' })
    NetPrice: number | null = null;

    @Expose({ name: 'NetUnitPrice' })
    NetUnitPrice: number | null = null;

    @Expose({ name: 'HasOptions' })
    HasOptions: boolean  = false;

    @Expose({ name: 'HasAttributes' })
    HasAttributes: boolean  = false;

    @Expose({ name: 'LineType' })
    LineType: 'Product/Service' | 'Option' | 'Misc' | null = null;

    @Expose({ name: 'IsPrimaryLine' })
    IsPrimaryLine: boolean = false;

    @Expose({ name: 'IsOptionRollupLine' })
    IsOptionRollupLine: boolean = false;

    @Expose({ name: 'ConfigStatus' })
    ConfigStatus: string = 'NA';

    @Expose({ name: 'ConstraintCheckStatus' })
    ConstraintCheckStatus: string = 'NA';

    @Expose({ name: 'PricingStatus' })
    PricingStatus: 'Pending' | 'Complete' | null = null;

    @Expose({ name: 'ParentBundleNumber' })
    ParentBundleNumber: number | null = null;

    @Expose({ name: 'Term' })
    PricingTerm: number | null = null;

    @Expose({ name: 'SellingTerm' })
    SellingTerm: number | null = null;

    @Expose({ name: 'AddedByRuleInfo' })
    AddedByRuleInfo: string | null = null;

    @Expose({ name: 'ProductOption' })
    @Type(() => ProductOptionComponent)
    ProductOption: ProductOptionComponent | null = null;

    @Expose({ name: 'AttributeValue' })
    @Type(() => ProductAttributeValue)
    AttributeValue: ProductAttributeValue | null = null;

    @Expose({ name: 'Currency' })
    Currency: string | null = null;

    @Expose({ name: 'PriceListItem' })
    @Type(() => PriceListItem)
    PriceListItem: PriceListItem | null = null;

    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList | null = null;

    @Expose({ name: 'SummaryGroup' })
    @Type(() => SummaryGroup)
    SummaryGroup: SummaryGroup | null = null;

    @Expose({ name: 'IncentiveAdjustmentAmount' })
    IncentiveAdjustmentAmount: string | null = null;

    @Expose({ name: 'LineStatus' })
    LineStatus: string | null = null;

    @Expose({ name: 'CouponCode' })
    CouponCode: string | null = null;

    @Expose({ name: 'ChargeType' })
    ChargeType: string | null = null;

    @Expose({ name: 'PriceType' })
    PriceType: string | null = null;

    @Expose({ name: 'IsTaxable' })
    IsTaxable: boolean = false;

    @Expose({ name: 'TaxCode' })
    TaxCode: string | null = null;

    @Expose({ name: 'IsTaxInclusive' })
    IsTaxInclusive: boolean = false;

    @Expose({ name: 'ShipToAccount' })
    @Type(() => Account)
    ShipToAccount: Account | null = null;

    @Expose({ name: 'BillToAccount' })
    @Type(() => Account)
    BillToAccount: Account | null = null;

    @Expose({ name: 'AdjustmentLineItems' })
    @Type(() => AdjustmentItem)
    AdjustmentLineItems: Array<AdjustmentItem> | null = null;

    @Expose({ name: 'ExtendedDescription' })
    ExtendedDescription: string | null = null;

    @Expose({ name: 'Classification' })
    Classification: string | null = null;

    @Expose({ name: 'ClassificationHierarchy' })
    ClassificationHierarchy: string | null = null;

    @Expose({ name: 'ClassificationHierarchyInfo' })
    ClassificationHierarchyInfo: string | null = null;

    @Expose({ name: 'ProductVersion' })
    ProductVersion: number | null = null;

    @Expose({ name: 'ExternalId' })
    ExternalId: number | null = null;

    @Expose({ name: 'AdjustmentType' })
    AdjustmentType: string | null = null;

    @Expose({ name: 'AdjustmentAmount' })
    AdjustmentAmount: number | null = null;

    private _quantity: number = 0;
}