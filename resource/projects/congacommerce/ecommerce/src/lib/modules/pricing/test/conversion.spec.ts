import { TestBed } from "@angular/core/testing";
import { ApttusModule, ApiService, AObjectService, MetadataService } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { PriceListService } from '../../pricing/services/price-list.service';
import { PriceService, Adjustment } from '../../pricing/services/price.service';
import { PriceMatrixService } from '../../pricing/services/price-matrix.service';
import { CartService } from '../../cart/services/cart.service';
import { PriceListItemService } from '../../pricing/services/price-list-item.service';
import { UserService } from '../../crm/services/user.service';
import { StorefrontService } from '../../store/services/storefront.service';
import { ConversionService } from '../../pricing/services/conversion.service';
import { LocalCurrencyPipe } from '../pipes/convert.pipe';
import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { get } from 'lodash'
import {
    productOptionComponent, pricelist, Users, storefront1, storefront, conversion1, conversion2
} from "./dataManager";
import { CurrencyType } from "../classes";

describe('ConversionService', () => {
    let service: ConversionService;
    let httpMock: HttpTestingController;
    let sfSpy = jasmine.createSpyObj<StorefrontService>(['getStorefront', 'getDeferredPrice','active']);
    sfSpy.getDeferredPrice.and.returnValue(of(false));
    let plSpy = jasmine.createSpyObj<PriceListService>(['isPricelistId', 'refreshPriceList', 'getPriceListId', 'getEffectivePriceListId','getPriceList'])
    plSpy.getPriceListId.and.returnValue(of('pricelistValue'))
    plSpy.getPriceList.and.returnValue(of(pricelist))
    let aOSpy = jasmine.createSpyObj<AObjectService>(['describe'])
    let userSpy = jasmine.createSpyObj<UserService>(['me','getBrowserLocale'])
    userSpy.me.and.returnValue(of(Users))

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [PriceService, PriceMatrixService, CartService, PriceListItemService,
                LocalCurrencyPipe, CurrencyPipe,
                { provide: PriceListService, useValue: plSpy },
                { provide: UserService, useValue: userSpy },
                { provide: AObjectService, useValue: aOSpy },
                { provide: StorefrontService, useValue: sfSpy },],

        });

        service = TestBed.inject(ConversionService)
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('service should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getConversionRates returns the currencytype object', () => {
        let value:any;
        sfSpy.active.and.returnValue(of(storefront));
        value=service.getConversionRates();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(get(storefront,'CurrencyTypes'))
        })
       
    });

    it('getConversionRates returns the null when storefront object does not have currencytype object ', () => {
        let value:any;
        sfSpy.active.and.returnValue(of(storefront1));
        value=service.getConversionRates();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toBeUndefined()
        })
       
    });

    it('getMyCurrencyType() returns the null when storefront object does not have currencytype object ', () => {
        let value:any;
        spyOn(service,'getConversionRates').and.returnValue(of(conversion1));
        value=service.getMyCurrencyType();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(conversion1[0]);
        })
    })

    it('getMyCurrencyType() returns the null when storefront object does not have currencytype object ', () => {
        let value:any;
        let currency= new CurrencyType();
        spyOn(service,'getConversionRates').and.returnValue(of(conversion2));
        value=service.getMyCurrencyType();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(currency);
        })
    })


});
