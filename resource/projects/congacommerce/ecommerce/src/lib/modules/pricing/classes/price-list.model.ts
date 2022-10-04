import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Account } from '../../crm/classes/account.model';
@ATable({
    sobjectName: 'PriceList'
})
export class PriceListBase extends AObject {

    @Expose({ name: 'BasedOnAdjustmentAmount' })
    BasedOnAdjustmentAmount: number = null;

    @Expose({ name: 'BasedOnAdjustmentType' })
    BasedOnAdjustmentType: string = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Account' })
    @Type(() => Account)
    Account: Account = null;

    @Expose({ name: 'Currency' })
    Currency: string = null;

    @Expose({ name: 'IsActive' })
    Active: boolean = false;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: string = null;

    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: string = null;
}

@ATable({
    sobjectName: 'PriceList',
    route:'admin/v1/price-lists'
})
export class PriceList extends PriceListBase {

    @Type(() => PriceListBase)
    @Expose({ name: 'BasedOnPriceList' })
    BasedOnPriceList: PriceListBase = null;
}