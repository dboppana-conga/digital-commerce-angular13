import { AObject, ATable, AField } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'Apttus_Config2__TaxCertificate__c',
    aqlName: 'cpq_TaxCertificate'
})
export class TaxCertificate extends AObject {
    @Expose({
        name: 'Apttus_Config2__Description__c'
    })
    Description: string = null;

    @Expose({
        name: 'Apttus_Config2__EffectiveDate__c'
    })
    EffectiveDate: Date = null;

    @Expose({
        name: 'Apttus_Config2__ExpirationDate__c'
    })
    ExpirationDate: Date = null;
}