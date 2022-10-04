import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Contact } from './contact.model';
@ATable({
    sobjectName: 'User',
    defaultFields: false
})
export class UserBase extends AObject {

    @Expose({ name: 'FirstName' })
    FirstName: string = null;

    @Expose({ name: 'LastName' })
    LastName: string = null;

    @Expose({ name: 'Email' })
    Email: string = null;

    @Expose({ name: 'UserName' })
    UserName: string = null;

    @Expose({ name: 'Alias' })
    Alias: string = null;

    @Expose({ name: 'Name' })
    Name: string = null;
}

@ATable({
    sobjectName: 'User',
    defaultFields: false
})
export class User extends UserBase {

    @Expose({ name: 'LocaleSidKey' })
    LocaleSidKey: string = null;

    @Expose({ name: 'EmailEncodingKey' })
    EmailEncodingKey: string = null;

    @Expose({ name: 'Language' })
    Language: string = null;

    @Expose({ name: 'CommunityNickname' })
    CommunityNickname: string = null;

    @Expose({ name: 'CountryCode' })
    CountryCode: string = null;

    @Expose({ name: 'TimeZoneSidKey' })
    TimeZoneSidKey: string = null;

    @Expose({ name: 'LastLoginDate' })
    LastLoginDate: Date = null;

    @Expose({ name: 'CurrencyIsoCode' })
    CurrencyIsoCode: string = null;

    @Expose({ name: 'DefaultCurrencyIsoCode' })
    DefaultCurrencyIsoCode: string = null;

    @Expose({ name: 'Contact' })
    @Type(() => Contact)
    Contact: Contact = null;

    @Expose({ name: 'ContactId' })
    ContactId: string = null;

    @Expose({ name: 'SmallPhotoUrl' })
    SmallPhotoUrl: string = null;

    @Expose({ name: 'FullPhotoUrl' })
    FullPhotoUrl: string = null;

    @Expose({ name: 'Locale' })
    Locale: string = null;

    @Expose({ name: 'Currency' })
    Currency: string = null;

    @Expose({ name: 'ExternalId' })
    ExternalId: string = null;
}