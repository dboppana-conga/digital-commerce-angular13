import { Order, QuoteLineItem } from "../../classes/index";
import { FilterOperator } from "@congacommerce/core"
import { Account, Contact, FieldFilter } from "@congacommerce/ecommerce";
import { OrderPayload } from "@congacommerce/ecommerce";
import * as moment from "moment";
import { CartItem } from "../../../cart";
import { Quote } from "../../classes";
import { QuoteResult } from "../../services";

/** @ignore */
const _moment = moment;

/**
 * @ignore
 */
export const orderMockData =[{
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


},
{

    'BillToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account'
    },
    
    'PriceList': {
        'Id': '62ad6108-6abc-465c-b137-3bd3327a2fe6',
        'Name': 'Tier 1 Hardware & Software'
    },
    'PrimaryContact': {
        'Id': 'fc73dd60-e630-41b3-af38-b50e499ba310',
        'Name': 'NK_PrimaryContact_Order_02'
    },
    'Proposal': {
        'Id': '4eac0c2d-b88f-4261-b0b6-785a913e4e9f',
        'Name': 'Test Quote DC QA'
    },
    'ShipToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account'
    },
    'SoldToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account'
    },
    'Id': '1bfdd963-63d8-40b9-8cf8-8ef3a1742fcd',
    'Name': 'O-00000001',
    'CreatedDate': '2022-09-07T07:31:31'
},
{
    'BillToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account QA'
    },
    'PriceList': {
        'Id': '62ad6108-6abc-465c-b137-3bd3327a2fe6',
        'Name': 'Tier 1 Hardware & Software'
    },
    'PrimaryContact': {
        'Id': 'fc73dd60-e630-41b3-af38-b50e499ba310',
        'Name': 'NK_PrimaryContact_Order_02 QA'
    },
    'Proposal': {
        'Id': '4eac0c2d-b88f-4261-b0b6-785a913e4e9f',
        'Name': 'Test Quote DC QA'
    },
    'ShipToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account QA'
    },
    'SoldToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account'
    },
    'Id': '1bfdd963-63d8-40b9-8cf8-8ef3a1742fcd',
    'Name': 'O-00000001',
    'CreatedDate': '2022-09-07T07:31:31'
}] as unknown as Array<Order>

/**
 * @ignore
 */
export const orderWithLineItems={
    'BillToAccount': {
        'Id': 'fde85522-0d1b-48d1-932d-dc368f521b30',
        'Name': 'Kirsch Pharma'
    },
    'PriceList': {
        'Id': 'cbc75112-60e9-47b2-a632-f70d5912b70f',
        'Name': 'Tier 1 Hardware & Software'
    },
    'PrimaryContact': {
        'Id': 'cfcdfebd-b7f3-4417-a24d-8edffa0704c1',
        'Name': 'Marc Benioff'
    },
    'ShipToAccount': {
        'Id': 'c1d05a85-26b9-4033-b698-2b8f51e96b2d',
        'Name': 'Alpha Corporation'
    },
    'SoldToAccount': {
        'Id': 'c1d05a85-26b9-4033-b698-2b8f51e96b2d',
        'Name': 'Alpha Corporation'
    },
    'Id': 'f399a819-2650-444a-b741-c9fd74b60284',
    'Name': 'Order-Test Quote DC UI',
    'CreatedDate': '2022-09-12T11:47:50',
    'Status': 'Confirmed',
    'Proposal':{
        'Id': '3301a78f-8c99-46df-b4cd-ca064e0f4003',
        'Name': 'DC Alpha Quote'
    },
    'Items': [
        {
           'Order': {
                'Id': 'f399a819-2650-444a-b741-c9fd74b60284',
                'Name': 'Order-Test Quote DC UI'
            },
            'Product': {
                'Id': '48c0445e-ebf0-4daa-9570-a28f73d8cc07',
                'Name': '1410-16 Switch'
            }
        },
        {
            'Order': {
                'Id': 'f399a819-2650-444a-b741-c9fd74b60284',
                'Name': 'Order-Test Quote DC UI'
            },
            'Product': {
                'Id': '78632016-c9b7-432e-a709-93b029633550',
                'Name': '10622 G2 Shock Rack'
            }
        }
    ]
} as unknown as Order

export const items=[
        {
           'Order': {
                'Id': 'f399a819-2650-444a-b741-c9fd74b60284',
                'Name': 'Order-Test Quote DC UI'
            },
            'Product': {
                'Id': '48c0445e-ebf0-4daa-9570-a28f73d8cc07',
                'Name': '1410-16 Switch'
            }
        },
        {
            'Order': {
                'Id': 'f399a819-2650-444a-b741-c9fd74b60284',
                'Name': 'Order-Test Quote DC UI'
            },
            'Product': {
                'Id': '78632016-c9b7-432e-a709-93b029633550',
                'Name': '10622 G2 Shock Rack'
            }
        }
    ] as unknown as CartItem
/**
 * @ignore
 */
export const filter =
      [{
        field: 'SoldToAccount.Id',
        value: '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        filterOperator: FilterOperator.EQUAL
      },
     ] as Array<FieldFilter>;


/**
 * @ignore
 */
export const last7DaysFilter =[
    {
        field: 'CreatedDate',
        value: _moment().format("YYYY-MM-DD"),
        filterOperator: FilterOperator.LESS_EQUAL
      },
      {
        field:'CreatedDate', 
        value: _moment().subtract(6,'days').format("YYYY-MM-DD"),
        filterOperator: FilterOperator.GREATER_EQUAL
      }
] as unknown as Array<FieldFilter>;


/**
 * @ignore
 */
export const payload : OrderPayload= { 
    'PrimaryContact': {
        'Id': 'fc73dd60-e630-41b3-af38-b50e499ba310',
        'Name': 'NK_PrimaryContact_Order_02 QA'
     } as unknown as Contact,
     'Description': 'ABC Opportunity', 
    'ShipToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account QA'
     } as unknown as Account,
    'BillToAccount': {
        'Id': '9396d9be-68c2-4bfb-8168-bffa7781d00c',
        'Name': 'Test Account QA'
    } as unknown as Account
};

export const quoteMockData = [
    {
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
    },
    {
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
        "ApprovalStage": "Approved",
        "AutoActivateOrder": false,
        "AutoCreateBill": false,
        "AutoCreateRevenue": false,
        "BillingPreference": null,
        "BillToAccount": {
            "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
            "Name": "Test Account"
        },
        "ConfigurationEffectiveDate": "2022-08-29T14:55:00",
        "ConfigurationFinalizedDate": null,
        "ConfigurationSyncDate": null,
        "Currency": "USD",
        "Description": "Test Quote creation",
        "DisableCartVersioning": false,
        "DiscountPercent": null,
        "ExpectedEndDate": "2022-08-29T14:55:00",
        "ExpectedStartDate": "2022-08-29T14:55:00",
        "GrandTotal": {
            "Value": 500,
            "DisplayValue": 500,
            "CurrencyCode": "USD",
            "CurrencySymbol": "$"
        },
        "Intent": null,
        "InternalDeadline": null,
        "IsAutoAccepted": false,
        "IsPrimary": true,
        "IsSystemGenerated": false,
        "IsTaskPending": false,
        "LegalEntity": null,
        "Location": null,
        "NetAmount": {
            "Value": 400,
            "DisplayValue": 400,
            "CurrencyCode": "USD",
            "CurrencySymbol": "$"
        },
        "Opportunity": null,
        "ParentProposal": null,
        "PartnerAccount": null,
        "ProposalPaymentTerm": "Net 30 Days",
        "PaymentTerm": null,
        "PODate": null,
        "PONumber": null,
        "PresentedDate": null,
        "PriceList": {
            "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
            "Name": "Tier 1 Hardware & Software"
        },
        "PricingDate": null,
        "PrimaryContact": {
            "Id": "fc73dd60-e630-41b3-af38-b50e499ba310",
            "Name": "NK_PrimaryContact_Order_02"
        },
        "ProposalApprovalDate": null,
        "ProposalCategory": "Quote",
        "ProposalExpirationDate": null,
        "ProposalName": "Test Quote DC_QA",
        "PurchaseId": null,
        "QTCProfile": null,
        "ReadyForActivationDate": null,
        "ReadyForBillingDate": null,
        "ReadyForFulfillmentDate": null,
        "ReadyForRevRecDate": null,
        "ReadyToGenerate": true,
        "ReadyToPresent": true,
        "RelatedProposal": null,
        "RFPIntakeDate": null,
        "RFPResponseDueDate": "2022-09-29T14:55:00",
        "RFPStage": null,
        "RFPValue": null,
        "RiskFactors": null,
        "SalesTaxAmount": null,
        "SalesTaxPercent": null,
        "ShippingHandling": null,
        "ShipToAccount": {
            "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
            "Name": "Test Account"
        },
        "SingleTransactionAdjustment": false,
        "SourceChannel": "Direct",
        "SpecialTerms": null,
        "StrategicImportance": null,
        "SyncAssetChangesToQuote": true,
        "UseType": "Main",
        "ValidUntilDate": null,
        "Id": "337f9e6d-96c0-45ec-8e35-0ef6c40b3f10",
        "Name": "Test Quote DC QA",
        "CreatedBy": {
            "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
            "Name": "TestUserDC RLP"
        },
        "CreatedDate": "2022-09-01T07:55:55",
        "ModifiedBy": {
            "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
            "Name": "TestUserDC RLP"
        },
        "ModifiedDate": "2022-09-01T08:20:22",
        "ExternalId": null,
        "QuoteAuto_PickList_CstField_c": null,
        "QuoteAuto_String_CstField_c": null,
        "QuoteAuto_Double_CstField_c": null,
        "QuoteAuto_Int_CstField_c": null,
        "QuoteAuto_Boolean_CstField_c": null,
        "QuoteAuto_Currency_CstField_c": null,
        "QuoteAuto_DateTime_CstField_c": null,
        "QuoteAuto_Multipicklist_CstField_c": null
    },
    {
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
        "ApprovalStage": "Generated",
        "AutoActivateOrder": false,
        "AutoCreateBill": false,
        "AutoCreateRevenue": false,
        "BillingPreference": null,
        "BillToAccount": {
            "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
            "Name": "Test Account"
        },
        "ConfigurationEffectiveDate": "2022-08-29T14:55:00",
        "ConfigurationFinalizedDate": null,
        "ConfigurationSyncDate": null,
        "Currency": "USD",
        "Description": "Test Quote creation",
        "DisableCartVersioning": false,
        "DiscountPercent": null,
        "ExpectedEndDate": "2022-08-29T14:55:00",
        "ExpectedStartDate": "2022-08-29T14:55:00",
        "GrandTotal": {
            "Value": 500,
            "DisplayValue": 500,
            "CurrencyCode": "USD",
            "CurrencySymbol": "$"
        },
        "Intent": null,
        "InternalDeadline": null,
        "IsAutoAccepted": false,
        "IsPrimary": true,
        "IsSystemGenerated": false,
        "IsTaskPending": false,
        "LegalEntity": null,
        "Location": null,
        "NetAmount": {
            "Value": 400,
            "DisplayValue": 400,
            "CurrencyCode": "USD",
            "CurrencySymbol": "$"
        },
        "Opportunity": null,
        "ParentProposal": null,
        "PartnerAccount": null,
        "ProposalPaymentTerm": "Net 30 Days",
        "PaymentTerm": null,
        "PODate": null,
        "PONumber": null,
        "PresentedDate": null,
        "PriceList": {
            "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
            "Name": "Tier 1 Hardware & Software"
        },
        "PricingDate": null,
        "PrimaryContact": {
            "Id": "fc73dd60-e630-41b3-af38-b50e499ba310",
            "Name": "NK_PrimaryContact_Order_02"
        },
        "ProposalApprovalDate": null,
        "ProposalCategory": "Quote",
        "ProposalExpirationDate": null,
        "ProposalName": "Test Quote DC_QA",
        "PurchaseId": null,
        "QTCProfile": null,
        "ReadyForActivationDate": null,
        "ReadyForBillingDate": null,
        "ReadyForFulfillmentDate": null,
        "ReadyForRevRecDate": null,
        "ReadyToGenerate": true,
        "ReadyToPresent": true,
        "RelatedProposal": null,
        "RFPIntakeDate": null,
        "RFPResponseDueDate": "2022-08-29T14:55:00",
        "RFPStage": null,
        "RFPValue": null,
        "RiskFactors": null,
        "SalesTaxAmount": null,
        "SalesTaxPercent": null,
        "ShippingHandling": null,
        "ShipToAccount": {
            "Id": "9396d9be-68c2-4bfb-8168-bffa7781d00c",
            "Name": "Test Account"
        },
        "SingleTransactionAdjustment": false,
        "SourceChannel": "Direct",
        "SpecialTerms": null,
        "StrategicImportance": null,
        "SyncAssetChangesToQuote": true,
        "UseType": "Main",
        "ValidUntilDate": null,
        "Id": "c22fc083-9380-4bf8-ac5a-a3ac5b4472c8",
        "Name": "Test Quote DC QA",
        "CreatedBy": {
            "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
            "Name": "TestUserDC RLP"
        },
        "CreatedDate": "2022-08-30T11:42:12",
        "ModifiedBy": {
            "Id": "89761836-4d5e-4716-a320-764fedf7c0e8",
            "Name": "TestUserDC RLP"
        },
        "ModifiedDate": "2022-09-01T08:25:34",
        "ExternalId": null,
        "QuoteAuto_PickList_CstField_c": null,
        "QuoteAuto_String_CstField_c": null,
        "QuoteAuto_Double_CstField_c": null,
        "QuoteAuto_Int_CstField_c": null,
        "QuoteAuto_Boolean_CstField_c": null,
        "QuoteAuto_Currency_CstField_c": null,
        "QuoteAuto_DateTime_CstField_c": null,
        "QuoteAuto_Multipicklist_CstField_c": null
    }
] as unknown as Array<Quote>;
export const quoteWithLineItem = {
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
    'Items': [
        {
            'Order': {
                'Id': 'f399a819-2650-444a-b741-c9fd74b60284',
                'Name': 'Order-Test Quote DC UI'
            },
            'Product': {
                'Id': '48c0445e-ebf0-4daa-9570-a28f73d8cc07',
                'Name': '1410-16 Switch'
            }
        },
        {
            'Order': {
                'Id': 'f399a819-2650-444a-b741-c9fd74b60284',
                'Name': 'Order-Test Quote DC UI'
            },
            'Product': {
                'Id': '78632016-c9b7-432e-a709-93b029633550',
                'Name': '10622 G2 Shock Rack'
            }
        }
    ],
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
export const mockQuoteResult = {
    'QuoteList': quoteMockData,
    'TotalRecord': 3
} as unknown as QuoteResult