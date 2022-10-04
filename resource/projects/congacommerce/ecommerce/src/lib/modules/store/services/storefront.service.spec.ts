import { TestBed } from "@angular/core/testing";
import { ApttusModule, ApiService, AObjectService } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Users, storefront } from "./data/datamanager";
import { of } from "rxjs";
import { PriceListService } from '../../pricing/services/price-list.service';
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { StorefrontService } from "./storefront.service"
import { UserService } from '../../crm/services/user.service';
import { Storefront } from "../classes";
import { User } from "../../crm";

describe('StorefrontService', () => {
    let service: StorefrontService;
    let httpMock: HttpTestingController;
    let plSpy = jasmine.createSpyObj<PriceListService>(['isPricelistId', 'refreshPriceList', 'getPriceListId', 'getEffectivePriceListId'])
    plSpy.getPriceListId.and.returnValue(of('null'))
    let apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    apiSpy.refreshToken.and.returnValue(of(null));
    let aOSpy = jasmine.createSpyObj<AObjectService>(['describe'])
    let userSpy = jasmine.createSpyObj<UserService>(['me','getBrowserLocale'])
    userSpy.me.and.returnValue(of(Users));
    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [StorefrontService,
                { provide: PriceListService, useValue: plSpy },
                { provide: ApiService, useValue: apiSpy },
                { provide: AObjectService, useValue: aOSpy },
                { provide: UserService, useValue: userSpy }
            ],
        });

        service = TestBed.inject(StorefrontService)
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('active() should return active storefront object', () => {
        service['state'].next(storefront);
        service.active().subscribe(c => {
            expect(c).toEqual(storefront)
        })
    });

    it('getStoreFront() should returns the current storefront object', () => {
        service.getStorefront().subscribe(c => {
            expect(c).toBeInstanceOf(Storefront)
        })
    });

    it('isFavoriteDisabled() returns true when storefront has favorite disabled', () => {
        spyOn(service,'getSetting').and.returnValue(of(true));
        service.isFavoriteDisabled().subscribe(c=>{
            expect(c).toBeTruthy()
        })
    });

    it('isFavoriteDisabled() returns false when storefront has favorite enabled', () => {
        spyOn(service,'getSetting').and.returnValue(of(false));
        service.isFavoriteDisabled().subscribe(c=>{
            expect(c).toBeFalsy()
        })
    });

    it('getDeferredPrice() returns true when storefront has Defer price else false', () => {
        spyOn(service,'getSetting').and.returnValue(of(true));
        service.isFavoriteDisabled().subscribe(c=>{
            expect(c).toBeTruthy()
        })
    });

    it('getDeferredPrice() returns false when storefront does not have Defer price', () => {
        spyOn(service,'getSetting').and.returnValue(of(false));
        service.isFavoriteDisabled().subscribe(c=>{
            expect(c).toBeFalsy()
        })
    });

    it('getDeferredPrice() returns false when storefront does not have Defer price', () => {
        spyOn(service,'getSetting').and.returnValue(of(false));
        service.isFavoriteDisabled().subscribe(c=>{
            expect(c).toBeFalsy()
        })
    });

    it('refresh() sets the state with active storefront', () => {
        apiSpy.get.and.returnValue(of(storefront))
        service.refresh()
        service['state'].subscribe(c=>{
            expect(userSpy.me).toHaveBeenCalled()
            expect(apiSpy.get).toHaveBeenCalled()
            expect(c).toEqual(storefront)
        })
    });
});