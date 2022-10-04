import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'SummaryGroup',
    aqlName: 'cpq_SummaryGroup'
})
export class SummaryGroup extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'GroupType' })
    GroupType: string = null;

    @Expose({ name: 'LineNumber' })
    LineNumber: number = null;

    @Expose({ name: 'LineType' })
    LineType: 'Category Total' | 'Group Total' | 'Grand Total' | 'Adjustment'= null;

    @Expose({ name: 'ChargeType' })
    ChargeType: string = null;

    @Expose({ name: 'BaseExtendedCost' })
    BaseExtendedCost: number = null;

    @Expose({ name: 'OptionCost' })
    OptionCost: number = null;

    @Expose({ name: 'ExtendedCost' })
    ExtendedCost: number = null;

    @Expose({ name: 'ExtendedListPrice' })
    ExtendedListPrice: number = null;

    @Expose({ name: 'BaseExtendedPrice' })
    BaseExtendedPrice: number = null;

    @Expose({ name: 'OptionPrice' })
    OptionPrice: number = null;

    @Expose({ name: 'ExtendedRollupPrice' })
    ExtendedRollupPrice: number = null;

    @Expose({ name: 'ExtendedPrice' })
    ExtendedPrice: number = null;

    @Expose({ name: 'NetPrice' })
    NetPrice: number = null;
}