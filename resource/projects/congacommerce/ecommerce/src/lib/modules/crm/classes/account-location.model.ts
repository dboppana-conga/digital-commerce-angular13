import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Account } from './account.model';
@ATable({
    sobjectName: 'AccountLocation'
})
export class AccountLocation extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'City' })
    City: string = null;

    @Expose({ name: 'Country' })
    Country: string = null;

    @Expose({ name: 'County' })
    County: string = null;

    @Expose({ name: 'IsDefault' })
    IsDefault: boolean = false;

    @Expose({ name: 'PostalCode' })
    PostalCode: number = null;

    @Expose({ name: 'State' })
    State: string = null;

    @Expose({ name: 'Street' })
    Street: string = null;

    @Expose({ name: 'Type' })
    Type: string = null;

    @Expose({ name: 'Account' })
    @Type(() => Account)
    Account: Account = null;
  

    @Expose({ name: 'BillingContactFilterCriteria' })
    BillingContactFilterCriteria: string = null;

    @Expose({ name: 'BillingContactFormat' })
    BillingContactFormat: string = null;

    @Expose({ name: 'BillingDayOfMonth' })
    BillingDayOfMonth: string = null;

    @Expose({ name: 'CreditMemoEmailTemplate' })
    CreditMemoEmailTemplate: string = null;

    @Expose({ name: 'DefaultCreditMemoTemplate' })
    DefaultCreditMemoTemplate: string = null;

    @Expose({ name: 'DefaultInvoiceStatementTemplate' })
    DefaultInvoiceStatementTemplate: string = null;

    @Expose({ name: 'DefaultInvoiceTemplate' })
    DefaultInvoiceTemplate: string = null;

    @Expose({ name: 'InvoiceEmailTemplate' })
    InvoiceEmailTemplate: string = null;

    @Expose({ name: 'InvoiceSeparately' })
    InvoiceSeparately: string = null;

    @Expose({ name: 'PaymentTermId' })
    PaymentTermId: string = null;

    @Expose({ name: 'CertificateId' })
    CertificateId: string = null;

    @Expose({ name: 'TaxExempt' })
    TaxExempt: string = null;

    @Expose({ name: 'TaxExemptStatus' })
    TaxExemptStatus: string = null;
}