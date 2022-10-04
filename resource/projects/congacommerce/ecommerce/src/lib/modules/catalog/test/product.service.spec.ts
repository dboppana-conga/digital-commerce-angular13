import { TestBed } from "@angular/core/testing";
import { ApttusModule, ApiService, AObjectService } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { ProductService, PreviousState } from "../services/index";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockProductResult, productMockData, test } from "./data/dataManger";
import { of } from "rxjs";
import { PriceListService } from '../../pricing/services/price-list.service';
import { ProductResult } from "../classes";
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;
    let plSpy = jasmine.createSpyObj<PriceListService>(['isPricelistId', 'refreshPriceList', 'getPriceListId', 'getEffectivePriceListId'])
    plSpy.getPriceListId.and.returnValue(of('null'))
    let apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    apiSpy.refreshToken.and.returnValue(of(null));
    let aOSpy = jasmine.createSpyObj<AObjectService>(['describe'])

    beforeEach(() => {
        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            }
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [ProductService,
                { provide: PriceListService, useValue: plSpy },
                { provide: ApiService, useValue: apiSpy },
                { provide: AObjectService, useValue: aOSpy }],
        });

        service = TestBed.inject(ProductService)
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('searchProduct() should return results that match the search string', () => {
        apiSpy.get.and.returnValue(of(productMockData))
        service.searchProducts('temp', 3).pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(productMockData);
            expect(res[0].Name).toContain('Temp' || 'temp');
            expect(res[0].Name).toEqual(productMockData[0].Name);
            expect(res.length).toBeLessThanOrEqual(3);
        });
    });

    it('As passed parameter length is not greater than 2, searchProduct() should return null', () => {
        apiSpy.get.and.returnValue(of(null));
        service.searchProducts('t').pipe(take(1)).subscribe((res) => {
            expect(res).toBeFalsy();
            expect(res).toBeNull();
        });
    });

    it('fetch() function returns product details based on the given id', () => {
        const Id = '0ebb3fa0-59e5-472a-9678-62d45d5d0344';
        apiSpy.get.and.returnValue(of(productMockData[0]));
        service.fetch(Id).pipe(take(1)).subscribe((res) => {
            expect(res).toBeTruthy;
            expect(res.Id).toEqual('0ebb3fa0-59e5-472a-9678-62d45d5d0344');
        });
    });

    it('fetch() should not return product details for unavailable id', () => {
        apiSpy.get.and.returnValue(of(null));
        service.fetch('112121211112Xaswed1').pipe(take(1)).subscribe((res) => {
            expect(res).toBeNull();
        });
    });

    it('filterInvalidProducts() should filter products with invalid effective/expiration dates', () => {
        let productData = productMockData;
        const func = service.filterInvalidProducts(productData);
        expect(func.length).toEqual(0);
    });

    xit('getFieldPickList() should return picklist based on given field', () => {// visit again
        apiSpy.get.and.returnValue(of([{
            "Value": "Software",
            "DisplayText": "Software",
            "Sequence": 0,
            "IsDeprecated": false
        },
        {
            "Value": "Hardware",
            "DisplayText": "Hardware",
            "Sequence": 1,
            "IsDeprecated": false
        },
        {
            "Value": "Maintenance-HW",
            "DisplayText": "Maintenance-HW",
            "Sequence": 2,
            "IsDeprecated": false
        }]))
        aOSpy.describe.and.returnValue(of([ {
            "Value": "Software",
            "DisplayText": "Software",
            "Sequence": 0,
            "IsDeprecated": false
        },
        {
            "Value": "Hardware",
            "DisplayText": "Hardware",
            "Sequence": 1,
            "IsDeprecated": false
        },
        {
            "Value": "Maintenance-HW",
            "DisplayText": "Maintenance-HW",
            "Sequence": 2,
            "IsDeprecated": false
        }]))
        const a =service.getFieldPickList('Family')
        a.subscribe(c=>console.log(c));
    });

    it('getProducts() returns Productlist as null and Totalcount as zero when pricelist is undefined', () => {
        plSpy.isPricelistId.and.returnValue(false);
        const a = service.getProducts(['software', 'rakes'])
        a.subscribe(c => {
            expect(c.Products).toEqual([])
            expect(c.TotalCount).toEqual(0)
        })
    });

    it('getProducts() returns Productlist and totalcount when subcategories is null and no additional conditions are passed', () => {
        plSpy.isPricelistId.and.returnValue(true);
        apiSpy.get.and.returnValue(of(test))
        const a = service.getProducts(null, null, null, null, null, null, null)
        a.subscribe(c => {
            expect(plSpy.isPricelistId).toHaveBeenCalled()
            expect(c.Products[0].ProductCode).toEqual(test[0].ProductCode)
        })
    });

    it('getProducts() returns Productlist and totalcount when additional conditions are passed', () => {
        plSpy.isPricelistId.and.returnValue(true);
        apiSpy.get.and.returnValue(of(test))
        const a = service.getProducts(null, null, null, null, null, null, null)
        a.subscribe(c => {
            expect(plSpy.isPricelistId).toHaveBeenCalled()
            expect(c.Products[0].ProductCode).toEqual(test[0].ProductCode)
        })
    });

    it('getProducts() returns previous state of catalog page which includes the page number and sort order', () => {
        const value: PreviousState = { 'sort': 'Name', 'page': 1 }
        service.state.next(value);
        const a = service.getState()
        expect(a.page).toEqual(1);
        expect(a.sort).toEqual('Name')

    })

    it('publish() stores the previous state of catalog page.', () => {
        const value: PreviousState = { 'sort': 'Relevance', 'page': 10 }
        service.eventback.next(false)
        service.publish(value)
        const updatedValue = service.getState()
        expect(updatedValue.page).toEqual(10);
        expect(updatedValue.sort).toEqual('Relevance')
    })

    it('setValue() stores the values in the local storage.', () => {
        localStorage.setItem('page', '1');
        expect(localStorage.getItem('page')).toEqual('1')
        ProductService.setValue('page', '12');
        expect(localStorage.getItem('page')).toEqual('12')
    })

    it('getValue() fetches the key from the local storage. returns null when key not found', () => {
        localStorage.removeItem('page');
        expect(localStorage.getItem('page')).toBeNull()
        const b = ProductService.getValue('page');
        expect(b).toBeNull()
        ProductService.setValue('page', '12');
        const a = ProductService.getValue('page');
        expect(a).toEqual('12')
    })
});
