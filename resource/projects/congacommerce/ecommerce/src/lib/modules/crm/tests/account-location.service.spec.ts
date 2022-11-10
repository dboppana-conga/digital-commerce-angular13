import {  async, inject, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApttusModule, AObjectService } from "@congacommerce/core";
import { of } from "rxjs";
import { CommerceModule } from "../../../ecommerce.module";
import { AccountLocation} from "../classes/index"; 
import { AccountLocationService, AccountService } from "../index";
import { accountValue, accountLocation, AccountLocationTest, MockAccountLocationService } from './mock/index';
import { take } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";


describe('AccountLocationService',() =>{
    let accountLocationService:AccountLocationService;
    let aObjectSpy= jasmine.createSpyObj<AObjectService>(['delete'])
    
    beforeEach(() =>{
        TestBed.configureTestingModule({ 
            imports:[ApttusModule, CommerceModule.forRoot({}), 
                TranslateModule.forRoot(), HttpClientTestingModule],
            providers:[AccountLocationService,
                { provide: AObjectService, useValue: aObjectSpy}]
        });
        accountLocationService = TestBed.inject(AccountLocationService);        
    });

    it('service should be created and verify the type of the service is set to AccountLocationTest', () =>{
        expect(accountLocationService).toBeTruthy();
        accountLocationService.setType(AccountLocationTest)
        expect(accountLocationService.type.name).toEqual('AccountLocationTest');
    });

    it('getAccountLocations returns account location array', () =>{
        accountLocationService['locations$'].next(accountLocation)
        spyOn<any>(accountLocationService,'refreshLocations').and.returnValue(null)
        accountLocationService.getAccountLocations().pipe(take(1)).subscribe(res=> {
            expect(res).toEqual(accountLocation)
        })
        accountLocationService['locations$'].next(null)
        accountLocationService.getAccountLocations().pipe(take(1)).subscribe(res=> {
            expect(accountLocationService['refreshLocations']).toHaveBeenCalled()
            expect(res).toBeNull()
        })
    });

    it('delete an array of records that were deleted in the process', () =>{
        aObjectSpy.delete.and.returnValue(of(accountValue))
        spyOn<any>(accountLocationService,'refreshLocations').and.returnValue(null)
        accountLocationService.delete(accountLocation).pipe(take(1)).subscribe(res=> {
            expect(accountLocationService['refreshLocations']).toHaveBeenCalled()
        })
    });


    it('saveLocationToAccount verifies the AccountId of the savedAccountLocation is set to currentAccount and returns the same.', async(inject([AccountLocationService], 
        (injectService: MockAccountLocationService) => {
            injectService.accountService = injectService.injector.get(AccountService);
            spyOn(injectService.accountService, 'getCurrentAccount').and.returnValue(of(accountValue));
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