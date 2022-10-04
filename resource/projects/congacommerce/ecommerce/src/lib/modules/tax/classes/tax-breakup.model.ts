import { AObject, ATable } from '@congacommerce/core';
import { CartItem } from '../../cart/classes/cart-item.model';
import { Expose, Type } from 'class-transformer';

@ATable({
    sobjectName: 'Apttus_Config2__TaxBreakup__c'
})
export class TaxBreakup extends AObject {
    @Expose({ name: 'Apttus_Config2__BreakupType__c'})
    BreakupType: string = null;

    @Expose({ name: 'Apttus_Config2__LineItemId__c'})
    LineItemId: string = null;

    @Expose({ name: 'Apttus_Config2__LineItemId__r'})
    @Type(() => CartItem)
    LineItem: CartItem = null;
    @Expose({ name: 'Apttus_Config2__Sequence__c'})
    Sequence: number = null;

    @Expose({ name: 'Apttus_Config2__TaxAmount__c'})
    TaxAmount: number = null;

    @Expose({ name: 'Apttus_Config2__TaxAppliesTo__c'})
    TaxAppliesTo: string = null;

    @Expose({ name: 'Apttus_Config2__TaxRate__c'})
    TaxRate: number = null;

    @Expose({ name: 'Apttus_Config2__TaxType__c'})
    TaxType: string = null;
}