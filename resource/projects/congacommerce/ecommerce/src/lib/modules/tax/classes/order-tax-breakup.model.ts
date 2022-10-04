import { AObject, ATable, AField } from '@congacommerce/core';
import { Expose, Type } from 'class-transformer';
import { OrderLineItem } from '../../order/classes/order-line-item.model';

@ATable({
    sobjectName: 'Apttus_Config2__OrderTaxBreakup__c'
})
export class OrderTaxBreakup extends AObject {
    @Expose({
        name: 'Apttus_Config2__BreakupType__c'
    })
    BreakupType: string = null;

    @Expose({
        name: 'Apttus_Config2__OrderLineItemId__c'
    })
    OrderLineItemId: string = null;

    @Expose({
        name: 'Apttus_Config2__OrderLineItemId__r'
    })
    @Type(() => OrderLineItem)
    OrderLineItem = null;

    @Expose({
        name: 'Apttus_Config2__Sequence__c'
    })
    Sequence: number = null;

    @Expose({
        name: 'Apttus_Config2__TaxAmount__c'
    })
    TaxAmount: number = null;

    @Expose({
        name: 'Apttus_Config2__TaxAppliesTo__c'
    })
    TaxAppliesTo: string = null;

    @Expose({
        name: 'Apttus_Config2__TaxRate__c'
    })
    TaxRate: number = null;

    @Expose({
        name: 'Apttus_Config2__TaxType__c'
    })
    TaxType: string = null;
}