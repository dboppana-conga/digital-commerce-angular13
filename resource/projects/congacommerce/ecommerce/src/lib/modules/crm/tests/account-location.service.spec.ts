import {  async, inject, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApttusModule } from "@congacommerce/core";
import { of } from "rxjs";
import { CommerceModule } from "../../../ecommerce.module";
import { AccountLocation} from "../classes/index"; 
import { AccountLocationService, AccountService } from "../index";
import { account, accountLocation, AccountLocationTest, MockAccountLocationService } from './mock/index';
import { take } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";


describe('AccountLocationService',() =>{
    let accountLocationService:AccountLocationService;
    
    beforeEach(() =>{
        TestBed.configureTestingModule({ 
            imports:[ApttusModule, CommerceModule.forRoot({}), 
                TranslateModule.forRoot(), HttpClientTestingModule],
            providers:[AccountLocationService]
        });
        accountLocationService = TestBed.inject(AccountLocationService);        
    });

    it('service should be created and verify the type of the service is set to AccountLocationTest', () =>{
        expect(accountLocationService).toBeTruthy();
        accountLocationService.setType(AccountLocationTest)
        expect(accountLocationService.type.name).toEqual('AccountLocationTest');
    });


    it('saveLocationToAccount verifies the AccountId of the savedAccountLocation is set to currentAccount and returns the same.', async(inject([AccountLocationService], 
        (injectService: MockAccountLocationService) => {
            injectService.accountService = injectService.injector.get(AccountService);
            spyOn(injectService.accountService, 'getCurrentAccount').and.returnValue(of(account));
            spyOn(injectService, 'upsert').and.returnValue(of([accountLocation[1]]));
            accountLocation[1].Account.Id = '546';
            injectService.saveLocationToAccount(accountLocation[1])
            .pipe(take(1))
            .subscribe(response => {
                expect(response[0].Account.Id).toEqual('546');
                expect(response[0].Name).toEqual(accountLocation[1].Name);
            });
        }
    )));

    it('setLocationAsDefault by passing the input value Accountlocation with IsDefault set to true and returns the default account information.', () => {
        spyOn(accountLocationService, 'getAccountLocations').and.returnValue(of(accountLocation));
        spyOn(accountLocationService, 'update').and.returnValue(of([accountLocation[1]]));
        accountLocationService.setLocationAsDefault(accountLocation[1]).pipe(take(1)).subscribe(
            (result:AccountLocation[]) =>{
                expect(accountLocation[1].Name).toEqual(result[0].Name);
            }
        );
    });

    it('setLocationAsDefault by passing the input value Accountlocation with IsDefault set to false and returns empty array result.', () => {
        spyOn(accountLocationService, 'getAccountLocations').and.returnValue(of(accountLocation));
        spyOn(accountLocationService, 'update').and.returnValue(of([]));
        accountLocationService.setLocationAsDefault(accountLocation[0]).pipe(take(1)).subscribe(
            (result:AccountLocation[]) =>{
                expect(result.length).toBe(0);
            }
        );
    });
})