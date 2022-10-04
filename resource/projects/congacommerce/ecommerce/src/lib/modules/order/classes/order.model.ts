import { AObject, ATable, AField } from '@congacommerce/core';
import { PriceList } from '../../pricing/classes/index';
import { Account, UserBase, Contact, AccountLocation, User } from '../../crm/classes/index';
import { Quote } from './quote.model';
import { OrderLineItem } from './order-line-item.model';
import { Expose, Type } from 'class-transformer';
import { Attachment } from '../../catalog/classes/index';
import { Note } from '../../catalog/classes/note.model';
import { Opportunity } from './opportunity.model';

@ATable({
    sobjectName: 'Order',
    route: 'order/v1/orders'
})
export class Order extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Accept' })
    Accept: string = null;

    @Expose({ name: 'AutoActivateOrder' })
    AutoActivateOrder: boolean | number = true;


    @Expose({ name: 'BillingPreference' })
    @Type(()=> BillingPreference)
    BillingPreference: BillingPreference = null;

    @AField({
        soql: 'BillToAccount',
        view: ['Compact']
    })

    @Expose({ name: 'BillToAccount' })
    @Type(() => Account)
    BillToAccount: Account = null;

    @Expose({ name: 'CancelledDate' })
    CancelledDate: Date = null;

    @Expose({ name: 'CompletedDate' })
    CompletedDate: Date = null;


    @Expose({ name: 'ConfigurationSyncDate' })
    ConfigurationSyncDate: Date = null;


    @Expose({ name: 'Description' })
    Description: string = null;


    @Expose({ name: 'IsTaskPending' })
    IsTaskPending: boolean = false;


    @Expose({ name: 'OrderDate' })
    OrderDate: Date = null;


    @Expose({ name: 'OrderEndDate' })
    OrderEndDate: Date = null;


    @Expose({ name: 'OrderReferenceNumber' })
    OrderReferenceNumber: string = null;


    @Expose({ name: 'OrderStartDate' })
    OrderStartDate: Date = null;

    @AField({
        soql: 'OrderAmount',
        view: ['Compact'],
        aggregate: ['SUM']
    })
    @Expose({ name: 'OrderAmount' })
    OrderAmount: string = null;

    @Expose({
        name: 'OriginalOrderNumber'
    })
    OriginalOrderNumber: string = null;

    @Expose({
        name: 'ParentOrder'
    })
    ParentOrder: Order = null;

    @Expose({
        name: 'PODate'
    })
    PODate: Date = null;

    @Expose({
        name: 'PONumber'
    })
    PONumber: string = null;

    @AField({
        soql: 'PriceList',
        view: ['Compact']
    })

    @Expose({
        name: 'PriceList'
    })
    @Type(() => PriceList)
    PriceList: PriceList = new PriceList();

    @Expose({
        name: 'PricingDate'
    })
    PricingDate: Date = null;

    @AField({
        soql: 'PrimaryContact',
        view: ['Compact']
    })
    @Expose({
        name: 'PrimaryContact'
    })
    @Type(()=> Contact)
    PrimaryContact: Contact = null;

    @Expose({
        name: 'ActivatedDate'
    })
    ActivatedDate: Date = null;

    @Expose({
        name: 'ReadyForBillingDate'
    })
    ReadyForBillingDate: Date = null;

    @Expose({
        name: 'FulfilledDate'
    })
    FulfilledDate: Date = null;

    @Expose({
        name: 'ReadyForRevRecDate'
    })
    ReadyForRevRecDate: Date = null;

    @Expose({
        name: 'RelatedOpportunity'
    })
    @Type(()=> Opportunity)
    RelatedOpportunity: Opportunity = null;

    @AField({
        soql: 'ShipToAccount',
        view: ['Compact']
    })

    @Expose({
        name: 'ShipToAccount'
    })
    @Type(() => Account)
    ShipToAccount: Account = new Account();

    @AField({
        soql: 'SoldToAccount',
        view: ['Compact']
    })

    @Expose({
        name: 'SoldToAccount'
    })
    @Type(() => Account)
    SoldToAccount: Account = new Account();

    @Expose({
        name: 'Source'
    })
    Source: string = null;

    @Expose({
        name: 'Status'
    })
    Status: string = null;

    @Expose({
        name: 'Type'
    })
    Type: string = null;

    @Expose({
        name: 'OrderLineItems'
    })
    @Type(() => OrderLineItem)
    OrderLineItems: Array<OrderLineItem> = null;
    @Expose({
        name: 'Attachments'
    })
    @Type(() => Attachment)
    Attachments: Array<Attachment> = null;
    @Expose({
        name: 'Notes'
    })
    @Type(() => Note)
    Notes: Array<Note> = null;
    @Expose({
        name: 'Proposal'
    })
    @Type(() => Quote)
    Proposal: Quote = null;

    @Expose({
        name: 'Location'
    })
    @Type(()=> AccountLocation)
    Location: AccountLocation = new AccountLocation();

    // @AField({
    //     soql: 'LocationId',
    //     aql: 'LocationId'
    // })
    // LocationId: string = null;

    @Expose({
        name: 'Owner'
    })
    @Type(() => UserBase)
    Owner: UserBase = new UserBase();

    @Expose({
        name: 'Currency'
    })
    Currency: string = null;

    @AField({
        soql: 'OwnerId',
        view: ['Compact'],
        compactLabel: 'Owner'
    })
    @Expose({
        name: 'OwnerId'
    })
    OwnerId: string = null;

    @Expose({
        name: 'CreatedBy'
    })
    @Type(() => User)
    CreatedBy: User = new User();

    @AField({
        soql: 'PaymentStatus',
        view: ['Compact']
    })
    @Expose({
        name: 'PaymentStatus'
    })
    PaymentStatus: string = null;

    validate() { }
}

@ATable({
    sobjectName: 'BillingPreference',
})

export class BillingPreference extends AObject {
    @Expose({
        name: 'Name'
    })
    Name: string = null;

}