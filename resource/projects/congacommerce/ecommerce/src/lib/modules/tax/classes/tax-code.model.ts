import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'Apttus_Config2__TaxCode__c',
    aqlName: 'cpq_TaxCode'
})
export class TaxCode extends AObject {

    @Expose({ name: 'Apttus_Config2__Code__c' })
    Code: string = null;


    @Expose({ name: 'Apttus_Config2__Description__c' })
    Description: string = null;
}