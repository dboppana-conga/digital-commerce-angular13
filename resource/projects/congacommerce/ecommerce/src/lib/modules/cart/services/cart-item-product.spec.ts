import { TestBed } from "@angular/core/testing";
import { AObject, ApiService, ApttusModule } from "@congacommerce/core";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { CartItemProductService } from "./cart-item-product.service";
import { CommerceModule } from "@congacommerce/ecommerce";
import { CART_ITEMS, CART_ITEMS_WITH_NO_PRODUCT_INFO, PRODUCT_WITH_ADDITIONAL_INFO } from "../../../test/data-manager";
import { PriceListService } from "../../pricing/services";
import { QUOTE_LINE_ITEM, QUOTE_LINE_ITEM_WITH_NO_PRODUCT_INFO } from "./datamanager/data";

describe('CartItemProductService', () => {
    let service: CartItemProductService;
    const apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', ['refreshToken', 'get', 'post', 'patch', 'delete']);
    apiServiceSpy.refreshToken.and.returnValue(of(null));
    const priceListServiceSpy = jasmine.createSpyObj<PriceListService>('PriceListService', ['isPricelistId']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [
                CartItemProductService,
                ApiService,
                { provide: PriceListService, useValue: priceListServiceSpy },
            ],
        });
        service = TestBed.inject(CartItemProductService);
    });

    describe('Call addProductInfoToLineItems() method : ', () => {
        let service: CartItemProductService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CartItemProductService);
            apiService = TestBed.inject(ApiService);
        });

        it('should return given Cart Line Item itself with no product info', () => {
            spyOn(apiService, 'refreshToken').and.returnValue(of(null));
            const results = service.addProductInfoToLineItems([CART_ITEMS_WITH_NO_PRODUCT_INFO[0]]);
            results.pipe(take(1)).subscribe((val) => {
                expect(val[0]).toEqual(CART_ITEMS_WITH_NO_PRODUCT_INFO[0]);
                expect(val[0].Product).toEqual(null);
            });
            expect(apiServiceSpy.get).toHaveBeenCalledTimes(0);
        });
    });

    describe('Call addProductInfoToLineItems() method : ', () => {
        let service: CartItemProductService;
        let apiService: ApiService;

        beforeEach(() => {
            service = TestBed.inject(CartItemProductService);
            apiService = TestBed.inject(ApiService);
        });

        it('should return given Quote Line Item itself with no product info', () => {
            const results = service.addProductInfoToLineItems([QUOTE_LINE_ITEM_WITH_NO_PRODUCT_INFO[0]]);
            results.pipe(take(1)).subscribe((val) => {
                expect(val[0]).toEqual(QUOTE_LINE_ITEM_WITH_NO_PRODUCT_INFO[0]);
                expect(val[0].Product).toEqual(null);
            })
            expect(apiServiceSpy.get).toHaveBeenCalledTimes(0);
        });
    });

    describe('Call addProductInfoToLineItems() method : ', () => {
        let service: CartItemProductService;
        let apiService: ApiService;

        beforeEach(() => {
            service = TestBed.inject(CartItemProductService);
            apiService = TestBed.inject(ApiService);
        });

        it('should return additional info for the given cart line items', () => {
            priceListServiceSpy.isPricelistId.and.returnValue(true);
            const mySpy = spyOn(apiService, 'get').and.returnValue(of(PRODUCT_WITH_ADDITIONAL_INFO));
            const results = service.addProductInfoToLineItems([CART_ITEMS[2]]);
            results.pipe(take(1)).subscribe((val) => {
                expect(val[0].Product.Id).toEqual(CART_ITEMS[2].Product.Id);
                expect(val[0].Product.ProductCode).not.toEqual(null);
            });
            expect(mySpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Call addProductInfoToLineItems() method : ', () => {
        let service: CartItemProductService;
        let apiService: ApiService;

        beforeEach(() => {
            service = TestBed.inject(CartItemProductService);
            apiService = TestBed.inject(ApiService);
        });

        it('should return additional info for the given Quote Line Item', () => {
            priceListServiceSpy.isPricelistId.and.returnValue(true);
            const mySpy = spyOn(apiService, 'get').and.returnValue(of(PRODUCT_WITH_ADDITIONAL_INFO))
            const results = service.addProductInfoToLineItems([QUOTE_LINE_ITEM[0]]);
            results.pipe(take(1)).subscribe((val) => {
                expect(val[0].Product.Id).toEqual(QUOTE_LINE_ITEM[0].Product.Id);
                expect(val[0].Product.Description).not.toEqual(null);
            })
            expect(mySpy).toHaveBeenCalledTimes(1);
        });
    });

});
