
import { OrderLineItem, Order, QuoteLineItem, Quote } from '../../order/classes/index';
import { Product, ProductAttributeValue, ProductAttribute, ProductOptionComponent } from '../../catalog/classes/index';
import { PriceListItem, PriceMatrix, Price, PriceRule, PriceRuleEntry, PriceMatrixEntry, PriceDimension, PriceList, SummaryGroup } from '../../pricing/classes/index';
import { Cart } from '../../cart/classes/cart.model';
import { CartItem } from '../../cart/classes/cart-item.model';
import { AssetLineItem } from '../../abo/classes/asset-item.model';
import { CurrencyType } from '../classes/currency-type.model';
import { Storefront } from "../../store/classes/storefront.model";
import { User } from "../../crm/classes/user.model";
import { cart } from 'projects/partner-commerce/src/app/modules/carts/test/data';

export const productOptionComponent = {
    "ComponentProduct": {
        "Name": "BundleProduct_1",
        "Id": "7212b171-71a9-491d-b054-0bfb98f6d192",
        "Description": "BundleProduct with 1 Option Group and 1 Option",
        "IsActive": true,
        "HasDefaults": false,
        "RenewalLeadTime": null,
        "StockKeepingUnit": null,
        "IsTabViewEnabled": false,
        "HasAttributes": true,
        "Version": 1.0,
        "DiscontinuedDate": null,
        "ConfigurationType": "Bundle",
        "DisplayUrl": null,
        "HasSearchAttributes": false,
        "ProductCode": "PTU30TCAL",
        "ProductType": "Subscription",
        "ImageURL": "https://store.vaisala.com/servlet/servlet.FileDownload?file=0152p00000790M1AAI",
        "ExcludeFromSitemap": false,
        "Uom": "Each",
        "ExpirationDate": "1900-12-31T00:00:00Z",
        "QuantityUnitOfMeasure": null,
        "HasOptions": true,
        "Family": "Maintenance-HW",
        "EffectiveStartDate": null,
        "LaunchDate": null,
        "EffectiveDate": "1900-01-01T00:00:00Z",
        "IsCustomizable": false
    } as unknown as Product

} as unknown as ProductOptionComponent

export const cartItem = {
    "NetPrice": 1000,
    "value": 1,
    "value2": 10,
    "array": ['a', 'b', 'c']
} as unknown as CartItem

export const cartItem2 = [
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
        "ItemSequence": 1,
        "ParentBundleNumber": 1,
        "PriceList": {
            "Id": "a171T000005il1XQAQ"
        },
        "PriceListItem": {
            "ListPrice": 40
        }
    }
] as unknown as CartItem

export const cartItem3=  {
    "LineType": "Product/Service",
    "ListPrice":40,
    "IsTaxable": false,
    "LineNumber": 1,
    "HasOptions": false,
    "PrimaryLineNumber": 1,
    "Frequency": "One Time",
    "Name": "LI-0000881660",
    "Configuration": {
        "Id": "testid"
    },
    "Quantity": 1,
    "StartDate": "2022-06-15",
    "CreatedById": "005R0000005OT2UIAW",
    "ConfigStatus": "NA",
    "EndDate": "1999-06-15",
    "CurrencyIsoCode": "USD",
    "BaseExtendedPrice": 220,
    "Product": {
        "Id": "01t2h000002BFwpAAG"
    },
    "Id": "a1379000000SUYlAAO",
    "SellingTerm": 1,
    "IsOptionRollupLine": true,
    "ConstraintCheckStatus": "NA",
    "IsPrimaryLine": true,
    "HasAttributes": true,
    "ProductVersion": 1,
    "PricingStatus": "New",
    "LineStatus": "New",
    "ItemSequence": 1,
    "PriceList": {
        "Id": "a171T000005il1XQAQ"
    },
    "PriceListItem": {
        "ListPrice": 30
    },
} as unknown as CartItem

export const assetItem = {
    "NetPrice": 100,
    "AssetStatus": "New",
} as unknown as AssetLineItem

export const assetItem1 = [{
    "NetPrice": 100,
    "AssetStatus": "New",
}] as unknown as AssetLineItem

export const quoteItem = {
    "NetPrice": 10,
    "Taxable": true,
    "TaxBreakups": [
        {
            "TaxAmount": 1000
        }
    ]
} as unknown as QuoteLineItem

export const quoteItem1 = {
    "NetPrice": 10,
    "Taxable": false,
    "TaxBreakups": [
        {
            "TaxAmount": 1000
        }
    ]
} as unknown as QuoteLineItem

export const orderItem = {
    "NetPrice": 0,
    "BasePrice": 10,
    "Taxable": true,
    "OrderTaxBreakups": [
        {
            "TaxAmount": 1000
        }
    ]
} as unknown as OrderLineItem

const orderItem3= new OrderLineItem();
orderItem3.NetPrice=0;
orderItem3.BasePrice=10;
orderItem3.Taxable=true

export const orderItem1 = {
    "NetPrice": 200,
    "BasePrice": 10,
    "Taxable": false,
    "OrderTaxBreakups": [
        {
            "TaxAmount": 100
        }
    ]
} as unknown as OrderLineItem

export const conversion = {
    "ConversionRate": 0.1,
    "DecimalPlaces": 2,
    "IsActive": true,
    "IsCorporate": false,
    "IsoCode": 'USD'
} as unknown as CurrencyType

export const conversion3 = {
    "ConversionRate": null,
    "DecimalPlaces": 2,
    "IsActive": true,
    "IsCorporate": false,
    "IsoCode": 'USD'
} as unknown as CurrencyType

export const storefront =
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
        "TotalCount": "1",
        "EnableTaxCalculations": true,
        "CurrencyTypes": {
            "ConversionRate": 0.1,
            "DecimalPlaces": 2,
            "IsActive": true,
            "IsCorporate": false,
            "IsoCode": 'USD'
        } as unknown as CurrencyType
    } as unknown as Storefront;

export const storefront1 =
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
        "TotalCount": "1",
        "EnableTaxCalculations": true,
    } as unknown as Storefront;

export const orderWithLineItems = {
    'OrderLineItems': [
        {
            "LineType": "Product/Service",
            "IsTaxable": false,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000881660",
            "Configuration": {
                "Id": "testid"
            },
            "Quantity": 1,
            "StartDate": "2022-06-15",
            "CreatedById": "005R0000005OT2UIAW",
            "ConfigStatus": "NA",
            "EndDate": "1999-06-15",
            "CurrencyIsoCode": "USD",
            "BaseExtendedPrice": 220,
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
            "PricingStatus": "New",
            "LineStatus": "New",
            "ItemSequence": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 30
            },
        },
        {
            "LineType": "Option",
            "IsTaxable": true,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000875660",
            "Configuration": {
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
            "Option": {
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
            "BaseExtendedPrice": 120,
            "ItemSequence": 1,
            "ParentBundleNumber": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 40
            }
        }
    ]
} as unknown as Order

export const orderWithLineItems2 = {
    'OrderLineItems': [
        {
            "LineType": "Misc",
            "IsTaxable": false,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000881660",
            "Configuration": {
                "Id": "testid"
            },
            "Quantity": 1,
            "StartDate": "2022-06-15",
            "CreatedById": "005R0000005OT2UIAW",
            "ConfigStatus": "NA",
            "EndDate": "1999-06-15",
            "CurrencyIsoCode": "USD",
            "BaseExtendedPrice": 220,
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
            "PricingStatus": "New",
            "LineStatus": "New",
            "ItemSequence": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 30
            },
        }
    ]
} as unknown as Order

export const orderWithLineItems1 = {
    'OrderLineItems': [
        {
            "LineType": "Option",
            "IsTaxable": false,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000881660",
            "Configuration": {
                "Id": "testid"
            },
            "Quantity": 1,
            "StartDate": "2022-06-15",
            "CreatedById": "005R0000005OT2UIAW",
            "ConfigStatus": "NA",
            "EndDate": "1999-06-15",
            "CurrencyIsoCode": "USD",
            "BaseExtendedPrice": 220,
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
            "PricingStatus": "New",
            "LineStatus": "New",
            "ItemSequence": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 30
            },
            "PriceType": "Usage"
        }
    ]
} as unknown as Order

export const quoteWithLineItems1 = {
    'QuoteLineItems': [
        {
            "LineType": "Option",
            "IsTaxable": false,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000881660",
            "Configuration": {
                "Id": "testid"
            },
            "Quantity": 1,
            "StartDate": "2022-06-15",
            "CreatedById": "005R0000005OT2UIAW",
            "ConfigStatus": "NA",
            "EndDate": "1999-06-15",
            "CurrencyIsoCode": "USD",
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
            "PricingStatus": "New",
            "LineStatus": "New",
            "ItemSequence": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 30
            },
            "PriceType": "Usage"
        }
    ]
} as unknown as Quote

export const quoteWithLineItems = {
    'QuoteLineItems': [
        {
            "LineType": "Product/Service",
            "IsTaxable": false,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000881660",
            "Configuration": {
                "Id": "testid"
            },
            "Quantity": 1,
            "StartDate": "2022-06-15",
            "CreatedById": "005R0000005OT2UIAW",
            "ConfigStatus": "NA",
            "EndDate": "1999-06-15",
            "CurrencyIsoCode": "USD",
            "BaseExtendedPrice": 220,
            "Product": {
                "Id": "01t2h000002BFwpAAG"
            },
            "Id": "a1379000000SUYlAAO",
            "SellingTerm": 1,
            "IsOptionRollupLine": false,
            "ConstraintCheckStatus": "NA",
            "IsPrimaryLine": true,
            "HasAttributes": true,
            "ExtendedPrice": 220,
            "ProductVersion": 1,
            "PricingStatus": "New",
            "LineStatus": "New",
            "ItemSequence": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 30
            },
        },
        {
            "LineType": "Option",
            "IsTaxable": true,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000875660",
            "Configuration": {
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
            "Option": {
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
            "BaseExtendedPrice": 120,
            "ItemSequence": 1,
            "ParentBundleNumber": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 40
            }
        }
    ]
} as unknown as Quote

export const quoteWithLineItems2 = {
    'QuoteLineItems': [
        {
            "LineType": "Misc",
            "IsTaxable": false,
            "LineNumber": 1,
            "HasOptions": false,
            "PrimaryLineNumber": 1,
            "Frequency": "One Time",
            "Name": "LI-0000881660",
            "Configuration": {
                "Id": "testid"
            },
            "Quantity": 1,
            "StartDate": "2022-06-15",
            "CreatedById": "005R0000005OT2UIAW",
            "ConfigStatus": "NA",
            "EndDate": "1999-06-15",
            "CurrencyIsoCode": "USD",
            "BaseExtendedPrice": 220,
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
            "PricingStatus": "New",
            "LineStatus": "New",
            "ItemSequence": 1,
            "PriceList": {
                "Id": "a171T000005il1XQAQ"
            },
            "PriceListItem": {
                "ListPrice": 30
            },
        }
    ]
} as unknown as Quote

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
    "SummaryGroups": [
        {
            "AdHocGroupDescription": null,
            "AdjustedPrice": 1799,
            "AdjustmentAmount": null,
            "AdjustmentType": null,
            "AllowableAction": null,
            "AllowManualAdjustment": true,
            "AllowRemoval": null,
            "BaseExtendedCost": 0,
            "BaseExtendedPrice": 999,
            "ClassificationId": null,
            "ChargeType": "Installation Fee",
            "Comments": null,
            "ConfigurationId": "09dd9699-4a04-4b1c-8cd3-4fd510a3af8a",
            "DeltaPrice": 1799,
            "Description": "Subtotal - Installation Fee (Monthly)",
            "ExtendedCost": 0,
            "ExtendedListPrice": 1799,
            "ExtendedPrice": 1799,
            "ExtendedRollupPrice": 1799,
            "Frequency": "Monthly",
            "GroupAdjustmentPercent": null,
            "HasIncentives": null,
            "IncentiveCode": null,
            "IsPrimaryLine": null,
            "ItemSequence": 1,
            "LineNumber": 1,
            "LineType": "Subtotal",
            "NetAdjustmentPercent": 0,
            "NetPrice": 1799,
            "OptionCost": 0,
            "OptionPrice": 800,
            "PriceAdjustment": 0,
            "PriceAdjustmentAmount": null,
            "PriceAdjustmentType": null,
            "RulesetName": null,
            "GroupType": "Category",
            "CreatedById": null,
            "CreatedDate": null,
            "Id": "c9bd0e2b-534f-4276-9e24-974e72e9889a",
            "ModifiedById": null,
            "ModifiedDate": null,
            "Name": "Subtotal - Installation Fee (Monthly)",
            "Currency": null,
            "ExternalId": "264e3625-8c91-4d32-9e3b-877f70e468fb",
            "Digest": "d14ae1dcd651c7ec32ca93faf0c6deec05d9de5cb67f98e70770e1a3ea23211e"
        },
        {
            "AdHocGroupDescription": null,
            "AdjustedPrice": 1799,
            "AdjustmentAmount": null,
            "AdjustmentType": null,
            "AllowableAction": null,
            "AllowManualAdjustment": true,
            "AllowRemoval": null,
            "BaseExtendedCost": 0,
            "BaseExtendedPrice": 999,
            "ClassificationId": null,
            "ChargeType": null,
            "Comments": null,
            "ConfigurationId": "09dd9699-4a04-4b1c-8cd3-4fd510a3af8a",
            "DeltaPrice": 1799,
            "Description": "Grand Total",
            "ExtendedCost": 0,
            "ExtendedListPrice": 1799,
            "ExtendedPrice": 1799,
            "ExtendedRollupPrice": 1799,
            "Frequency": null,
            "GroupAdjustmentPercent": null,
            "HasIncentives": null,
            "IncentiveCode": null,
            "IsPrimaryLine": null,
            "ItemSequence": 3,
            "LineNumber": 3,
            "LineType": "Grand Total",
            "NetAdjustmentPercent": 0,
            "NetPrice": 1799,
            "OptionCost": 0,
            "OptionPrice": 800,
            "PriceAdjustment": 0,
            "PriceAdjustmentAmount": null,
            "PriceAdjustmentType": null,
            "RulesetName": null,
            "GroupType": "Category",
            "CreatedById": null,
            "CreatedDate": null,
            "Id": "34115579-97a6-4d09-bc6b-dd9d1e0af4e2",
            "ModifiedById": null,
            "ModifiedDate": null,
            "Name": "Grand Total",
            "Currency": null,
            "ExternalId": "ccafa2df-4933-454b-98dd-ef7ff99115b7",
            "Digest": "2cc553ed7829de49293b8ce93081d299788959fbc4fd9709b8a58dc7ae28273b"
        }
    ]
} as unknown as Cart;

export const CARTS = {
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
    "SummaryGroups": [
    ]
} as unknown as Cart;

export const priceMatrixValue = [{
    "StopProcessingMoreMatrices": false,
    "MatrixEntries": {
        "AdjustmentAmount": 1
    } as unknown as PriceMatrixEntry
},
{
    "StopProcessingMoreMatrices": false,
    "MatrixEntries": {
        "AdjustmentAmount": 1
    } as unknown as PriceMatrixEntry
},
{
    "StopProcessingMoreMatrices": true,
    "MatrixEntries": {
        "AdjustmentAmount": 10
    } as unknown as PriceMatrixEntry
},
{
    "StopProcessingMoreMatrices": true,
    "MatrixEntries": {
        "AdjustmentAmount": 10
    } as unknown as PriceMatrixEntry
}] as unknown as PriceMatrix[]

export const priceMatrixValue1 = [{
    "StopProcessingMoreMatrices": false,
},
{
    "StopProcessingMoreMatrices": false,
    "MatrixEntries": {
        "AdjustmentAmount": 1
    } as unknown as PriceMatrixEntry
}
] as unknown as PriceMatrix[]

export const priceValue = {
    "netPrice": 100,
    "basePrice": 200
} as unknown as Price

export const productattribute = {
    "Product Attribute": "product1",
    "LineItem": "product1"
} as unknown as ProductAttributeValue

export const priceRuleValue = [{
    "AdjustmentAmount": 99,
    "AdjustmentType": "List Price Override"
}] as unknown as PriceMatrixEntry[]

export const priceRuleValue1 = [{
    "AdjustmentAmount": 99,
    "AdjustmentType": "none"
}] as unknown as PriceMatrixEntry[]

export const priceMatrixValue3 =
    {
        "StopProcessingMoreMatrices": false,
        "MatrixEntries": [{
            "AdjustmentAmount": 1
        }] as unknown as PriceMatrixEntry,
        "Dimension1": {
            "ContextType": "Line Item",
            "BusinessObject": "Apttus_Config2__LineItem__c",
            "Datasource": "Product",
            "Value": "test"
        } as unknown as PriceDimension
    } as unknown as PriceMatrix

export const priceMatrixValue4 =
    {
        "StopProcessingMoreMatrices": false,
        "MatrixEntries": [{
            "AdjustmentAmount": 1
        }] as unknown as PriceMatrixEntry,
        "Dimension1": {
            "BusinessObject": "Apttus_Config2__LineItem__c",
            "Datasource": "Product",
            "Value": "test"
        } as unknown as PriceDimension
    } as unknown as PriceMatrix

export const priceMatrixValue5 =
    {
        "StopProcessingMoreMatrices": false,
        "MatrixEntries": [{
            "AdjustmentAmount": 1
        }] as unknown as PriceMatrixEntry,
        "Dimension1": {
            "ContextType": "Order Line Item",
            "BusinessObject": "Apttus_Config2__LineItem__c",
            "Datasource": "Product",
            "Value": "test"
        } as unknown as PriceDimension
    } as unknown as PriceMatrix

export const priceMatrixValue2 =
    {
        "StopProcessingMoreMatrices": false,
        "MatrixEntries": {
            "AdjustmentAmount": 1
        } as unknown as PriceMatrixEntry,
        "Dimension1": {
            "ContextType": "Product Attribute",
            "BusinessObject": "Test",
            "Datasource": "Product Attribute"

        } as unknown as PriceDimension
    } as unknown as PriceMatrix

export const pricelist = {
    "Id": "c3bf4844-1e42-4e4b-881c-2263950a71b8",
    "ExpirationDate": "2100-12-31",
    "IsActive": true,
    "EffectiveDate": "2021-12-31T00:00:00Z",
    "ChargeType": "Standard Price"
} as unknown as PriceList

export const productValue =
    {
        "IsCustomizable": false,
        "PriceLists": [{
            "PriceListId": "c3bf4844-1e42-4e4b-881c-2263950a71b8",
            "ExpirationDate": "2100-12-31",
            "IsActive": true,
            "EffectiveDate": "2021-12-31T00:00:00Z",
            "ChargeType": "Subscription Fee",
            "ListPrice": 70
        },
        {
            "PriceListId": "c3bf4844-1e42-4e4b-881c-2263950a71b8",
            "ExpirationDate": "2100-12-31",
            "IsActive": true,
            "EffectiveDate": "2021-12-31T00:00:00Z",
            "ChargeType": "Standard Price",
            "ListPrice": 70
        }]
    } as unknown as Product

export const productValue1 =
    {
        "IsCustomizable": false,
        "PriceLists": [
            {
                "PriceListId": "c3bf4844-1e42-4e4b-881c-2263950a71b8",
                "ExpirationDate": "2100-12-31",
                "IsActive": true,
                "EffectiveDate": "2021-12-31T00:00:00Z",
                "ChargeType": "Subscription Fee",
                "ListPrice": 70
            }]
    } as unknown as Product

export const productValue2 =
    {
        "IsCustomizable": false,
        "PriceLists": [
            {
                "PriceListId": "c3bf4844-1e42-4e4b-881c-2263950a71b8",
                "ExpirationDate": "2100-12-31",
                "IsActive": true,
                "EffectiveDate": "2021-12-31T00:00:00Z",
                "ListPrice": 70
            }]
    } as unknown as Product

export const productAttribute = {
    "Field": "Product"
} as unknown as ProductAttribute

export const Users = {
    "FirstName": "test",
    "LastName": "user",
    "Email": "testuser@conga.com",
    "Alias": "guest",
    "Name": "testuser",
    "LocaleSidKey": "en_US",
    "EmailEncodingKey": "UTF-8",
    "Language": "en_US",
    "CountryCode": "US",
    "TimeZoneSidKey": "testusercom",
    "CurrencyIsoCode": "USD",
    "DefaultCurrencyIsoCode": "USD"
} as unknown as User;

export const conversion1 = [{
    "ConversionRate": 0.1,
    "DecimalPlaces": 2,
    "IsActive": true,
    "IsCorporate": false,
    "IsoCode": 'USD'
}] as unknown as Array<CurrencyType>

export const conversion2 = [{
    "ConversionRate": 0.1,
    "DecimalPlaces": 2,
    "IsActive": true,
    "IsCorporate": false,
    "IsoCode": 'IND'
}] as unknown as Array<CurrencyType>

const CARTS2 = new Cart()
CARTS2.Id = 'aEIOU';
CARTS2.Name = 'a1I790000007Vdq';
CARTS2.BusinessObjectId = 'a3K79000002DeHQEA0';
CARTS2.BusinessObjectType = 'Digital Commerce';
CARTS2.IsPricePending = true;
CARTS2.IsTransient = true;
CARTS2.Status = 'New';
CARTS2.hasErrors = true;
CARTS2.SummaryGroups = [
    {
        "BaseExtendedCost": 0,
        "BaseExtendedPrice": 999,
        "ChargeType": "Installation Fee",
        "ExtendedCost": 0,
        "ExtendedListPrice": 1799,
        "ExtendedPrice": 1799,
        "ExtendedRollupPrice": 1799,
        "LineNumber": 1,
        "LineType": "Adjustment",
        "NetPrice": 1799,
        "OptionCost": 0,
        "OptionPrice": 800
    } as unknown as SummaryGroup,
    {
        "AdjustedPrice": 1799,
        "AdjustmentAmount": null,
        "AdjustmentType": null,
        "AllowableAction": null,
        "AllowManualAdjustment": true,
        "AllowRemoval": null,
        "BaseExtendedCost": 0,
        "BaseExtendedPrice": 999,
        "ClassificationId": null,
        "ChargeType": null,
        "Comments": null,
        "ConfigurationId": "09dd9699-4a04-4b1c-8cd3-4fd510a3af8a",
        "DeltaPrice": 1799,
        "Description": "Grand Total",
        "ExtendedCost": 0,
        "ExtendedListPrice": 1799,
        "ExtendedPrice": 1799,
        "ExtendedRollupPrice": 1799,
        "Frequency": null,
        "GroupAdjustmentPercent": null,
        "HasIncentives": null,
        "IncentiveCode": null,
        "IsPrimaryLine": null,
        "ItemSequence": 3,
        "LineNumber": 3,
        "LineType": "Grand Total",
        "NetAdjustmentPercent": 0,
        "NetPrice": 1799,
        "OptionCost": 0,
        "OptionPrice": 800,
        "PriceAdjustment": 0,
        "PriceAdjustmentAmount": null,
        "PriceAdjustmentType": null,
        "RulesetName": null,
        "GroupType": "Category",
        "CreatedById": null,
        "CreatedDate": null,
        "Id": "34115579-97a6-4d09-bc6b-dd9d1e0af4e2",
        "ModifiedById": null,
        "ModifiedDate": null,
        "Name": "Grand Total",
        "Currency": null,
        "ExternalId": "ccafa2df-4933-454b-98dd-ef7ff99115b7",
        "Digest": "2cc553ed7829de49293b8ce93081d299788959fbc4fd9709b8a58dc7ae28273b"
    } as unknown as SummaryGroup
]

export { CARTS2, orderItem3 }

export const ACTIVE_PRICE_LIST = {
    "Id": "62ad6108-6abc-465c-b137-3bd3327a2fe6",
    "CreatedDate": "2022-06-09T06:59:46",
    "ModifiedDate": "2022-07-22T09:13:39",
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
    "BasedOnPriceList": undefined,
    "ContractNumber": null,
    "CostModel": null,
    "Description": null,
    "DisableCurrencyAdjustment": false,
    "IsActive": true,
    "Type": "Standard",
    "CreatedBy": {
        "Id": "de985db7-0c30-4607-9b98-3ea45314d526",
        "Name": "TestUser1 User"
    },
    "ModifiedBy": {
        "Id": "de985db7-0c30-4607-9b98-3ea45314d526",
        "Name": "Test User"
    },
    "ExternalId": null,
    "CustomProperties": {
        "AdminAuto_CustomStringField_c": null,
        "CatAuto_PriceListId_c": {
            "ValueKind": 3
        },
        "CatAuto_CategoryId_c": null
    },
    "TotalCount": "1"
} as unknown as PriceList;

