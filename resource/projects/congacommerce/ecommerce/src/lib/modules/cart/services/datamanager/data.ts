import { Cart } from '../../classes/cart.model';
import { CartItem } from '../../classes/cart-item.model';
import { FieldFilter, CartResult } from '@congacommerce/ecommerce';


/**
 * @ignore
 */
export const CARTITEMS = [
    {
        "LineType": "Product/Service",
        "IsTaxable": false,
        "LineNumber": 1,
        "HasOptions": false,
        "PrimaryLineNumber": 1,
        "Frequency": "One Time",
        "Name": "LI-0000881660",
        "Configuration":{
            "Id": ""
        },
        "Quantity": 1,
        "StartDate": "2022-06-15",
        "CreatedById": "005R0000005OT2UIAW",
        "ConfigStatus": "NA",
        "EndDate": "1999-06-15",
        "CurrencyIsoCode": "USD",
        "Product":{
            "Id": "01t2h000002BFwpAAG"
        },
        "Id": "a1379000000SUYlAAO",
        "SellingTerm": 1,
        "IsOptionRollupLine": false,
        "ConstraintCheckStatus": "NA",
        "IsPrimaryLine": true,
        "HasAttributes": true,
        "ProductVersion": 1,
        "PricingStatus": "New",
        "LineStatus": "New",
        "ItemSequence": 1,
        "PriceList": {
            "Id": "a171T000005il1XQAQ"
        }
    },
    {
        "LineType": "Option",
        "IsTaxable": true,
        "LineNumber": 1,
        "HasOptions": false,
        "PrimaryLineNumber": 1,
        "Frequency": "One Time",
        "Name": "LI-0000875660",
        "Configuration":{
            "Id": ""
        },
        "Quantity": 1,
        "StartDate": "2022-06-15",
        "CreatedById": "005R0000098UR2UIAW",
        "ConfigStatus": "NA",
        "EndDate": null,
        "Product": {
            "Id": "01t2h000002BFwpAAG"
        },
        "Id": "a1379000000SUYlAAO",
        "SellingTerm": 1,
        "IsOptionRollupLine": false,
        "ConstraintCheckStatus": "NA",
        "IsPrimaryLine": true,
        "HasAttributes": true,
        "ProductVersion": 1,
        "PricingStatus": "Pending",
        "LineStatus": "New",
        "ItemSequence": 1,
        "ParentBundleNumber" :1,
        "PriceList": {
            "Id": "a171T000005il1XQAQ"
        }
    }
] as Array<CartItem>;


/**
 * @ignore
 */
export const CARTS = {
    "Id": "aEIOU",
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
    "SummaryGroups__r": "",
    "hasErrors": false
} as unknown as Cart;

export const CARTS1 = {
    "Id": "aEIOU",
    "OwnerId": "005R0000005OT2UIAW",
    "IsDeleted": false,
    "Name": "a1I790000007Vdq",
    "CurrencyIsoCode": "USD",
    "AccountId": "0011900000hnGsrAAE",
    "BusinessObjectId": "a3K79000002DeHQEA0",
    "BusinessObjectType": "Digital Commerce",
    "IsPricePending": true,
    "IsTransient": true,
    "PriceListId": "a171T000005il1XQAQ",
    "Status": "New",
    "SummaryGroups__r": "",
    "hasErrors": true,
    "errors":[{
     "message":"Pricing Failed"
    
    }]
} as unknown as Cart;

export const CARTLISTRESULT={
  Cartlist:[  {
        "Id": "aEIOU",
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
    },
    {
        "Id": "aEIOUTHREE",
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
    }],
    'TotalCount': 2
 } as unknown as CartResult;

export const fieldFilter=[
    {
        "field": "Account.Id",
        "value": "c1d05a85-26b9-4033-b698-2b8f51e96b2d",
        "filterOperator": "eq"
    },
    {
        "field": "Status",
        "value": "Saved",
        "filterOperator": "noteq"
    }
] as unknown as Array<FieldFilter>