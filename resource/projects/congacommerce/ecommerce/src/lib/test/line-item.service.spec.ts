import { LineItemService } from "../services";
import { ApiService, ApttusModule } from "@congacommerce/core";
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from "@ngx-translate/core";
import { CommerceModule } from "../ecommerce.module";
import { BUNDLE_PRODUCT_CART_ITEM, BUNDLE_PRODUCT_ITEM_GROUP, CART_ITEM, CART_ITEM_MOCK_DATA, CART_LINE_ITEMS } from "./data-manager";
import { of } from "rxjs";
import { take } from "rxjs/operators";

describe('LineItemService', () => {

    let service: LineItemService;
    let apiService: ApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [
                LineItemService,
                [{ provide: ApiService, useClass: ApiService }]
            ],
        });
        service = TestBed.inject(LineItemService);
        apiService = TestBed.inject(ApiService);
    });

    it('groupItems() should return all the option details for the given cart item', () => {
        const result = LineItemService.groupItems([CART_ITEM]);
        expect(result).toBeTruthy();
        expect(result[0].MainLine.Id).toEqual(BUNDLE_PRODUCT_ITEM_GROUP.MainLine.Id)
    });

    describe('Call isPricelistId method', () => {
        let service: LineItemService;
        let apiService: ApiService;

        beforeEach(() => {
            let store = {};
            const mockLocalStorage = {
                getItem: (key: string): string => {
                    return key in store ? store[key] : null;
                },
                setItem: (key: string, value: string) => {
                    store[key] = `${value}`;
                }
            };
            spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
            spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
            service = TestBed.inject(LineItemService);
            apiService = TestBed.inject(ApiService);
        });

        it('getOptionsForItem() should return all the option details for the given cart item', () => {
            localStorage.setItem('local-cart', 'aUxyzzzWer');
            const mySpy = spyOn(apiService, 'post').and.returnValue(of(CART_LINE_ITEMS));
            const result = service.getOptionsForItem(CART_ITEM);
            result.pipe(take(1)).subscribe((res) => {
                expect(mySpy).toHaveBeenCalledTimes(1);
                expect(res.length).toEqual(BUNDLE_PRODUCT_CART_ITEM.length);
            })
        });
    });
});