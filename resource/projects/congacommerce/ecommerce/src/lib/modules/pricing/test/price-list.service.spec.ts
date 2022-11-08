import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService, ApttusModule } from "@congacommerce/core";
import { CommerceModule } from "@congacommerce/ecommerce";
import { TranslateModule } from "@ngx-translate/core";
import * as moment from "moment";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { PriceListService, UserService } from "../.."
import { User1 } from "../../crm/tests/mock";
import { ACTIVE_PRICE_LIST } from "./dataManager";

const _moment = moment;

describe('PriceListService', () => {
    let service: PriceListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [
                PriceListService,
                [{ provide: ApiService, useClass: ApiService }]
            ],
        });
        service = TestBed.inject(PriceListService);
    });

    describe('Call refresh price list method', () => {
        let service: PriceListService;
        let apiService: ApiService;
        let userService: UserService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            userService = TestBed.inject(UserService);
        });
        it('Should return current active price list as null', () => {
            const priceListInfo = ACTIVE_PRICE_LIST;
            spyOn(userService, 'getCurrentUser').and.returnValue(of(null));
            const mySpy = spyOn(apiService, 'get').and.returnValue(of(null))
            const result = service.refreshPriceList();
            expect(service['priceList'].value).toEqual(null)
        });
    });

    describe('Call refresh price list method', () => {
        let service: PriceListService;
        let apiService: ApiService;
        let userService: UserService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
            apiService = TestBed.inject(ApiService);
            userService = TestBed.inject(UserService);
        });
        it('Should return current active price list details', () => {
            const priceListInfo = ACTIVE_PRICE_LIST;
            spyOn(userService, 'getCurrentUser').and.returnValue(of(User1));
            const mySpy = spyOn(apiService, 'get').and.returnValue(of(priceListInfo))
            const result = service.refreshPriceList();
            expect(service['priceList'].value.Name).toEqual(priceListInfo.Name);
        });
    });

    describe('Call getPriceListId method', () => {
        let service: PriceListService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
        });
        it('Should return current active price list details', () => {
            service['priceList'].next(ACTIVE_PRICE_LIST);
            const result = service.getPriceListId();
            result.pipe(take(1)).subscribe((res) => {
                expect(res).toEqual(ACTIVE_PRICE_LIST.Id);
            });
        });
    });

    describe('Call getEffectivePriceListId method', () => {
        let service: PriceListService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
        });
        it('Should return effective price list id', () => {
            service['priceList'].next(ACTIVE_PRICE_LIST);
            const result = service.getEffectivePriceListId();
            result.pipe(take(1)).subscribe((res) => {
                expect(res).toEqual(ACTIVE_PRICE_LIST.Id);
            });
        });
    });

    describe('Call getPriceList method', () => {
        let service: PriceListService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
        });
        it('Should return price list details', () => {
            service['priceList'].next(ACTIVE_PRICE_LIST);
            const result = service.getPriceList();
            result.pipe(take(1)).subscribe((res) => {
                expect(res).toEqual(ACTIVE_PRICE_LIST);
            });
        });
    });

    describe('Call getEffectivePriceList method', () => {
        let service: PriceListService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
        });
        it('Should return effective price list details', () => {
            service['priceList'].next(ACTIVE_PRICE_LIST);
            const result = service.getEffectivePriceList();
            result.pipe(take(1)).subscribe((res) => {
                expect(res).toEqual(ACTIVE_PRICE_LIST);
            });
        });
    });

    describe('Call getEffectivePriceList method', () => {
        let service: PriceListService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
        });
        it('Should return price list is not valid', () => {
            let activePriceList = ACTIVE_PRICE_LIST;
            activePriceList.ExpirationDate = _moment().subtract(1, 'months').valueOf().toString();
            const result = service.isValidPriceList(activePriceList);
            expect(result).toBeFalse();
            expect(result).toEqual(false);
        });
    });

    describe('Call getEffectivePriceList method', () => {
        let service: PriceListService;

        beforeEach(() => {
            service = TestBed.inject(PriceListService);
        });
        it('Should return price list is valid', () => {
            let activePriceList = ACTIVE_PRICE_LIST;
            activePriceList.ExpirationDate = _moment().add(1, 'months').valueOf().toString();
            const result = service.isValidPriceList(activePriceList);
            expect(result).toBeTruthy();
            expect(result).toEqual(true);
        });
    });

    describe('Call isPricelistId method', () => {
        let service: PriceListService;

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
            service = TestBed.inject(PriceListService);
        });

        it('Should return is price list present', () => {
            const pricelistId = 'a1I790432107VdqEAE';
            localStorage.setItem('pricelistId', pricelistId);
            const result = service.isPricelistId();
            expect(result).toEqual(true);
        });
    });

    describe('Call isPricelistId method', () => {
        let service: PriceListService;

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
            service = TestBed.inject(PriceListService);
        });

        it('Should return price list is not present', () => {
            localStorage.setItem('pricelistId', undefined);
            const result = service.isPricelistId();
            expect(result).toEqual(false);
        });
    });

});