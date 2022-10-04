import { Expose, Type } from 'class-transformer';
import { AObject, ATable, AField } from '@congacommerce/core';
import { Account } from './account.model';
@ATable({
    sobjectName: 'Contact',
    route:'common/v1/contacts'
})
export class Contact extends AObject {

    @AField({
        soql: 'FirstName',
        view: ['Compact']
    })
    @Expose({ name: 'FirstName' })
    FirstName: string = null;

    @AField({
        soql: 'LastName',
        view: ['Compact']
    })
    @Expose({ name: 'LastName' })
    LastName: string = null;

    @AField({
        soql: 'Name',
        view: ['Compact']
    })
    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Account' })
    @Type(() => Account)
    Account: Account = null;

    @AField({
        soql: 'Phone',
        view: ['Compact']
    })
    @Expose({ name: 'Phone' })
    Phone: string = null;

    @AField({
        soql: 'Email',
        view: ['Compact']
    })
    @Expose({ name: 'Email' })
    Email: string = null;

    @AField({
        soql: 'MailingAddress',
        view: ['Compact']
    })
    @Expose({ name: 'MailingAddress' })
    MailingAddress: string = null;

    @Expose({ name: 'MailingStreet' })
    MailingStreet: string = null;

    @Expose({ name: 'MailingState' })
    MailingState: string = null;

    @Expose({ name: 'MailingStateCode' })
    MailingStateCode: string = null;

    @Expose({ name: 'MailingCity' })
    MailingCity: string = null;

    @Expose({ name: 'MailingPostalCode' })
    MailingPostalCode: number = null;

    @Expose({ name: 'MailingCountryCode' })
    MailingCountryCode: string = null;

    @Expose({ name: 'MailingCountry' })
    MailingCountry: string = null;

    @AField({
        soql: 'OtherAddress',
        view: ['Compact']
    })
    @Expose({ name: 'OtherAddress' })
    OtherAddress: string = null;

    @Expose({ name: 'OtherStreet' })
    OtherStreet: string = null;

    @Expose({ name: 'OtherState' })
    OtherState: string = null;

    @Expose({ name: 'OtherStateCode' })
    OtherStateCode: string = null;

    @Expose({ name: 'OtherCity' })
    OtherCity: string = null;

    @AField({
        soql: 'OtherPostalCode',
        view: ['Compact']
    })
    @Expose({ name: 'OtherPostalCode' })
    OtherPostalCode: number = null;

    @Expose({ name: 'OtherCountryCode' })
    OtherCountryCode: string = null;

    @AField({
        soql: 'OtherCountry',
        view: ['Compact']
    })
    @Expose({ name: 'OtherCountry' })
    OtherCountry: string = null;

    @AField({
        soql: 'Title',
        view: ['Compact']
    })
    @Expose({ name: 'Title' })
    Title: string = null;
}