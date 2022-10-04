
import {map, switchMap, take, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AccountLocation } from '../classes/account-location.model';
import { AObjectService } from '@congacommerce/core';
import { AccountService } from './account.service';
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { AObject } from '@congacommerce/core';

/**
 * The Address-Location service allows you to organize account addresses. Addresses are a sub-resource of an Account. An account may have multiple addresses.
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { AccountLocationService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private accountLocationService: AccountLocationService)
}
// or
export class MyService extends AObjectService {
     private accountLocationService: AccountLocationService = this.injector.get(AccountLocationService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class AccountLocationService extends AObjectService {
    type = AccountLocation;

    private locations$: BehaviorSubject<Array<AccountLocation>> = new BehaviorSubject(null);
    private accountService: AccountService = this.injector.get(AccountService);

    /**
     * gets all the account locations for the current account you have selected.
     * ### Example:
```typescript
import { AccountLocationService, AccountLocation } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    accountLocationList: Array<AccountLocation>;
    accountLocationList$: Observable<Array<AccountLocation>>;

    constructor(private accountLocationService: AccountLocationService){}

    getAccountLocations(productCode: string){
        this.accountLocationService.getAccountLocations().subscribe(a => this.accountLocationList = a);
        // or
        this.accountLocationList$ = this.accountLocationService.getAccountLocations();
    }
}
```
     * @returns An observable of an account location array
     */
    getAccountLocations(): Observable<Array<AccountLocation>>{
        if (this.locations$.value)
            return this.locations$;
        else {
            this.refreshLocations();
            return this.locations$;
        }
    }

    /**
     * Saves the account location record to the current account.
     * ### Example:
```typescript
import { AccountLocationService, AccountLocation } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    constructor(private accountLocationService: AccountLocationService){}

    saveAccountLocation(accountLocation: AccountLocation){
        this.accountLocationService.saveLocationToAccount(accountLocation)
            .subscribe(
                locationId => {...},
                err => {...}
            );
    }
}
```
     * @param location The AccountLocation record to save
     * @returns An observable of an account location record id
     */
    saveLocationToAccount(location: AccountLocation): Observable<Array<AccountLocation>>{
        return this.accountService.getCurrentAccount().pipe(
            take(1),
            switchMap(account => {
                location.Account.Id = account.Id;
                return this.upsert([location]);
            }),
            tap(() => this.refreshLocations())
        );
    }

    /**
     * Sets the selected address as the default address.
     * ### Example:
```typescript
import { AccountLocationService, AccountLocation } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    constructor(private accountLocationService: AccountLocationService){}

    setLocationAsDefault(accountLocation: AccountLocation){
        this.accountLocationService.setLocationAsDefault(accountLocation)
            .subscribe(
                locationIdList => {...},
                err => {...}
            );
    }
}
```
     * @param location  The AccountLocation record to set as default
     * @returns A string array of records that were updated in the process
     */
    setLocationAsDefault(location: AccountLocation): Observable<Array<AccountLocation>>{
        return this.getAccountLocations().pipe(
            take(1),
            switchMap(locations => {
                const d = locations.filter(al => al.IsDefault === true);
                if(d && d.length > 0)
                    d.forEach(r => r.IsDefault = false);
                location.IsDefault = true;
                const toUpdate = [location].concat(d);

                return this.update(toUpdate) as Observable<Array<AccountLocation>>;
            }),
            tap(() => this.refreshLocations())
        );
    }
    /**
     *  ### Example:
```typescript
import { AccountLocationService } from '@congacommerce/ecommerce';
import { AObject } from '@congacommerce/core';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    constructor(private accountLocationService: AccountLocationService){}

    delete(recordList: Array<AObject>){
        this.accountLocationService.delete(recordList)
            .subscribe(
                deletedRecordList => {...},
                err => {...}
            );
    }
}
```
     * @override
     * @param recordList array of records to be deleted
     * @param updateCache when set to true, will update cache after deleting records
     * @returns an array of records that were deleted in the process
     */
    delete(recordList: Array<AObject>, updateCache: boolean = true): Observable<Array<AObject>> {
        return super.delete(recordList, updateCache).pipe(tap(() => this.refreshLocations()));
    }

    // TO DO:
    private refreshLocations() {
        // this.accountService.getCurrentAccount()
        // .pipe(
        //     take(1),
        //     switchMap(account => this.query({
        //         conditions: [new ACondition(this.type, 'AccountId', 'Equal', _.get(account, 'Id'))]
        //     })),
        //     take(1)
        // ).subscribe(locations => {
        //     this.locations$.next(locations);
        // });
    }

}
