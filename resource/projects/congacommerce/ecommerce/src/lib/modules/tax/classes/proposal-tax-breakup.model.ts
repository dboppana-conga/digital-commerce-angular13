import { AObject, ATable, AField } from '@congacommerce/core';
import { QuoteLineItem } from '../../order/classes/quote-line-item.model';
import { Expose, Type } from 'class-transformer';

@ATable({
    sobjectName: 'Apttus_QPConfig__ProposalTaxBreakup__c'
})
export class ProposalTaxBreakup extends AObject {
    @Expose({
        name: 'Apttus_QPConfig__BreakupType__c'
    })
    BreakupType: string = null;

    @Expose({
        name: 'Apttus_QPConfig__LineItemId__c'
    })
    LineItemId: string = null;

    @Expose({
        name: 'Apttus_QPConfig__LineItemId__r'
    })
    @Type(() => QuoteLineItem)
    LineItem = new QuoteLineItem();

    @Expose({
        name: 'Apttus_QPConfig__Sequence__c'
    })
    Sequence: number = null;

    @Expose({
        name: 'Apttus_QPConfig__TaxAmount__c'
    })
    TaxAmount: number = null;

    @Expose({
        name: 'Apttus_QPConfig__TaxAppliesTo__c'
    })
    TaxAppliesTo: string = null;

    @Expose({
        name: 'Apttus_QPConfig__TaxRate__c'
    })
    TaxRate: number = null;

    @Expose({
        name: 'Apttus_QPConfig__TaxType__c'
    })
    TaxType: string = null;
}