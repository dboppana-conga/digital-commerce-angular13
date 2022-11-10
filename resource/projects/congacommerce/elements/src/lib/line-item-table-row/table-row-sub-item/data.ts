import { Storefront, Cart, CartItem, AssetLineItemExtended } from "@congacommerce/ecommerce";
import { Observable, of, Subscription } from "rxjs";
import { Pipe, PipeTransform } from '@angular/core';
import { CartItemView } from "dist/congacommerce/elements/lib/line-item-table-row/interfaces/line-item-view.interface";

@Pipe({
    name: 'translate'
  })
  export class TranslatePipeMock implements PipeTransform {
    public name = 'translate';
  
    public transform(data: string): any {
      return data;
    }
  }

export const storefront=
{
    "ImageUrl": "https://i.imgur.com/x7vZome.png",
    "Channel": "Partner Commerce",
    "Id": "d65c3ea5-de8e-4c5f-9451-d28526bb22c4",
    "Name": "ECommerce",
    "ModifiedDate": "2022-08-30T03:01:14",
    "ExternalId": null,
    "Currency": "USD",
    "AdminAuto_CustomCurrenyField_c_c": null,
    "AdminAuto_CustomStringField_c": null,
    "TotalCount": "1"
} as unknown as Storefront

export const CARTS = {
    "Id": "aEIOU123",
    "OwnerId": "005R0000005OT2UIAW",
    "IsDeleted": false,
    "Taxable": false,
    "Name": "a1I790000007Vdq",
    "CurrencyIsoCode": "USD",
    "AccountId": "0011900000hnGsrAAE",
    "BusinessObjectId": "a3K79000002DeHQEA0",
    "BusinessObjectType": "Favorite Configuration",
    "IsPricePending": true,
    "IsTransient": true,
    "PriceListId": "a171T000005il1XQAQ",
    "Status": "New",
    "SummaryGroups__r": "",
    "hasErrors": false,
    "LineItems":[
        {
            "LineType": "Product/Service",
            "IsTaxable": false,
            "LineNumber": 1,
            "IncentiveAdjustmentAmount":"19",
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000881660",
            "Configuration":{
                "Id": "T1H&S"
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
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            }
    }
],
"Order":"123order",
} as unknown as Cart;

export const CARTS2 = {
    "Id": "aEIOU123",
    "OwnerId": "005R0000005OT2UIAW",
    "IsDeleted": false,
    "Taxable": true,
    "Proposal":"123quote",
    "Frequency":"17"
} as unknown as Cart;

export const carts2= new Cart();
carts2.IsPricePending= true;

export const carts3= new Cart();
carts3.IsPricePending= true;

export const cartItem2 = [
    {
        "LineType": "Product/Service",
        "IsTaxable": false,
        "LineNumber": 1,
        "HasOptions": false,
        "PrimaryLineNumber": 1,
        "Frequency": "One Time",
        "Name": "LI-0000881660",
        "Configuration":{
            "Id": "T1H&S"
        },
        "Quantity": 1,
        "StartDate": "2022-06-15",
        "CreatedById": "005R0000005OT2UIAW",
        "ConfigStatus": "NA",
        "EndDate": "1999-06-15",
        "CurrencyIsoCode": "USD",
        "Product":{
            "Id": "01t2h000002BFwpAAG",
            "IconId": '..........'
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
        "PriceList": {
            "Id": "a171T000005il1XQAQ"
        }
},
    {
        "LineType": "Option",
        "ListPrice":40,
        "IsTaxable": true,
        "LineNumber": 1,
        "HasOptions": false,
        "PrimaryLineNumber": 1,
        "Frequency": "One Time",
        "Name": "LI-0000875660",
        "Configuration": {
            "Id": ""
        },
        "Quantity": 2,
        "StartDate": "2022-06-15",
        "CreatedById": "005R0000098UR2UIAW",
        "ConfigStatus": "NA",
        "EndDate": null,
        "Product": {
            "Id": "01t2h000002BFwpAAG"
        },
        "Option": {
            "Id": "01t2h000002BFwpAAG"
        },
        "Id": "a1379000000SUYlAAO",
        "SellingTerm": 1,
        "IsOptionRollupLine": true,
        "ConstraintCheckStatus": "NA",
        "IsPrimaryLine": true,
        "HasAttributes": true,
        "ProductVersion": 1,
        "PricingStatus": "Pending",
        "LineStatus": "New",
        "BaseExtendedPrice": 120,
        "ParentBundleNumber": 1,
        "PriceList": {
            "Id": "a171T000005il1XQAQ"
        },
        "PriceListItem": {
            "ListPrice": 40
        }
    }
] as unknown as Array<CartItem>

export const value= {
    "LineType": "Product/Service",
    "IsTaxable": false,
    "LineNumber": 1,
    "HasOptions": false,
    "IsOptionRollupLine":true,
    "IncentiveAdjustmentAmount":10,
    "PrimaryLineNumber": 1,
    "Frequency": "One Time",
    "Name": "LI-0000881660",
    "Configuration":{
        "Id": "T1H&S"
    },
    "Quantity": 19,
    "StartDate": "2022-06-15",
    "CreatedById": "005R0000005OT2UIAW",
    "ConfigStatus": "NA",
    "EndDate": "1999-06-15",
    "CurrencyIsoCode": "USD",
    "Product":{
        "Id": "01t2h000002BFwpAAG",
        "IconId":"nnnn"
    },
    "Id": "a1379000000SUYlAAO",
    "SellingTerm": 1,
    "ConstraintCheckStatus": "NA",
    "IsPrimaryLine": true,
    "HasAttributes": true,
    "ProductVersion": 1,
    "PricingStatus": "New",
    "LineStatus": "New",
    "PriceList": {
        "Id": "a171T000005il1XQAQ"
    }
} as unknown as CartItem;

export const value2= new CartItem()
value2.LineNumber=1;
value2.IncentiveAdjustmentAmount='100';
value2.AssetLineItem={} as unknown as AssetLineItemExtended
value2.TotalQuantity=200;
value2.Frequency='17';

export const value3= new CartItem()
value3.LineNumber=1;
value3.IncentiveAdjustmentAmount='100';
value3.AssetLineItem={} as unknown as AssetLineItemExtended
value3.Quantity=8;
value3.ItemSequence=1;

export const value4= new CartItem()
value4.Id='qwertt';
value4.LineNumber=1;
value4.IncentiveAdjustmentAmount='100';
value4.AssetLineItem={} as unknown as AssetLineItemExtended
value4.TotalQuantity=200;
value4.IsOptionRollupLine=true;

export const cartItem3 ={
    id: 'string1',
    fieldName: 'stringValue1',
    label: 'string1',
    ItemSequence:1

} as unknown as CartItem

export const cartItemView2={
    id: 'string',
    fieldName: 'stringValue',
    label: 'string',
    sequence: 1,
    isSelected: true,
    isEditable: true

} as unknown as CartItem

export const cartItemView: CartItemView={
    id: 'string',
    fieldName: 'stringValue',
    label: 'string',
    sequence: 1,
    isSelected: true,
    isEditable: true

} 

