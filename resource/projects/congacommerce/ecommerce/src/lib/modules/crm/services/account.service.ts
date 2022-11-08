import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { get, isNil } from 'lodash';
import { MemoizeAll } from 'lodash-decorators';
import { take, filter, tap } from 'rxjs/operators';
import { AObjectService } from '@congacommerce/core';
import { Account } from '../classes/account.model';
import { CartService } from '../../cart/services/cart.service';
import { CategoryService } from '../../catalog/services/category.service';

/**
 * The account service provides methods for interacting with the accounts the user has access to.
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { AccountService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private accountService: AccountService)
}
// or
export class MyService extends AObjectService {
     private accountService: AccountService = this.injector.get(AccountService);
 }
```
**/
@Injectable({
    providedIn: 'root'
})
export class AccountService extends AObjectService {
    type = Account;
    private cartService = this.injector.get(CartService);
    private categoryService = this.injector.get(CategoryService);
    private ACCOUNT_KEY: string = 'account';
    private account: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);
    private PRICELIST_KEY: string = 'pricelistId';

    onInit() {
        this.getCurrentAccount();
    }

    /**
    * Retrieves the account information based on the accountid passed.
    * ### Example:
```typescript
import { AccountService, Account} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    accountDetails: Account;
    accountDetails$: Observable<Account>;

    constructor(private accountService: AccountService){}

    getAccountDetails(Id: string){
        this.accountService.getAccount(Id).subscribe(a => this.accountDetails = a);
        // or
        this.accountDetails$ = this.accountService.getAccount(Id);
    }
}
```
    * @param accountId Id of the account to be fetched.
    * @return an Observable of Account.
    * 
**/
    getAccount(accountId: string): Observable<Account> {
        return accountId ? this.fetch(accountId).pipe() as Observable<Account> : of(null);
    }

    /**
     * Retrieves the account associated with the current user.
     * ### Example:
```typescript
import { AccountService, Account} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    accountDetails: Account;
    accountDetails$: Observable<Account>;

    constructor(private accountService: AccountService){}

    getMyAccountDetails(){
        this.accountService.getMyAccount().subscribe(a => this.accountDetails = a);
        // or
        this.accountDetails$ = this.accountService.getMyAccount();
    }
}
```
     * For guest user it retrieves the account associated with the storefront object.
     * @returns an observable containing the account record
     */
    @MemoizeAll()
    getMyAccount(): Observable<Account> {
        const subject: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);
        this.apiService.get('/admin/v1/accounts/active', this.type)
            .pipe(take(1))
            .subscribe(account => {
                localStorage.setItem(this.ACCOUNT_KEY, get(account, 'Id'));
                subject.next(account as Account)
            });
        return subject.pipe(filter(d => !isNil(d)));
    }

    /**
     * Retrieves the current active account (used for order-on-behalf functions)
     * ### Example:
```typescript
import { AccountService, Account} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    accountDetails: Account;
    accountDetails$: Observable<Account>;

    constructor(private accountService: AccountService){}

    getCurrentAccountDetails(){
        this.accountService.getCurrentAccount().subscribe(a => this.accountDetails = a);
        // or
        this.accountDetails$ = this.accountService.getCurrentAccount();
    }
}
```
     * @returns an observable containing the account record
     */
    @MemoizeAll()
    getCurrentAccount(): Observable<Account> {
        this.apiService.get('/admin/v1/accounts/active', this.type)
            .pipe(take(1))
            .subscribe(account => {
                localStorage.setItem(this.ACCOUNT_KEY, get(account, 'Id'));
                this.account.next(account as Account)
            });
        return this.account.pipe(filter(d => !isNil(d)));
    }

    /**
     * Sets the selected account to be the current active account for order-on-behalf functions.
     * Will store the selected account record in local storage
     * ### Example:
```typescript
import { AccountService, Account} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    accountDetails: Account;
    accountDetails$: Observable<Account>;

    constructor(private accountService: AccountService){}

    setAccount(account: Account | string){
        this.accountService.setAccount(account).subscribe(a => this.accountDetails = a);
        // or
        this.accountDetails$ = this.accountService.setAccount(account);
    }
}
```
     * @param account the account record to set active
     * @param localStorage boolean flag to use to store the selected account in local storage
     * @returns an observable containing the account record that was set to active
     */
    setAccount(account: Account | string, useLocalStorage: boolean = false): Observable<Account> {
        const accountId: string = get(account, 'Id', account);
        localStorage.setItem(this.ACCOUNT_KEY, accountId);
        return this.getAccount(accountId)
            .pipe(
                tap((account) => {
                    localStorage.setItem(this.PRICELIST_KEY, get(account, 'PriceList.Id'));
                    this.account.next(account as Account);
                    this.categoryService.refresh();
                    /* To Do : When active cart API avaialble replace new cart API with active cart API */
                    this.cartService.createNewCart()
                        .pipe(take(1))
                        .subscribe((cart) => this.cartService.refreshCart());
                    this.categoryService.refresh();
                })
            );
    }

}