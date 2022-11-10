import { TestBed } from "@angular/core/testing";
import { ApiService, ApttusModule } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { AccountService } from "../services/index";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { accountValue as accountData, ACCOUNT_INFO } from './mock/index';
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { take } from 'rxjs/operators';
import { CartService } from "../../cart";

describe('AccountService', () => {
    let service: AccountService;
    let apiService: ApiService;
    let carService: CartService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}),
                TranslateModule.forRoot()],
            providers: [AccountService,
                [{ provide: ApiService, useClass: ApiService }],
                [{ provide: CartService, useClass: CartService }]
            ],
        });
        service = TestBed.inject(AccountService);
        apiService = TestBed.inject(ApiService);
        carService = TestBed.inject(CartService);
    });

    it('getCurrentAccount() should return current account data', () => {
        let mySpy: any;
        mySpy = spyOn(apiService, 'get').and.returnValue(of(ACCOUNT_INFO));
        service.getCurrentAccount().pipe(take(1)).subscribe(res => {
            expect(res).toBeTruthy();
            // expect(res.Name).toEqual(accountData.Name);
        });
    });

    it('getAccount() will return null as account not present with given account Id', () => {
        let mySpy: any;
        mySpy = spyOn(service, 'fetch').and.returnValue(of(null));
        service.getAccount('123').pipe(take(1)).subscribe((res) => {
            expect(res).toBeNull();
        });
    });

    it('getAccount() fetches the account based on accountid', () => {
        let mySpy: any;
        mySpy = spyOn(service, 'fetch').and.returnValue(of(accountData));
        service.getAccount(accountData.Id).pipe(take(1)).subscribe((res) => {
            expect(res.Id).toEqual(accountData.Id)
        });
    });

    it('getMyAccount() should return account', () => {
        spyOn(apiService, 'get').and.returnValue(of(accountData));
        const result = service.getMyAccount();
        result.pipe(take(1)).subscribe(res => {
            expect(res).toBeTruthy();
            expect(res.Id).toEqual(accountData.Id);
        });
    });

    it('setAccount() set the account', () => {
        const account = accountData;
        spyOn(service, 'getAccount').and.returnValue(of(accountData));
        spyOn(carService, 'createNewCart').and.returnValue(of(null));
        spyOn(carService, 'refreshCart');
        const result = service.setAccount(account);
        result.subscribe(res => {
            expect(res).toBeTruthy();
            expect(res.Id).toEqual(account.Id);
        });
        expect(carService.refreshCart).toHaveBeenCalledTimes(1);
    });
})