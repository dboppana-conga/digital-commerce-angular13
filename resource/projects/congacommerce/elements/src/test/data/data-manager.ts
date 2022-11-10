import { Pipe, PipeTransform } from "@angular/core";
import { Account, Cart, Category, Order, PriceList, Product, Quote, QuoteLineItem, Storefront } from "@congacommerce/ecommerce";
import { BreadcrumbLink } from "@congacommerce/elements";
import { of } from "rxjs";

@Pipe({
  name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
  public name = 'translate';
  public transform(data: string): any {
    return of(data);
  }
}

/**
 * @ignore
 */
export const CART = {
  "Id": "a1I790000007VdqEAE",
  "OwnerId": "005R0000005OT2UIAW",
  "IsDeleted": false,
  "Name": "a1I790000007Vdq",
  "CurrencyIsoCode": "USD",
  "AccountId": "0011900000hnGsrAAE",
  "BusinessObjectId": "a3K79000002DeHQEA0",
  "BusinessObjectType": "Digital Commerce",
  "IsPricePending": false,
  "IsTransient": true,
  "PriceListId": "a171T000005il1XQAQ",
  "Status": "New",
  "SummaryGroups__r": ""
} as unknown as Cart;

export const BREADCRUMB_LINK = [
  {
    "route": [
      "/orders"
    ],
    "label": "Orders"
  },
  {
    "route": [
      "/orders/c84d02ec-80ff-4102-8720-b30e8d57f7cf"
    ],
    "label": "Order-DCTest",
    "active": true
  }
] as unknown as Array<BreadcrumbLink>;


export const ORDER = {
  "Id": "c84d02ec-80ff-4102-8720-b30e8d57f7cf",
  "CreatedDate": "2022-10-18T07:10:35",
  "ModifiedDate": "2022-10-18T07:10:35",
  "LastModifiedById": null,
  "CreatedById": null,
  "Name": "Order-DCTest",
  "Accept": null,
  "AutoActivateOrder": false,
  "BillingPreference": null,
  "BillToAccount": {
    "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
    "CreatedDate": "2022-07-28T04:05:59",
    "ModifiedDate": "2022-08-23T15:41:09",
    "LastModifiedById": null,
    "CreatedById": null,
    "Name": "Test Account",
    "BillingAddress": null,
    "ShippingAddress": "36 China Town",
    "BillingStreet": null,
    "Parent": null,
    "BillingState": null,
    "BillingStateCode": null,
    "BillingCity": null,
    "BillingPostalCode": null,
    "BillingCountry": null,
    "BillingCountryCode": null,
    "ShippingStreet": "Thane",
    "ShippingState": "Mumbai",
    "ShippingStateCode": null,
    "ShippingCity": "Mumbai",
    "ShippingPostalCode": "400001",
    "ShippingCountry": "India",
    "ShippingCountryCode": null,
    "PriceList": {
      "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
      "CreatedDate": null,
      "ModifiedDate": null,
      "LastModifiedById": null,
      "CreatedById": null,
      "BasedOnAdjustmentAmount": null,
      "BasedOnAdjustmentType": null,
      "Name": "Tier 1 Hardware & Software",
      "Account": null,
      "Currency": null,
      "Active": false,
      "EffectiveDate": null,
      "ExpirationDate": null,
      "BasedOnPriceList": null
    },
    "Phone": "9876543210",
    "Owner": null,
    "Industry": null,
    "ChildAccounts": null,
    "AccountLocations": null,
    "CreatedBy": {
      "Id": "de985db7-0c30-4607-9b98-3ea45314d526",
      "Name": "Test User"
    },
    "ModifiedBy": {
      "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
      "Name": "TestUserDC RLP"
    },
    "ExternalId": null,
    "AccountNumber": null,
    "AccountSource": null,
    "AnnualRevenue": null,
    "ChannelProgramLevelName": null,
    "ChannelProgramName": null,
    "Description": null,
    "Fax": null,
    "IsCustomerPortal": false,
    "IsPartner": false,
    "Ownership": null,
    "PhotoUrl": null,
    "Rating": null,
    "Site": null,
    "Type": null,
    "Website": null,
    "Currency": "USD",
    "AdminAuto_AccountId_c": null
  },
  "CancelledDate": null,
  "CompletedDate": null,
  "ConfigurationSyncDate": null,
  "Description": "Goodwire 11",
  "IsTaskPending": false,
  "OrderDate": "2019-01-23T14:11:05",
  "OrderEndDate": "2020-01-21T00:00:00",
  "OrderReferenceNumber": null,
  "OrderStartDate": "2018-09-30T00:00:00",
  "OrderAmount": {
    "Value": 900,
    "DisplayValue": 900,
    "CurrencyCode": "USD",
    "CurrencySymbol": "$"
  },
  "OriginalOrderNumber": "O-00000009",
  "ParentOrder": null,
  "PODate": null,
  "PONumber": "00000009",
  "PriceList": {
    "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
    "CreatedDate": null,
    "ModifiedDate": null,
    "LastModifiedById": null,
    "CreatedById": null,
    "BasedOnAdjustmentAmount": null,
    "BasedOnAdjustmentType": null,
    "Name": "Tier 1 Hardware & Software",
    "Account": null,
    "Currency": null,
    "Active": false,
    "EffectiveDate": null,
    "ExpirationDate": null,
    "BasedOnPriceList": null
  },
  "PricingDate": "2019-01-18T07:31:14",
  "PrimaryContact": {
    "Id": "f2a26fcb-9938-40b3-b821-bb8aced15bd0",
    "CreatedDate": "2022-08-30T07:54:21",
    "ModifiedDate": "2022-08-30T07:54:21",
    "LastModifiedById": null,
    "CreatedById": null,
    "FirstName": "Narayana",
    "LastName": "Bodepudi",
    "Name": "Narayana Bodpudi",
    "Phone": "916574",
    "Email": "nbodepudi@conga.com",
    "MailingAddress": "HYD",
    "MailingStreet": "Ar-street",
    "MailingState": "AR",
    "MailingStateCode": null,
    "MailingCity": "HYD",
    "MailingPostalCode": "99950",
    "MailingCountryCode": "US",
    "MailingCountry": "USA",
    "OtherAddress": "HYD",
    "OtherStreet": "Ar-street",
    "OtherState": "USA",
    "OtherStateCode": null,
    "OtherCity": "HYD",
    "OtherPostalCode": "99950",
    "OtherCountryCode": "US",
    "OtherCountry": "USA",
    "Title": null,
    "CreatedBy": {
      "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
      "Name": "TestUserDC RLP"
    },
    "ModifiedBy": {
      "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
      "Name": "TestUserDC RLP"
    },
    "ExternalId": null,
    "AssistantName": null,
    "AssistantPhone": null,
    "Birthdate": null,
    "Department": null,
    "Description": "string",
    "DoNotCall": false,
    "EmailBouncedDate": "0001-01-01T00:00:00",
    "EmailBouncedReason": null,
    "Fax": null,
    "HasOptedOutOfEmail": false,
    "HasOptedOutOfFax": false,
    "HomePhone": null,
    "IsEmailBounced": false,
    "LeadSource": null,
    "MobilePhone": "916574",
    "OtherPhone": "916574",
    "Owner": null,
    "PhotoUrl": null,
    "Salutation": null
  },
  "ActivatedDate": null,
  "ReadyForBillingDate": "2019-01-23T14:11:08",
  "FulfilledDate": null,
  "ReadyForRevRecDate": null,
  "RelatedOpportunity": null,
  "ShipToAccount": {
    "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
    "CreatedDate": "2022-07-28T04:05:59",
    "ModifiedDate": "2022-08-23T15:41:09",
    "LastModifiedById": null,
    "CreatedById": null,
    "Name": "Test Account",
    "BillingAddress": null,
    "ShippingAddress": "36 China Town",
    "BillingStreet": null,
    "Parent": null,
    "BillingState": null,
    "BillingStateCode": null,
    "BillingCity": null,
    "BillingPostalCode": null,
    "BillingCountry": null,
    "BillingCountryCode": null,
    "ShippingStreet": "Thane",
    "ShippingState": "Mumbai",
    "ShippingStateCode": null,
    "ShippingCity": "Mumbai",
    "ShippingPostalCode": "400001",
    "ShippingCountry": "India",
    "ShippingCountryCode": null,
    "PriceList": {
      "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
      "CreatedDate": null,
      "ModifiedDate": null,
      "LastModifiedById": null,
      "CreatedById": null,
      "BasedOnAdjustmentAmount": null,
      "BasedOnAdjustmentType": null,
      "Name": "Tier 1 Hardware & Software",
      "Account": null,
      "Currency": null,
      "Active": false,
      "EffectiveDate": null,
      "ExpirationDate": null,
      "BasedOnPriceList": null
    },
    "Phone": "9876543210",
    "Owner": null,
    "Industry": null,
    "ChildAccounts": null,
    "AccountLocations": null,
    "CreatedBy": {
      "Id": "de985db7-0c30-4607-9b98-3ea45314d526",
      "Name": "Test User"
    },
    "ModifiedBy": {
      "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
      "Name": "TestUserDC RLP"
    },
    "ExternalId": null,
    "AccountNumber": null,
    "AccountSource": null,
    "AnnualRevenue": null,
    "ChannelProgramLevelName": null,
    "ChannelProgramName": null,
    "Description": null,
    "Fax": null,
    "IsCustomerPortal": false,
    "IsPartner": false,
    "Ownership": null,
    "PhotoUrl": null,
    "Rating": null,
    "Site": null,
    "Type": null,
    "Website": null,
    "Currency": "USD",
    "AdminAuto_AccountId_c": null
  },
  "SoldToAccount": {
    "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
    "CreatedDate": "2022-07-28T04:05:59",
    "ModifiedDate": "2022-08-23T15:41:09",
    "LastModifiedById": null,
    "CreatedById": null,
    "Name": "Test Account",
    "BillingAddress": null,
    "ShippingAddress": "36 China Town",
    "BillingStreet": null,
    "Parent": null,
    "BillingState": null,
    "BillingStateCode": null,
    "BillingCity": null,
    "BillingPostalCode": null,
    "BillingCountry": null,
    "BillingCountryCode": null,
    "ShippingStreet": "Thane",
    "ShippingState": "Mumbai",
    "ShippingStateCode": null,
    "ShippingCity": "Mumbai",
    "ShippingPostalCode": "400001",
    "ShippingCountry": "India",
    "ShippingCountryCode": null,
    "PriceList": {
      "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
      "CreatedDate": null,
      "ModifiedDate": null,
      "LastModifiedById": null,
      "CreatedById": null,
      "BasedOnAdjustmentAmount": null,
      "BasedOnAdjustmentType": null,
      "Name": "Tier 1 Hardware & Software",
      "Account": null,
      "Currency": null,
      "Active": false,
      "EffectiveDate": null,
      "ExpirationDate": null,
      "BasedOnPriceList": null
    },
    "Phone": "9876543210",
    "Owner": null,
    "Industry": null,
    "ChildAccounts": null,
    "AccountLocations": null,
    "AccountNumber": null,
    "AccountSource": null,
    "AnnualRevenue": null,
    "ChannelProgramLevelName": null,
    "ChannelProgramName": null,
    "Description": null,
    "Fax": null,
    "IsCustomerPortal": false,
    "IsPartner": false,
    "Ownership": null,
    "PhotoUrl": null,
    "Rating": null,
    "Site": null,
    "Type": null,
    "Website": null,
    "Currency": "USD",
    "CreatedBy": {
      "Id": "de985db7-0c30-4607-9b98-3ea45314d526",
      "Name": "Test User"
    },
    "ModifiedBy": {
      "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
      "Name": "TestUserDC RLP"
    },
    "ExternalId": null,
    "AdminAuto_AccountId_c": null,
    "TotalCount": "1"
  },
  "Source": "Quote",
  "Status": "Draft",
  "Type": "New",
  "OrderLineItems": [],
  "Attachments": null,
  "Notes": null,
  "Proposal": null,
  "Location": null,
  "Owner": {
    "Id": null,
    "CreatedDate": null,
    "ModifiedDate": null,
    "LastModifiedById": null,
    "CreatedById": null,
    "FirstName": null,
    "LastName": null,
    "Email": null,
    "UserName": null,
    "Alias": null,
    "Name": null
  },
  "Currency": "USD",
  "OwnerId": null,
  "CreatedBy": {
    "Id": "fd25d4d9-5c87-4b66-aece-bacc637de514",
    "CreatedDate": null,
    "ModifiedDate": null,
    "LastModifiedById": null,
    "CreatedById": null,
    "FirstName": null,
    "LastName": null,
    "Email": null,
    "UserName": null,
    "Alias": null,
    "Name": "Test User",
    "LocaleSidKey": null,
    "EmailEncodingKey": null,
    "Language": null,
    "CommunityNickname": null,
    "CountryCode": null,
    "TimeZoneSidKey": null,
    "LastLoginDate": null,
    "CurrencyIsoCode": null,
    "DefaultCurrencyIsoCode": null,
    "Contact": null,
    "ContactId": null,
    "SmallPhotoUrl": null,
    "FullPhotoUrl": null,
    "Locale": null,
    "Currency": null,
    "ExternalId": null
  },
  "PaymentStatus": null,
  "AmendmentEffectiveDate": null,
  "ConfigurationEffectiveDate": null,
  "LegalEntity": null,
  "NextVersion": null,
  "PartnerAccount": null,
  "PaymentTerm": null,
  "PreviousVersion": null,
  "PurchaseId": null,
  "PurchaseOrder": null,
  "ReadyForWorkflow": false,
  "SingleTransactionAdjustment": false,
  "SourceChannel": "Direct",
  "ModifiedBy": {
    "Id": "fd25d4d9-5c87-4b66-aece-bacc637de514",
    "Name": "Test User"
  },
  "ExternalId": null,
  "QuoteAuto_PickList_CstField_c": null,
  "QuoteAuto_String_CstField_c": null,
  "QuoteAuto_Double_CstField_c": null,
  "QuoteAuto_Int_CstField_c": null,
  "QuoteAuto_Boolean_CstField_c": null,
  "QuoteAuto_Currency_CstField_c": null,
  "QuoteAuto_DateTime_CstField_c": null,
  "QuoteAuto_Multipicklist_CstField_c": null,
  "Items": [],
  "TotalCount": "1"
} as unknown as Order;

export const PRODUCT = {
  "Id": "b2aae2a8-2183-4415-a923-573f7b7f9437",
  "CreatedDate": "2022-10-03T17:19:04.1255544Z",
  "ModifiedDate": "2022-10-03T17:19:04.1255544Z",
  "CreatedById": "fd25d4d9-5c87-4b66-aece-bacc637de514",
  "IconId": null,
  "Name": "BOP_Standalone_01",
  "ConfigurationType": "Standalone",
  "Uom": "Each",
  "Description": "BOPTest_01",
  "Family": null,
  "ProductCode": "BOPTest_01",
  "IsActive": true,
  "HasAttributes": false,
  "HasDefaults": false,
  "HasOptions": false,
  "ExpirationDate": "2100-12-31T00:00:00Z",
  "EffectiveDate": "1900-01-01T00:00:00Z",
  "Version": 1,
  "PriceLists": [
    {
      "Id": "63609c9f-1059-437d-8d99-86606ec75fe8",
      "CreatedDate": "2022-10-03T17:30:32.6898263Z",
      "ModifiedDate": "2022-10-03T17:30:32.6898263Z",
      "CreatedById": "fd25d4d9-5c87-4b66-aece-bacc637de514",
      "ExpirationDate": "2100-12-31T00:00:00Z",
      "EffectiveDate": "1900-01-01T00:00:00Z",
      "ContractPrice": null,
      "ListPrice": 100,
      "Active": true,
      "PriceUom": "Each",
      "PriceMethod": "Per Unit",
      "Frequency": "Monthly",
      "ChargeType": "Standard Price",
      "PriceType": "Recurring",
      "DefaultSellingTerm": null,
      "DefaultQuantity": 1,
      "Sequence": null,
      "Taxable": false,
      "TaxInclusive": false,
      "Currency": "USD",
      "ExternalId": null,
      "ModifiedById": "fd25d4d9-5c87-4b66-aece-bacc637de514",
      "Name": "PL2",
      "AllocateGroupAdjustment": true,
      "AllowManualAdjustment": true,
      "AllowPriceRampOverlap": false,
      "AllowProration": false,
      "AutoCascadeQuantity": false,
      "AutoCascadeSellingTerm": false,
      "AutoRenew": false,
      "AutoRenewalTerm": null,
      "AutoRenewalType": null,
      "BillingFrequency": null,
      "BillingRule": null,
      "ContractItemNumber": null,
      "ContractNumber": null,
      "Cost": null,
      "DefaultPriceDatasource": null,
      "DefaultPriceFrom": null,
      "DefaultQuantityDatasource": null,
      "DefaultQuantityFrom": null,
      "Description": "test",
      "DisableAssetIntegration": false,
      "DisableCostModel": false,
      "DisableSyncWithOpportunity": false,
      "EnableCommitment": false,
      "EnableRampCreation": false,
      "HasCriteria": false,
      "IsQuantityReadOnly": false,
      "IsSellingTermReadOnly": false,
      "IsUsageTierModifiable": false,
      "MaxPrice": null,
      "MaxUsageQuantity": null,
      "MinMaxPriceAppliesTo": null,
      "MinPrice": null,
      "MinUsageQuantity": null,
      "PriceIncludedInBundle": false,
      "PriceListId": "03be2060-09d4-4f9c-a6c3-53122326527c",
      "ProductId": "b2aae2a8-2183-4415-a923-573f7b7f9437",
      "RelatedAdjustmentAmount": null,
      "RelatedAdjustmentAmountSourceId": null,
      "RelatedAdjustmentAppliesTo": null,
      "RelatedAdjustmentType": null,
      "RelatedPercent": null,
      "RelatedPercentAppliesTo": null,
      "RollupPriceToBundle": true,
      "SubType": "None",
      "Type": "None",
      "Criteria": {
        "bool": {
          "must_not": [
            {
              "exists": {
                "field": "DEFAULT___PERCOLATOR"
              }
            }
          ]
        }
      },
      "HasWildCards": false
    },
    {
      "Id": "365f9bd8-7aaa-4734-b50a-3dfd7c6c937f",
      "CreatedDate": "2022-10-03T17:30:50.0835884Z",
      "ModifiedDate": "2022-10-03T17:30:50.0835884Z",
      "CreatedById": "fd25d4d9-5c87-4b66-aece-bacc637de514",
      "ExpirationDate": "2100-12-31T00:00:00Z",
      "EffectiveDate": "1900-01-01T00:00:00Z",
      "ContractPrice": null,
      "ListPrice": 100,
      "Active": true,
      "PriceUom": "Each",
      "PriceMethod": "Per Unit",
      "Frequency": "Monthly",
      "ChargeType": "Standard Price",
      "PriceType": "Recurring",
      "DefaultSellingTerm": null,
      "DefaultQuantity": 1,
      "Sequence": null,
      "Taxable": false,
      "TaxInclusive": false,
      "Currency": "USD",
      "ExternalId": null,
      "ModifiedById": "fd25d4d9-5c87-4b66-aece-bacc637de514",
      "Name": "PL2",
      "AllocateGroupAdjustment": true,
      "AllowManualAdjustment": true,
      "AllowPriceRampOverlap": false,
      "AllowProration": false,
      "AutoCascadeQuantity": false,
      "AutoCascadeSellingTerm": false,
      "AutoRenew": false,
      "AutoRenewalTerm": null,
      "AutoRenewalType": null,
      "BillingFrequency": null,
      "BillingRule": null,
      "ContractItemNumber": null,
      "ContractNumber": null,
      "Cost": null,
      "DefaultPriceDatasource": null,
      "DefaultPriceFrom": null,
      "DefaultQuantityDatasource": null,
      "DefaultQuantityFrom": null,
      "Description": "test",
      "DisableAssetIntegration": false,
      "DisableCostModel": false,
      "DisableSyncWithOpportunity": false,
      "EnableCommitment": false,
      "EnableRampCreation": false,
      "HasCriteria": false,
      "IsQuantityReadOnly": false,
      "IsSellingTermReadOnly": false,
      "IsUsageTierModifiable": false,
      "MaxPrice": null,
      "MaxUsageQuantity": null,
      "MinMaxPriceAppliesTo": null,
      "MinPrice": null,
      "MinUsageQuantity": null,
      "PriceIncludedInBundle": false,
      "PriceListId": "03be2060-09d4-4f9c-a6c3-53122326527c",
      "ProductId": "b2aae2a8-2183-4415-a923-573f7b7f9437",
      "RelatedAdjustmentAmount": null,
      "RelatedAdjustmentAmountSourceId": null,
      "RelatedAdjustmentAppliesTo": null,
      "RelatedAdjustmentType": null,
      "RelatedPercent": null,
      "RelatedPercentAppliesTo": null,
      "RollupPriceToBundle": true,
      "SubType": "None",
      "Type": "None",
      "Criteria": {
        "bool": {
          "must_not": [
            {
              "exists": {
                "field": "DEFAULT___PERCOLATOR"
              }
            }
          ]
        }
      },
      "HasWildCards": false
    }
  ],
  "ExternalId": null,
  "ModifiedById": "fd25d4d9-5c87-4b66-aece-bacc637de514",
  "CatAuto_Boolean_CstField_c": null,
  "CatAuto_Currency_CstField_c": null,
  "CatAuto_CustomFieldPickList_c": null,
  "CatAuto_DateTime_CstField_c": null,
  "CatAuto_Double_CstField_c": null,
  "CatAuto_Int_CstField_c": null,
  "CatAuto_Multipicklist_CstField_c": null,
  "CatAuto_String_CstField_c": null,
  "DisplayUrl": null,
  "ExcludeFromSitemap": false,
  "HasSearchAttributes": false,
  "IsCustomizable": true,
  "IsTabViewEnabled": false,
  "ProductType": "Equipment",
  "QuantityUnitOfMeasure": null,
  "RenewalLeadTime": null,
  "StockKeepingUnit": null,
  "_metadata": {
    "error": null
  }
} as unknown as Product;

export const MOCK_CATEGORY = [
  {
    'AncestorId': 'ASZasa123',
    'PrimordialId': null,
    'Description': 'Mock category description',
    'HierarchyId': null,
    'IsLeaf': 'Yes',
    'Label': 'Software',
    'ProductCount': 10,
    'Name': 'Software_Category',
    'Translation': null,
    'IsHidden': false,
    'IncludeInTotalsView': null,
  },
  {
    'AncestorId': 'aQwwqw123',
    'PrimordialId': null,
    'Description': 'Mock category description',
    'HierarchyId': null,
    'IsLeaf': 'Yes',
    'Label': 'Hardware',
    'ProductCount': 10,
    'Name': 'Hardware_Category',
    'Translation': null,
    'IsHidden': false,
    'IncludeInTotalsView': null,
    'Id': 'cat001'
  },
  {
    'AncestorId': null,
    'PrimordialId': null,
    'Description': 'Mock category description',
    'HierarchyId': null,
    'IsLeaf': 'Yes',
    'Label': 'Hardware',
    'ProductCount': 10,
    'Name': 'Hardware_Category',
    'Translation': null,
    'IsHidden': false,
    'IncludeInTotalsView': null,
  },
  {
    'AncestorId': null,
    'PrimordialId': null,
    'Description': 'Mock category description',
    'HierarchyId': null,
    'IsLeaf': 'Yes',
    'Label': 'Hardware',
    'ProductCount': 10,
    'Name': 'Hardware_Category',
    'Translation': null,
    'IsHidden': false,
    'IncludeInTotalsView': null,
    'Id': 'aQwwqw123'
  },
  {
    "Id": "63f47636-6917-4e5d-bb7d-a0457aa87d45",
    "Name": "Spare Parts",
    "Description": "Spare Parts Description",
    "Label": "Spare Parts",
    "LongDescription": "Spare Parts Long Description",
  },
  {
    "Id": "9acfeded-3658-499b-9346-8a3d8f070ebc",
    "AncestorId": null,
    "Description": "Weather Systems Description",
    "HierarchyId": "edf3f6eb-1eeb-4c0e-9970-7cbb62d30892",
    "IsLeaf": true,
    "Label": "Weather Systems",
    "Name": "Weather Systems",
    "IsHidden": false,
    "IncludeInTotalsView": true
  },
  {
    "Id": "be014a2e-c12a-4ef8-8cbd-c082f9df5cfd",
    "AncestorId": null,
    "Description": "Charges Description",
    "HierarchyId": "3c42b477-c44d-4aeb-b06b-8055e6234432",
    "IsLeaf": true,
    "Label": "Charges",
    "Name": "Charges",
    "IsHidden": false,
    "IncludeInTotalsView": true
  }
] as unknown as Array<Category>;

export const MOCK_FILTER = {
  "fieldList": [
    {
      "value": "BillToAccount",
      "label": "Bill To",
      "referenceType": "Account"
    },
    {
      "value": "CreatedDate",
      "label": "CreatedDate"
    },
    {
      "value": "OrderAmount",
      "label": "Order Amount"
    },
    {
      "value": "Status",
      "label": "Status"
    }
  ],
  "conditionList": [
    {
      "condition": {
        "val": null,
        "value": null
      },
      "fieldLabels": [
        {
          "value": "BillToAccount",
          "label": "Bill To",
          "referenceType": "Account"
        },
        {
          "value": "CreatedDate",
          "label": "CreatedDate"
        },
        {
          "value": "OrderAmount",
          "label": "Order Amount"
        },
        {
          "value": "Status",
          "label": "Status"
        }
      ],
      "operatorMap": {
        "Equal": "=",
        "NotEqual": "!=",
        "GreaterThan": ">",
        "LessThan": "<",
        "GreaterEqual": ">=",
        "LessEqual": "<="
      },
      "lookupOptions": {
        "primaryTextField": "Name"
      },
      "val": null
    }
  ],
  "appliedConditions": [],
  "operatorList": [
    "Equal",
    "LessThan",
    "GreaterThan",
    "GreaterEqual",
    "LessEqual",
    "In"
  ],
  "fieldListWithOperators": null
};

export const STOREFRONT = {
  Name: "D-Commerce",
  DefaultPriceList: "tier1",
  Logo: 'logo.png',
  EnableABO: false,
  DefaultAccountforGuestUsers: "guestuser",
  ChannelType: 'Partner Commerce',
  ConfigurationLayout: 'Native',
  EnableTaxCalculations: false,
} as unknown as Storefront;

export const ORDER_MOCK_DATA = {
  'BillToAccount': {
    'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
    'Name': 'Test Account'
  },
  'Items': [],
  'PriceList': {
    'Id': 'c8ab89bb-0d84-4f5b-9743-bcc1995c19b0',
    'Name': 'SecondAccountPL'
  },
  'PrimaryContact': {
    'Id': 'fc73dd60-e630-41b3-af38-b50e499ba310',
    'Name': 'NK_PrimaryContact_Order_02'
  },
  'Proposal': {
    'Id': '1adca967-af2e-4b65-83ca-96123c339234',
    'Name': 'DC Quote Test 1'
  },
  'ShipToAccount': {
    'Id': 'fc1c1ba7-de87-41fb-938d-3eacfde53ff3',
    'Name': 'TESTAVR'
  },
  'SoldToAccount': {
    'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
    'Name': 'Test Account'
  },
  'Id': '14479644-cf0a-4c15-ad04-32eaa6cddeec',
  'Name': 'Order567',
  'CreatedDate': '2022-09-07T07:31:31'
} as unknown as Order;

export const QUOTE_MOCK_DATA = {
  "ABOType": "New",
  "Account": {
    "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
    "Name": "Test Account"
  },
  "Amount": {
    "Value": 100,
    "DisplayValue": 100,
    "CurrencyCode": "USD",
    "CurrencySymbol": "$"
  },
  "ApprovalStage": "Draft",
  "AutoActivateOrder": false,
  "AutoCreateBill": false,
  "AutoCreateRevenue": false,
  "BillToAccount": {
    "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
    "Name": "Test Account"
  },
  "ConfigurationEffectiveDate": "2022-08-29T14:55:00",
  "Currency": "USD",
  "Description": "Test Quote creation",
  "DisableCartVersioning": false,
  "ExpectedEndDate": "2022-08-29T14:55:00",
  "ExpectedStartDate": "2022-08-29T14:55:00",
  "GrandTotal": {
    "Value": 500,
    "DisplayValue": 500,
    "CurrencyCode": "USD",
    "CurrencySymbol": "$"
  },
  "IsAutoAccepted": false,
  "IsPrimary": true,
  "IsSystemGenerated": false,
  "IsTaskPending": false,
  "NetAmount": {
    "Value": 400,
    "DisplayValue": 400,
    "CurrencyCode": "USD",
    "CurrencySymbol": "$"
  },
  "ProposalPaymentTerm": "Net 30 Days",
  "PriceList": {
    "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
    "Name": "Tier 1 Hardware & Software"
  },
  "PrimaryContact": {
    "Id": "fc73dd60-e630-41b3-af38-b50e499ba310",
    "Name": "NK_PrimaryContact_Order_02"
  },
  "ProposalCategory": "Quote",
  "ProposalName": "Test Quote DC_QA",
  "RFPResponseDueDate": "2022-08-29T14:55:00",
  "ShipToAccount": {
    "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
    "Name": "Test Account"
  },
  "SingleTransactionAdjustment": false,
  "SourceChannel": "Direct",
  "SyncAssetChangesToQuote": true,
  "UseType": "Main",
  "Id": "2e289395-42b1-42b8-8263-147f53c61487",
  "Name": "Test Quote DC QA",
  "CreatedBy": {
    "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
    "Name": "TestUserDC RLP"
  },
  "CreatedDate": "2022-08-30T11:25:13",
  "ModifiedBy": {
    "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
    "Name": "TestUserDC RLP"
  },
  "ModifiedDate": "2022-08-30T11:37:27"
} as unknown as Quote;

const accountValue = new Account();
accountValue.Parent = null;
accountValue.Industry = "Retail";
accountValue.Phone = 555555;
accountValue.ShippingCountryCode = "US";;
accountValue.ShippingStateCode = "SC";
accountValue.ShippingCountry = "United States";
accountValue.ShippingPostalCode = "29910";
accountValue.ShippingState = "South Carolina";
accountValue.ShippingCity = "CA";
accountValue.ShippingAddress = {
  city: "867 main",
  country: "India",
  countryCode: '570023',
  geocodeAccuracy: 456,
  latitude: 0,
  longitude: 0,
  postalCode: '123',
  state: 'Karnataka',
  stateCode: '123',
  street: 'street1'
};
accountValue.ShippingStreet = "9841 Cedar St.";
accountValue.BillingCountryCode = "US";
accountValue.BillingStateCode = "AZ";
accountValue.BillingCountry = "United States";
accountValue.BillingPostalCode = "85705";
accountValue.BillingState = "Arizona";
accountValue.BillingCity = "CA";
accountValue.BillingAddress = {
  city: "1234 main",
  country: "India",
  countryCode: '570023',
  geocodeAccuracy: 456,
  latitude: 0,
  longitude: 0,
  postalCode: '123',
  state: 'Karnataka',
  stateCode: '123',
  street: 'street1'
};
accountValue.PriceList = {
  Id: '12345'
} as unknown as PriceList;
accountValue.BillingStreet = "799 E DRAGRAM SUITE 5A";
accountValue.Name = "ABC Corporation Pcom";
accountValue.Id = "546";

export { accountValue }


export const ACCOUNT_LOOKUP = [
  {
    "Name": "AutomationTestAccount",
    "AccountNumber": null,
    "AccountSource": null,
    "AnnualRevenue": null,
    "BillingAddress": null,
    "BillingCity": null,
    "BillingCountry": null,
    "BillingCountryCode": null,
    "BillingPostalCode": null,
    "BillingState": null,
    "BillingStreet": null,
    "ChannelProgramLevelName": null,
    "ChannelProgramName": null,
    "Description": null,
    "Fax": null,
    "Industry": null,
    "IsCustomerPortal": false,
    "IsPartner": false,
    "Owner": null,
    "Ownership": null,
    "Parent": null,
    "Phone": null,
    "PhotoUrl": null,
    "Rating": null,
    "ShippingAddress": null,
    "ShippingCity": null,
    "ShippingCountry": null,
    "ShippingCountryCode": null,
    "ShippingPostalCode": null,
    "ShippingState": null,
    "ShippingStreet": null,
    "Site": null,
    "Type": null,
    "Website": null,
    "Currency": "USD",
    "PriceList": null,
    "Id": "ffcc058e-b8ef-4e55-bb8c-3f04df488cfe",
    "CreatedBy": {
      "Id": "ddfec712-8827-4684-8287-1373e4f1f43d",
      "Name": "Conga User"
    },
    "CreatedDate": "2022-07-20T06:49:12",
    "ModifiedBy": {
      "Id": "27634e3f-904a-4321-9ce5-c2edbe181d90",
      "Name": "Test User"
    },
    "ModifiedDate": "2022-08-05T07:38:39",
    "ExternalId": null,
    "AdminAuto_AccountId_c": null
  },
  {
    "Name": "AutomationTestAccount",
    "AccountNumber": null,
    "AccountSource": null,
    "AnnualRevenue": null,
    "BillingAddress": null,
    "BillingCity": null,
    "BillingCountry": null,
    "BillingCountryCode": null,
    "BillingPostalCode": null,
    "BillingState": null,
    "BillingStreet": null,
    "ChannelProgramLevelName": null,
    "ChannelProgramName": null,
    "Description": null,
    "Fax": null,
    "Industry": null,
    "IsCustomerPortal": false,
    "IsPartner": false,
    "Owner": null,
    "Ownership": null,
    "Parent": null,
    "Phone": null,
    "PhotoUrl": null,
    "Rating": null,
    "ShippingAddress": null,
    "ShippingCity": null,
    "ShippingCountry": null,
    "ShippingCountryCode": null,
    "ShippingPostalCode": null,
    "ShippingState": null,
    "ShippingStreet": null,
    "Site": null,
    "Type": null,
    "Website": null,
    "Currency": "USD",
    "PriceList": null,
    "Id": "ffb6ed74-3eae-4a80-8f11-dc29ddeefe5a",
    "CreatedBy": {
      "Id": "ddfec712-8827-4684-8287-1373e4f1f43d",
      "Name": "Conga User"
    },
    "CreatedDate": "2022-07-26T12:29:47",
    "ModifiedBy": {
      "Id": "ddfec712-8827-4684-8287-1373e4f1f43d",
      "Name": "Conga User"
    },
    "ModifiedDate": "2022-07-26T12:29:47",
    "ExternalId": null,
    "AdminAuto_AccountId_c": null
  },
  {
    "11": null,
    "Name": "Auto_BundleOption_Account001",
    "Id": "ff49acd8-dc2a-46b3-aab4-94a149fa1bce",
    "CreatedBy": {
      "Id": "27634e3f-904a-4321-9ce5-c2edbe181d90",
      "Name": "Test User"
    },
    "CreatedDate": "2022-10-17T06:35:21",
    "ModifiedBy": {
      "Id": "27634e3f-904a-4321-9ce5-c2edbe181d90",
      "Name": "Test User"
    },
    "ModifiedDate": "2022-10-17T06:35:21",
    "ExternalId": null,
    "AccountNumber": null,
    "AccountSource": null,
    "AnnualRevenue": null,
    "BillingAddress": null,
    "BillingCity": null,
    "BillingCountry": null,
    "BillingCountryCode": null,
    "BillingPostalCode": null,
    "BillingState": null,
    "BillingStreet": null,
    "ChannelProgramLevelName": null,
    "ChannelProgramName": null,
    "Description": null,
    "Fax": null,
    "Industry": null,
    "IsCustomerPortal": false,
    "IsPartner": false,
    "Owner": null,
    "Ownership": null,
    "Parent": null,
    "Phone": null,
    "PhotoUrl": null,
    "Rating": null,
    "ShippingAddress": null,
    "ShippingCity": null,
    "ShippingCountry": null,
    "ShippingCountryCode": null,
    "ShippingPostalCode": null,
    "ShippingState": null,
    "ShippingStreet": null,
    "Site": null,
    "Type": null,
    "Website": null,
    "Currency": "USD",
    "AdminAuto_AccountId_c": null,
    "PriceList": null,
    "pageg": null,
    "Congasfdaf": null
  },
  {
    "11": null,
    "Name": "Auto_ActiveCart_Account_01",
    "AccountNumber": null,
    "AccountSource": null,
    "AnnualRevenue": null,
    "BillingAddress": null,
    "BillingCity": null,
    "BillingCountry": null,
    "BillingCountryCode": null,
    "BillingPostalCode": null,
    "BillingState": null,
    "BillingStreet": null,
    "ChannelProgramLevelName": null,
    "ChannelProgramName": null,
    "Description": null,
    "Fax": null,
    "Industry": null,
    "IsCustomerPortal": false,
    "IsPartner": false,
    "Owner": null,
    "Ownership": null,
    "Parent": null,
    "Phone": null,
    "PhotoUrl": null,
    "Rating": null,
    "ShippingAddress": null,
    "ShippingCity": null,
    "ShippingCountry": null,
    "ShippingCountryCode": null,
    "ShippingPostalCode": null,
    "ShippingState": null,
    "ShippingStreet": null,
    "Site": null,
    "Type": null,
    "Website": null,
    "Currency": "USD",
    "PriceList": null,
    "Id": "ff086d71-0b5b-4bbd-9b60-ca7877b7209e",
    "CreatedBy": {
      "Id": "27634e3f-904a-4321-9ce5-c2edbe181d90",
      "Name": "Test User"
    },
    "CreatedDate": "2022-10-03T03:47:25",
    "ModifiedBy": {
      "Id": "27634e3f-904a-4321-9ce5-c2edbe181d90",
      "Name": "Test User"
    },
    "ModifiedDate": "2022-10-03T03:47:25",
    "ExternalId": null,
    "AdminAuto_AccountId_c": null,
    "pageg": null,
    "Congasfdaf": null
  }
]