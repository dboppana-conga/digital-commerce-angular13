import { AObject, ATable, AField } from '@congacommerce/core';
import { Account } from '../../crm/classes/account.model';
import { Attachment } from '../../catalog/classes/index';
import { Contact } from '../../crm/classes/contact.model';
import { User, UserBase } from '../../crm/classes/user.model';
import { QuoteLineItem } from './quote-line-item.model';
import { Note } from '../../catalog/classes/note.model';
import { SummaryGroup } from '../../pricing/classes/summary-group.model';
import { PriceList } from '../../pricing/classes/price-list.model';
import { Opportunity } from './opportunity.model';
import { Expose, Type } from 'class-transformer';
import { BillingPreference } from './order.model';
import { AccountLocation } from '../../crm/classes/index';

@ATable({
  sobjectName: 'Proposal',
  route:'quote/v1/quotes'
})
export class Quote extends AObject {

  @Expose({ name: 'Name' })
  Name: string = null;

  @Expose({ name: 'ABOType' })
  ABOType: string = null;

  @Expose({ name: 'Accept' })
  Accept: string = null;

  @AField({
    soql: 'Account',
    view: ['Compact']
  })

 @Expose({ name: 'Account' }) @Type(() => Account)
  Account: Account = null;

  // @Expose({ name: 'Account' })
  // Account: string = null;

  /*@AField({
    soql: 'Account'
  })
  @Type(() => Account)
  AccountR: Account = null;*/

  @Expose({ name: 'Amount' })
  Amount: number = null;

  @AField({
    soql: 'ApprovalStage',
    view: ['Compact']
  })
  @Expose({ name: 'ApprovalStage' })
  ApprovalStage: string = null;

  @Expose({ name: 'AutoActivateOrder' })
  AutoActivateOrder: boolean = false;

  @Expose({ name: 'AutoCreateBill' })
  AutoCreateBill: boolean = false;

  @Expose({ name: 'AutoCreateRevenue' })
  AutoCreateRevenue: boolean = false;

  @Expose({ name: 'BillingPreference' })
  @Type(()=> BillingPreference)
  BillingPreference: BillingPreference = null;

  @AField({
    soql: 'BillToAccount',
    view: ['Compact']
})

  @Expose({ name: 'BillToAccount' })
  @Type(() => Account)
  BillToAccount: Account = new Account();

  @Expose({ name: 'configurationFinalizedDate' })
  configurationFinalizedDate: Date = null;

  @Expose({ name: 'configurationSyncDate' })
  configurationSyncDate: Date = null;

  @Expose({ name: 'configure' })
  configure: string = null;

  @Expose({ name: 'configureNG' })
  configureNG: string = null;

  @Expose({ name: 'ProposalreateAgreement' })
  createAgreement: string = null;

  @Expose({ name: 'Description' })
  Description: string = null;

  @Expose({ name: 'DiscountPercent' })
  DiscountPercent: number = null;

  @Expose({ name: 'ExpectedEndDate' })
  ExpectedEndDate: Date = null;

  @Expose({ name: 'ExpectedStartDate' })
  ExpectedStartDate: Date = null;

  @Expose({ name: 'Generate' })
  Generate: string = null;

  @AField({
    soql: 'GrandTotal',
    aggregate: ['SUM']
  })
  @Expose({ name: 'GrandTotal' })
  GrandTotal: number = null;

  @Expose({ name: 'InternalDeadline' })
  InternalDeadline: Date = null;

  @Expose({ name: 'IsSystemGenerated' })
  IsSystemGenerated: boolean = false;

  @Expose({ name: 'IsTaskPending' })
  IsTaskPending: boolean = false;

  @Expose({
  name: 'Location'
})
  @Type(()=> AccountLocation)
  Location: AccountLocation = null;

  @Expose({ name: 'MakePrimary' })
  MakePrimary: string = null;

  @Expose({ name: 'NetAmount' })
  NetAmount: number = null;

  @AField({
    soql: 'Opportunity',
    view: ['Compact']
  })

  @Expose({ name: 'Opportunity' })
  @Type(() => Opportunity)
  Opportunity: Opportunity = null;

  @Expose({ name: 'PaymentTerm' })
  PaymentTerm: string = null;

  @Expose({ name: 'PaymentTermId' })
  PaymentTermId: string = null;

  @Expose({ name: 'PODate' })
  PODate: Date = null;

  @Expose({ name: 'PONumber' })
  PONumber: string = null;

  @Expose({ name: 'Present' })
  Present: string = null;

  @Expose({ name: 'PresentedDate' })
  PresentedDate: Date = null;

  @Expose({ name: 'Preview' })
  Preview: string = null;

  @AField({
    soql: 'PriceList',
    view: ['Compact']
  })

  @Expose({ name: 'PriceList' })
  @Type(() => PriceList)
  PriceList: PriceList = null;

  @Expose({ name: 'PricingDate' })
  PricingDate: Date = null;

  @Expose({ name: 'Primary' })
  Primary: boolean = false;

  @AField({
    soql: 'PrimaryContact',
    view: ['Compact']
  })

  @Expose({ name: 'PrimaryContact' })
  @Type(() => Contact)
  PrimaryContact: Contact = new Contact();


  @Expose({ name: 'ProposalApprovalDate' })
  ProposalApprovalDate: Date = null;

  @Expose({ name: 'ProposalCategory' })
  ProposalCategory: string = null;

  @Expose({ name: 'ProposalExpirationDate' })
  ProposalExpirationDate: Date = null;

  @Expose({ name: 'ProposalName' })
  ProposalName: string = null;

  @Expose({name: 'ReadyForActivationDate' })
  ReadyForActivationDate: Date = null;

  @Expose({ name: 'ReadyForBillingDate'})
  ReadyForBillingDate: Date = null;

  @Expose({ name: 'ReadyForFulfillmentDate' })
  ReadyForFulfillmentDate: Date = null;

  @Expose({ name: 'ReadyForRevRecDate' })
  ReadyForRevRecDate: Date = null;

  @Expose({ name: 'ReadyToGenerate' })
  ReadyToGenerate: boolean = false;

  @Expose({ name: 'ReadyToPresent' })
  ReadyToPresent: boolean = false;

  @Expose({ name: 'Proposalequest_Approval' })
  Request_Approval: string = null;

  @Expose({ name: 'RFPIntakeDate' })
  RFPIntakeDate: Date = null;

  @Expose({ name: 'RFPResponseDueDate' })
  RFPResponseDueDate: string = null;

  @Expose({ name: 'RFPStage' })
  RFPStage: string = null;

  @Expose({ name: 'RFPValue' })
  RFPValue: number = null;

  @Expose({ name: 'RiskFactors' })
  RiskFactors: string = null;

  @Expose({ name: 'SalesTaxPercent' })
  SalesTaxPercent: number = null;

  @Expose({ name: 'SalesTaxAmount' })
  SalesTaxAmount: number = null;

  @Expose({ name: 'ShippingHandling' })
  ShippingHandling: number = null;

  @AField({
    soql: 'ShipToAccount',
    view: ['Compact']
  })

  @Expose({ name: 'ShipToAccount' })
  @Type(() => Account)
  ShipToAccount: Account = new Account();

  @Expose({ name: 'SpecialTerms' })
  SpecialTerms: string = null;

  @Expose({ name: 'StrategicImportance' })
  StrategicImportance: string = null;

  @Expose({ name: 'SubmitForApproval' })
  SubmitForApproval: string = null;

  @Expose({ name: 'SyncAssetChangesToQuote' })
  SyncAssetChangesToQuote: boolean = false;

  @Expose({ name: 'SyncWithOpportunity' })
  SyncWithOpportunity: string = null;

  @Expose({ name: 'ValidUntilDate' })
  ValidUntilDate: Date = null;

  // @Expose({ name: 'Proposal00N70000001yUfBEAU' })
  // @Type(() => QuoteLineItem)
  // R00N70000001yUfBEAU: Array<QuoteLineItem> = null;


  // @Type(() => QuoteLineItem)
  // get QuoteLineItems(): Array<QuoteLineItem> {
  //   return this.R00N70000001yUfBEAU;
  // }
  
  @Expose({ name: 'Currency' })
  Currency: string = null;

  @Expose({ name: 'Attachments' })
  @Type(() => Attachment)
  Attachments: Array<Attachment> = null;

  @Expose({ name: 'Notes' })
  @Type(() => Note)
  Notes: Array<Note> = null;

  @AField({
    soql: 'Owner',
    view: ['Compact'],
    compactLabel: 'Owner'
  })

  @Expose({ name: 'Owner' })
  @Type(() => UserBase)
  Owner: UserBase = new UserBase();

  @Expose({ name: 'CreatedBy' })
  @Type(() => User)
  CreatedBy: User = new User();

  @Expose({ name: 'ProposalSummaryGroups' })
  @Type(() => SummaryGroup)
  ProposalSummaryGroups: Array<SummaryGroup> = null;

}