import { ATable, AObject } from '@congacommerce/core';
import { Expose } from 'class-transformer';
import * as cc from 'currency-codes';

@ATable({
    sobjectName : 'CurrencyType'
})
export class CurrencyType extends AObject {
    @Expose({
        name: 'ConversionRate'
    })
    ConversionRate: number = 1;
    @Expose({
        name: 'DecimalPlaces'
    })
    DecimalPlaces: number = 2;
    @Expose({
        name: 'IsActive'
    })
    IsActive: boolean = true;
    @Expose({
        name: 'IsCorporate'
    })
    IsCorporate: boolean = false;
    @Expose({
        name: 'IsoCode'
    })
    IsoCode: string = 'USD';

    get _currency(){
        const code = cc.code(this.IsoCode);
        return (code) ? code : null;
    }
}