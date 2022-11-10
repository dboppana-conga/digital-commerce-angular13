import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CategoryService } from '../services/category.service';
import { ApiService, ApttusModule } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { mockCategory, MOCK_CATEGORY } from './data/dataManger';
import { Category } from '../classes/index';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { PriceListService } from '../../pricing/services';

describe('CategoryService', () => {
    let service: CategoryService;
    const apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', ['refreshToken', 'get', 'post', 'patch', 'delete']);
    apiServiceSpy.refreshToken.and.returnValue(of(null));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [
                CategoryService,
                [{ provide: ApiService, useClass: ApiService }],
                { provide: PriceListService, useClass: PriceListService }
            ],
        });

        service = TestBed.inject(CategoryService);
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
        });
        it('refresh() should return empty array and state undefined as pricelist is not having product', () => {
            spyOn(apiService, 'get').and.returnValue(of([]));
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.refresh();
            expect(service['state'].value[0]).toEqual(undefined);
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('should return list of categories based on priceList', () => {
            const apiServiceSpy = spyOn(apiService, 'get').and.returnValue(of(mockCategory));
            const priceServiceSpy = spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.refresh();
            expect(service['state'].value[0].Name).toEqual(mockCategory[0].Name);
            expect(apiServiceSpy).toHaveBeenCalledTimes(1);
            expect(priceServiceSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getCategories() should return list of categories', () => {
            service['state'].next(mockCategory);
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getCategories();
            result.pipe(take(1)).subscribe((categories) => {
                expect(categories.length).toEqual(mockCategory.length);
                expect(categories[0].Name).toEqual(mockCategory[0].Name);
            });
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getCategories() should not return list of categories', () => {
            service['state'].next(null);
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getCategories();
            result.pipe(take(1)).subscribe((categories) => {
                expect(categories).toEqual(null);
            });
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getCategoryByName() should return based on given paramter', () => {
            spyOn(service, 'getCategories').and.returnValue(of(mockCategory));
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getCategoryByName(mockCategory[0].Name);
            result.pipe(take(1)).subscribe((val) => {
                expect(val.AncestorId).toEqual(mockCategory[0].AncestorId);
                expect(val).toEqual(mockCategory[0]);
            });
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getCategoryByName() should not return based on given paramter', () => {
            spyOn(service, 'getCategories').and.returnValue(of(mockCategory));
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getCategoryByName("UNAVILABLE_PRODUCT");
            result.pipe(take(1)).subscribe((val) => {
                expect(val).toEqual(undefined);
            });
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getCategoriesByProductId() should return based on given product id', () => {
            apiServiceSpy.get.and.returnValue(of(mockCategory[0]));
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getCategoriesByProductId(mockCategory[0].Id);
            result.pipe(take(1)).subscribe((val) => {
                expect(val).toEqual(mockCategory[0]);
                expect(val.Id).toEqual(mockCategory[0].Id);
                expect(val.Name).toEqual(mockCategory[0].Name);
            });
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getCategoriesByProductId() should not return details for invalid product id', () => {
            apiServiceSpy.get.and.returnValue(of(null));
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getCategoriesByProductId("invalid_id");
            result.pipe(take(1)).subscribe((val) => {
                expect(val).toBeFalsy();
                expect(val).toEqual(null);
            });
        });
    });

    it('getCategoryTree() should return category tree', () => {
        spyOn(service, 'getCategories').and.returnValue(of(mockCategory));
        service.getCategoryTree().pipe(take(1)).subscribe(res => {
            expect(res).toBeTruthy();
            expect(res.length).not.toEqual(mockCategory.length);
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getSubcategories() should return Sub category of given category', () => {
            spyOn(service, 'getCategories').and.returnValue(of(mockCategory));
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getSubcategories(mockCategory[1].Id);
            result.pipe(take(1)).subscribe((val) => {
                expect(val).toBeTruthy();
                expect(val.length).toEqual(mockCategory.length);
                expect(val[0].Id).toEqual(mockCategory[0].Id);
            });
        });
    });

    it('getRelatedCategories() should return related category of given category', () => { /* TO DO : Check actual response */
        spyOn(service, 'getCategories').and.returnValue(of(mockCategory));
        service.getRelatedCategories(mockCategory[4].Id).pipe(take(1)).subscribe(res => {
            expect(res).toBeTruthy();
            expect(res[0].Name).toEqual(mockCategory[4].Name);
        });
    });

    it('getRootCategories() should return root category', () => {
        spyOn(service, 'getCategories').and.returnValue(of(mockCategory));
        const result = service.getRootCategories();
        result.pipe(take(1)).subscribe((categories) => {
            expect(categories[0].AncestorId).toEqual(null);
            expect(categories[0].Name).toEqual(mockCategory[2].Name);
        });
    });

    describe('Call refresh() method', () => {
        let service: CategoryService;
        let plService: PriceListService;
        let apiService: ApiService;
        beforeEach(() => {
            service = TestBed.inject(CategoryService);
            plService = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            apiServiceSpy.get.calls.reset();
        });
        it('getRootCategories() should return root category', () => {
            spyOn(service, 'getCategories').and.returnValue(of(MOCK_CATEGORY));
            spyOn(plService, 'getPriceListId').and.returnValue(of('78ad6108-6abc-465c-b137-1221212'));
            const result = service.getRootCategories();
            result.pipe(take(1)).subscribe((categories) => {
                expect(categories.length).toEqual(0);
            });
        });
    });
});
