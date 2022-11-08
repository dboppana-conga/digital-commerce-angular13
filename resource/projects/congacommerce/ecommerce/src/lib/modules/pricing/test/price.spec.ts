import { TestBed } from "@angular/core/testing";
import { ApttusModule, ApiService, AObjectService, MetadataService } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { PriceListService } from '../../pricing/services/price-list.service';
import { PriceService, Adjustment } from '../../pricing/services/price.service';
import { PriceMatrixService } from '../../pricing/services/price-matrix.service';
import { CartService } from '../../cart/services/cart.service';
import { PriceListItemService } from '../../pricing/services/price-list-item.service';
import { ProductAttributeValueService } from '../../catalog/services/product-attribute.service';
import { StorefrontService } from '../../store/services/storefront.service';
import { ConversionService } from '../../pricing/services/conversion.service';
import { LocalCurrencyPipe } from '../pipes/convert.pipe';
import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { get } from 'lodash';
import { Price } from '../../pricing/classes/index';
import {
    productOptionComponent, cartItem, assetItem, quoteItem, quoteItem1, orderItem, orderItem1, priceMatrixValue, priceValue, productattribute, priceRuleValue1, priceMatrixValue3,
    conversion, priceMatrixValue1, storefront, orderWithLineItems, orderWithLineItems1, quoteWithLineItems, quoteWithLineItems1, CARTS1, CARTS, priceMatrixValue2, priceRuleValue,
    pricelist, productValue, productAttribute, CARTS2, conversion3, orderWithLineItems2, quoteWithLineItems2, priceMatrixValue4, priceMatrixValue5 , cartItem2, cartItem3, orderItem3, assetItem1
} from "./dataManager";

describe('PriceService', () => {
    let priceObject: Price;
    let service: PriceService;
    let mSpy= jasmine.createSpyObj(MetadataService,['getKeyName']);
    let pmSpy= jasmine.createSpyObj<PriceMatrixService>(['getPriceMatrixData']);
    pmSpy.getPriceMatrixData.and.returnValue(of([priceMatrixValue3]))
    let httpMock: HttpTestingController;
    let cSpy = jasmine.createSpyObj<ConversionService>(['getCurrencyTypeForPricelist']);
    let cartSpy = jasmine.createSpyObj<CartService>(['getMyCart']);
    let sfSpy = jasmine.createSpyObj<StorefrontService>(['getStorefront', 'getDeferredPrice']);
    sfSpy.getDeferredPrice.and.returnValue(of(false));
    let plSpy = jasmine.createSpyObj<PriceListService>(['isPricelistId', 'refreshPriceList', 'getPriceListId', 'getEffectivePriceListId','getPriceList'])
    plSpy.getPriceListId.and.returnValue(of('null'))
    plSpy.getPriceList.and.returnValue(of(pricelist))
    let apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    apiSpy.refreshToken.and.returnValue(of(null));
    let aOSpy = jasmine.createSpyObj<AObjectService>(['describe'])

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [PriceService, PriceMatrixService, CartService, PriceListItemService, ProductAttributeValueService,
                LocalCurrencyPipe, CurrencyPipe,
                { provide: ConversionService, useValue: cSpy },
                { provide: PriceListService, useValue: plSpy },
                { provide: ApiService, useValue: apiSpy },
                { provide: AObjectService, useValue: aOSpy },
                { provide: StorefrontService, useValue: sfSpy },
                { provide: CartService, useValue: cartSpy },
                { provide: PriceMatrixService, useValue: pmSpy},
                { provide: MetadataService, useValue: mSpy}],

        });

        service = TestBed.inject(PriceService)
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('adjustValue() calcuates the adjustment amount for a line item based on its adjustment type', () => {
        let value: any;
        value = PriceService.adjustValue(10, Adjustment.PER_DISCOUNT, 10);
        expect(value).toEqual(9)
        value = PriceService.adjustValue(10, Adjustment.DISCOUNT_AMOUNT, 10);
        expect(value).toEqual(0)
        value = PriceService.adjustValue(10, Adjustment.PER_MARKUP, 10);
        expect(value).toEqual(11)
        value = PriceService.adjustValue(10, Adjustment.MARKUP_AMT, 10);
        expect(value).toEqual(20)
        value = PriceService.adjustValue(10, Adjustment.PRICE_FACTOR, 10);
        expect(value).toEqual(100)
        value = PriceService.adjustValue(10, Adjustment.LIST_PRICE_OVERRIDE, 10);
        expect(value).toEqual(10)

    });

    it('getOptionAdjustmentPrice calcuates the adjustment amount for a line item based on its adjustment type', () => {
        let value: any;
        spyOn(service, 'getProductPrice').and.returnValue(of(null))
        value = service.getOptionAdjustmentPrice(productOptionComponent);
        value.pipe(take(1)).subscribe(c => {
            expect(c).toBeNull()
        })
    });

    it('getRollupItemPrice calcuates the value', () => {
        let value: any;
        value = service.getRollupItemPrice(cartItem);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(cartItem.NetPrice)
        })
        value = service.getRollupItemPrice(assetItem);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(assetItem.NetPrice)
        })
        value = service.getRollupItemPrice(quoteItem);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(quoteItem.NetPrice)
        })
        value = service.getRollupItemPrice(orderItem);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(orderItem.NetPrice)
        })
    });

    it('validateEntry returns false when attrType, attrValue are not provided', () => {
        let value: any;
        value = service['validateEntry'](null, null, 100);
        expect(value).toBeFalse();
    });

    it('validateEntry returns false when attrType is Discrete and  attrValue is not equal to expectedValue; else returns true', () => {
        let value: any;
        value = service['validateEntry']('Discrete', 10, 100);
        expect(value).toBeFalse();
        value = service['validateEntry']('Discrete', 100, 100);
        expect(value).toBeTrue();
    });

    it('validateEntry returns false when attrType is Range and attrValue is not less than expectedValue; else returns true', () => {
        let value: any;
        value = service['validateEntry']('Range', 10, 100);
        expect(value).toBeTrue();
        value = service['validateEntry']('Range', 1000, 100);
        expect(value).toBeFalse();
    });

    it('convertCurrency returns value based on the conversionrate', () => {
        let value: any;
        cSpy.getCurrencyTypeForPricelist.and.returnValue(of(conversion))
        value = service['convertCurrency'](100);
        expect(value).toEqual(10)
    });

    it('convertCurrency returns value based on the conversionrate', () => {
        let value: any;
        cSpy.getCurrencyTypeForPricelist.and.returnValue(of(conversion3))
        value = service['convertCurrency'](100);
        expect(value).toEqual(100)
    });

    it('getOrderLineItemPrice returns sum of netprice + Tax ammount from ordertax amount when taxable and enabletaxcalculations is set as true; else just returns netprice value', () => {
        let value: any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        value = service.getOrderLineItemPrice(orderItem);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(1000);
        })
        value = service.getOrderLineItemPrice(orderItem1);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(200);
        })
    });

    it('getQuoteLineItemPrice returns sum of netprice + Tax ammount from ordertax amount when taxable and enabletaxcalculations is set as true; else just returns netprice value', () => {
        let value: any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        value = service.getQuoteLineItemPrice(quoteItem);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(1010);
        })
        value = service.getQuoteLineItemPrice(quoteItem1);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(10);
        })
    });

    it('getOrderPrice returns order object price', () => {
        let value: any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        value = service.getOrderPrice(orderWithLineItems);
        value.pipe(take(1)).subscribe(c => {
            expect(c.listPrice).toEqual(30);// is updated with pricelistitems's listprice when linetype is not equal to MISC
            expect(c.listExtendedPrice).toEqual(0);
        })
        value = service.getOrderPrice(orderWithLineItems1);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(0);
            expect(c.listPrice).toEqual(0);
            expect(c.listExtendedPrice).toEqual(0);
            expect(c.baseExtendedPrice).toEqual(220);
        })
    });

    it('getOrderPrice returns order object price, linetype is misc', () => {
        let value: any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        value = service.getOrderPrice(orderWithLineItems2);
        value.pipe(take(1)).subscribe(c => {
            expect(c.listPrice).toEqual(0);
            expect(c.listExtendedPrice).toEqual(0);
        })
    });

    it('getQuotePrice returns order object price', () => {
        let value: any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        value = service.getQuotePrice(quoteWithLineItems);
        value.pipe(take(1)).subscribe(c => {
            expect(c.listPrice).toEqual(30);// is updated with pricelistitems's listprive when linetype is not equal to MISC
            expect(c.listExtendedPrice).toEqual(0);
            expect(c.baseExtendedPrice).toEqual(220);
        })
        value = service.getQuotePrice(quoteWithLineItems1);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(0);
            expect(c.listPrice).toEqual(0);
            expect(c.listExtendedPrice).toEqual(0);
        })
    });

    it('getQuotePrice returns order object price; linetype as misc', () => {
        let value: any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        value = service.getQuotePrice(quoteWithLineItems2);
        value.pipe(take(1)).subscribe(c => {
            expect(c.listPrice).toEqual(0);
            expect(c.listExtendedPrice).toEqual(0);
            expect(c.baseExtendedPrice).toEqual(0);
        })
    });

    it('getCartPrice returns cart object price when Summarygroups has linetype as Grandtotal', () => {
        let value: any;
        let price = get(CARTS1.SummaryGroups[1], 'OptionPrice') + CARTS1.SummaryGroups[0].BaseExtendedPrice;
        value = service.getCartPrice(of(CARTS1));
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(get(CARTS1.SummaryGroups[1], 'NetPrice'))
            expect(c.baseExtendedPrice).toEqual(price)
        })
    });

    it('getCartPrice returns cart object price when Summarygroups has linetype as Grandtotal; by passing cart object', () => {
        let value: any;
        value = service.getCartPrice(CARTS2);
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(get(CARTS2.SummaryGroups[1], 'NetPrice'))
            expect(c.baseExtendedPrice).toEqual(800)
        })
    });

    it('getCartPrice returns cart object price when Summarygroups has linetype as Grandtotal; without passing the cart object', () => {
        let value: any;
        let price = get(CARTS1.SummaryGroups[1], 'OptionPrice') + CARTS1.SummaryGroups[0].BaseExtendedPrice;
        cartSpy.getMyCart.and.returnValue(of(CARTS1))
        value = service.getCartPrice();
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(get(CARTS1.SummaryGroups[1], 'NetPrice'))
            expect(c.baseExtendedPrice).toEqual(price)
        })
    });

    it('getCartPrice returns cart object observable price as null when Summarygroups does not have linetype as Grandtotal', () => {
        let value: any;
        value = service.getCartPrice(of(CARTS));
        value.pipe(take(1)).subscribe(c => {
            expect(c.netPrice).toEqual(0)
            expect(c.baseExtendedPrice).toEqual(0)
        })
    });

    it('matrixAdjustment processes the entries when [0].MatrixEntries is not null ', () => {
        spyOn<any>(service, 'processEntries');
        service['matrixAdjustment'](priceValue, priceMatrixValue, 1, productattribute, cartItem);
        expect(service['processEntries']).toHaveBeenCalledTimes(3)
    });

    it('matrixAdjustment does not process the entries when [0].MatrixEntries is null ', () => {
        spyOn<any>(service, 'processEntries');
        service['matrixAdjustment'](priceValue, priceMatrixValue1, 1, productattribute, cartItem);
        expect(service['processEntries']).toHaveBeenCalledTimes(0)// when [0].MatrixEntries is null it does not go inside the fumction
    });

    it('validateCriteria returns true when criteria string is not passed ', () => {
        let value: any;
        value = service['validateCriteria'](null,cartItem);
        expect(value).toBeTrue();
    });

    it('validateCriteria returns false when sobjectname string is not equal to LineItem', () => {
        let value: any;
        value = service['validateCriteria']('{"AineItem":"1"}',cartItem);
        expect(value).toBeFalse();
    });

    it('validateCriteria returns true when the conditions match; else returns false for equal operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"equal to","FieldValue":1}]}}',cartItem);
        expect(value).toBeTrue()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"equal to","FieldValue":2}]}}',cartItem);
        expect(value).toBeFalse()
    });

    it('validateCriteria returns true when the conditions match; else returns false for not equal operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"not equal to","FieldValue":1}]}}',cartItem);
        expect(value).toBeFalse()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"not equal to","FieldValue":2}]}}',cartItem);
        expect(value).toBeTrue()
    });

    it('validateCriteria returns true when the conditions match; else returns false for less than operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value2')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"less than","FieldValue":3}]}}',cartItem);
        expect(value).toBeFalse()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"less than","FieldValue":13}]}}',cartItem);
        expect(value).toBeTrue()
    });

    it('validateCriteria returns true when the conditions match; else returns false for less than or equal operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value2')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"less than or equal to","FieldValue":3}]}}',cartItem);
        expect(value).toBeFalse()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"less than or equal to","FieldValue":10}]}}',cartItem);
        expect(value).toBeTrue()
    });

    it('validateCriteria returns true when the conditions match; else returns false for greater than operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value2')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"greater than","FieldValue":3}]}}',cartItem);
        expect(value).toBeTrue()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"greater than","FieldValue":13}]}}',cartItem);
        expect(value).toBeFalse()
    });

    it('validateCriteria returns true when the conditions match; else returns false for greater than or equal operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value2')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"greater than or equal to","FieldValue":10}]}}',cartItem);
        expect(value).toBeTrue()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"greater than or equal to","FieldValue":13}]}}',cartItem);
        expect(value).toBeFalse()
    });

    it('validateCriteria returns true when the conditions match; else returns false for in operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"in","FieldValue":["value2",1,"value"]}]}}',cartItem);
        expect(value).toBeTrue()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"in","FieldValue":["value2","value1","value"]}]}}',cartItem);
        expect(value).toBeFalse()
    });

    it('validateCriteria returns true when the conditions match; else returns false for not in operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('value')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"not in","FieldValue":["value2","value"]}]}}',cartItem);
        expect(value).toBeTrue()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"not in","FieldValue":["value2",1,"value"]}]}}',cartItem);
        expect(value).toBeFalse()
    });

    it('validateCriteria returns true when the conditions match; else returns false for contains operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('array')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"contains","FieldValue":"b"}]}}',cartItem);
        expect(value).toBeTrue()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"contains","FieldValue":"d"}]}}',cartItem);
        expect(value).toBeFalse()
    });

    it('validateCriteria returns true when the conditions match; else returns false for not contains operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('array')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"does not contain","FieldValue":"b"}]}}',cartItem);
        expect(value).toBeFalse()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"does not contain","FieldValue":"d"}]}}',cartItem);
        expect(value).toBeTrue()
    });

    it('validateCriteria returns true when the conditions match; else returns false for starts with operator', () => {
        let value: any;
        mSpy.getKeyName.and.returnValue('array')
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"starts with","FieldValue":"a"}]}}',cartItem);
        expect(value).toBeTrue()
        value = service['validateCriteria']('{"sObjectName":"LineItem","filter":{"predicates":[{"CompOper":"starts with","FieldValue":"b"}]}}',cartItem);
        expect(value).toBeFalse()
    });

    it('processEntries processes the entries and updates the baseprice when "AdjustmentType" equals "List Price Override"', () => {
        spyOn(PriceService,'adjustValue').and.returnValue(50);
        spyOn<any>(service,'validateEntry').and.returnValue(true);
        expect(priceValue.basePrice).toEqual(priceValue.basePrice)
        service['processEntries'](priceMatrixValue2,priceRuleValue,priceValue,1,productattribute)
        expect(priceValue.basePrice).toEqual(99)
    });

    it('processEntries processes the entries and updates the baseprice from adjustvalue method when "AdjustmentType" not equals "List Price Override"', () => {
        spyOn(PriceService,'adjustValue').and.returnValue(50);
        spyOn<any>(service,'validateEntry').and.returnValue(true);
        expect(priceValue.basePrice).toEqual(priceValue.basePrice)
        service['processEntries'](priceMatrixValue3,priceRuleValue1,priceValue,1,productattribute)
        expect(priceValue.basePrice).toEqual(50)
    });

    it('processEntries processes the entries and updates the baseprice from adjustvalue method when contexttype is not present', () => {
        spyOn(PriceService,'adjustValue').and.returnValue(50);
        spyOn<any>(service,'validateEntry').and.returnValue(true);
        expect(priceValue.basePrice).toEqual(priceValue.basePrice)
        service['processEntries'](priceMatrixValue4,priceRuleValue1,priceValue,1,productattribute)
        expect(priceValue.basePrice).toEqual(50)
    });

    it('processEntries processes the entries and updates the baseprice from adjustvalue method when contexttype equals order-lineitem', () => {
        spyOn(PriceService,'adjustValue').and.returnValue(50);
        spyOn<any>(service,'validateEntry').and.returnValue(true);
        expect(priceValue.basePrice).toEqual(priceValue.basePrice)
        service['processEntries'](priceMatrixValue5,priceRuleValue1,priceValue,1,productattribute)
        expect(priceValue.basePrice).toEqual(50)
    });

    it('getAttributePriceForProduct price of a given attribute value', () => {
        let value:any;
        spyOn(PriceService,'adjustValue').and.returnValue(140);
        expect(priceValue.basePrice).toEqual(priceValue.basePrice)
        value= service.getAttributePriceForProduct(productValue,productAttribute,"test")
        value.subscribe(c=>{
            expect(c.netPrice).toEqual(-70)
        })
    });

    it('getLineItemPrice price of a given LineItem value; when Array<cartitem> is passed', () => {
        let value:any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        spyOn(service,'getRollupItemPrice').and.returnValue(of(priceValue));
        value= service.getLineItemPrice(cartItem2)
        value.subscribe(c=>{
            expect(c.netPrice).toEqual(100)
        })
    });

    it('getLineItemPrice price of a given LineItem value; when cartitem is passed', () => {
        let value:any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        spyOn(service,'getRollupItemPrice').and.returnValue(of(priceValue));
        value= service.getLineItemPrice(cartItem3)
        value.subscribe(c=>{
            expect(c.netPrice).toEqual(100)
        })
    });

    it('getLineItemPrice price of a given LineItem value; when orderlineitem is passed', () => {
        let value:any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        spyOn(service,'getRollupItemPrice').and.returnValue(of(priceValue));
        value= service.getLineItemPrice(orderItem3)
        value.subscribe(c=>{
            expect(c.basePrice).toEqual(10)
        })
    });

    it('getLineItemPrice price of a given LineItem value; when orderlineitem is passed', () => {
        let value:any;
        sfSpy.getStorefront.and.returnValue(of(storefront))
        spyOn(service,'getRollupItemPrice').and.returnValue(of(priceValue));
        value= service.getLineItemPrice(assetItem1)
        value.subscribe(c=>{
            expect(c.netPrice).toEqual(100);
        })
    });





});
