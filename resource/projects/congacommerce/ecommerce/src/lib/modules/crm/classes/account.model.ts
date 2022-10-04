import { Expose, Type } from 'class-transformer';
import { AObject, ATable, AField } from '@congacommerce/core';
import { PriceList } from '../../pricing/classes/price-list.model';
import { AccountLocation } from './account-location.model';
import { UserBase } from '../../crm/classes/user.model';
import { Address } from '../../../interfaces/address.interface';
@ATable({
    sobjectName: 'Account'
})
export class AccountBase extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @AField({
        soql: 'BillingAddress',
        view: ['Compact'],
        compactLabel: 'Billing Address'
    })
    @Expose({ name: 'BillingAddress' })
    BillingAddress: Address = null;

    @AField({
        soql: 'ShippingAddress',
        view: ['Compact'],
        compactLabel: 'Shipping Address'
    })
    @Expose({ name: 'ShippingAddress' })
    ShippingAddress: Address = null;

    @Expose({ name: 'BillingStreet' })
    BillingStreet: string = null;

    @Expose({ name: 'Parent' })
    Parent: Account = null;

    @Expose({ name: 'BillingState' })
    BillingState: string = null;

    @Expose({ name: 'BillingStateCode ' })
    BillingStateCode: string = null;

    @Expose({ name: 'BillingCity' })
    BillingCity: string = null;

    @Expose({ name: 'BillingPostalCode' })
    BillingPostalCode: string = null;

    @Expose({ name: 'BillingCountry' })
    BillingCountry: string = null;

    @Expose({ name: 'BillingCountryCode ' })
    BillingCountryCode: string = null;

    @Expose({ name: 'ShippingStreet' })
    ShippingStreet: string = null;

    @Expose({ name: 'ShippingState' })
    ShippingState: string = null;

    @Expose({ name: 'ShippingStateCode ' })
    ShippingStateCode: string = null;

    @Expose({ name: 'ShippingCity' })
    ShippingCity: string = null;

    @Expose({ name: 'ShippingPostalCode' })
    ShippingPostalCode: string = null;

    @Expose({ name: 'ShippingCountry' })
    ShippingCountry: string = null;

    @Expose({ name: 'ShippingCountryCode ' })
    ShippingCountryCode: string = null;

    @AField({
        soql: 'PriceList',
        view: ['Compact']
    })

    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList = null;

    @AField({
        soql: 'Phone',
        view: ['Compact']
    })
    @Expose({ name: 'Phone' })
    Phone: number = null;

    @AField({
        soql: 'Owner',
        view: ['Compact'],
        compactLabel: 'Owner'
    })
    @Expose({ name: 'Owner' })
    @Type(() => UserBase)
    Owner: UserBase = null;

    @AField({
        soql: 'Industry',
        view: ['Compact']
    })
    @Expose({ name: 'Industry' })
    Industry: string = null;
}

@ATable({
    sobjectName: 'Account',
    route: 'common/v1/accounts'
})
export class Account extends AccountBase {

    @Expose({ name: 'ChildAccounts' })
    @Type(() => AccountBase)
    ChildAccounts: Array<AccountBase> = null;

    @Expose({ name: 'AccountLocations' })
    @Type(() => AccountLocation)
    AccountLocations: Array<AccountLocation> = null;
}