import { TestBed } from "@angular/core/testing";
import { ApiService, ApttusModule, ConfigurationService } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { AccountService } from "../services/index";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { account as accountData } from './mock/index';
import { TranslateModule } from "@ngx-translate/core";
import { Account } from "../classes/account.model";
import { BehaviorSubject, of } from "rxjs";
import { take } from 'rxjs/operators';

describe('AccountService', () => {
    let service: AccountService;
    let httpMock: HttpTestingController;
    let configurationService: ConfigurationService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}),
                TranslateModule.forRoot()],
            providers: [AccountService],
        });
        service = TestBed.inject(AccountService);
        httpMock = TestBed.inject(HttpTestingController);
        configurationService= TestBed.inject(ConfigurationService);
    });
    it('service should be created', () => {
        expect(service).toBeTruthy();
    });
   //TO DO: @nnaik
    // it('getCurrentAccount() should return current account data', () => {
    //     spyOn(service.apiService,'get').and.returnValue(of(accountData));
    //     service.getCurrentAccount().subscribe();
    //     expect(service.apiService.get).toHaveBeenCalled(); 
    // });
    it('getAccount fetches the account based on accountid', () => {
        let mySpy:any;
        let user:any;
        mySpy= spyOn(service,'fetch').and.returnValue(of(accountData));
        service.getAccount('546').pipe(take(1)).subscribe((res) => {
            user=res
            expect(user.Id).toEqual(accountData.Id)
        });
    });
    //TO DO: @nnaik
    // it('getMyAccount() should return account', () => {
    //     let user:any;
    //     spyOn(service,'getMyAccount').and.returnValue(of(accountData));
    //     service.getMyAccount().pipe(take(1)).subscribe((res: Account) =>  { 
    //         user=accountData  
    //         expect(res).toBeInstanceOf(Account)
    //         expect(res.Id).toEqual(accountData.Id)
    //     });
    // });
})