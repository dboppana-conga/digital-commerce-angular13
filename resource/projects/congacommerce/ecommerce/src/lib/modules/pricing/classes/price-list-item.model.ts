import { Expose, Type } from 'class-transformer';
import { AObject, ATable, AField } from '@congacommerce/core';
import { PriceList } from '../../pricing/classes/price-list.model';
import { Product } from '../../catalog/classes/product.model';

@ATable({
    sobjectName: 'PriceListItem'
})
export class PriceListItem extends AObject {
    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: Date = null;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: Date = null;

    @Expose({ name: 'ContractPrice' })
    ContractPrice: number = null;

    @Expose({ name: 'ListPrice' })
    ListPrice: number = null;

    @Expose({ name: 'IsActive' })
    Active: boolean = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;



    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList = null;

    @Expose({ name: 'PriceUom' })
    PriceUom: string = null;

    @Expose({ name: 'PriceMethod' })
    PriceMethod: string = null;

    @Expose({ name: 'Frequency' })
    Frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | '--None--' = null;

    @Expose({ name: 'ChargeType' })
    ChargeType: string = null;

    @Expose({ name: 'PriceType' })
    PriceType: string = null;

    @Expose({ name: 'DefaultSellingTerm' })
    DefaultSellingTerm: number = null;

    @Expose({ name: 'DefaultQuantity' })
    DefaultQuantity: number = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'IsTaxable' })
    Taxable: boolean = false;


    @Expose({ name: 'IsTaxInclusive' })
    TaxInclusive: boolean = false;
}