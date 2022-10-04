import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map, take, mergeMap, tap, filter, switchMap } from 'rxjs/operators';
import * as LocaleCurrency from 'locale-currency';
import { isNil, get } from 'lodash';
import { plainToClass } from 'class-transformer';
import { AObjectService, ApiService } from '@congacommerce/core';
import { User } from '../classes/user.model';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * The User service provides methods for getting current user related details
 * <h3>Usage</h3>
 *
 ```typescript
 import { UserService, AObjectService } from '@congacommerce/ecommerce';

 constructor(private userService: UserService) {}

 // or

 export class MyService extends AObjectService {
     private userService: UserService = this.injector.get(UserService);
  }
```
 */
@Injectable({
    providedIn: 'root'
})
export class UserService extends AObjectService {
    protected CACHE_KEY: string = 'User';
    type = User;

    apiService: ApiService = this.injector.get(ApiService);

    private state: BehaviorSubject<User> = new BehaviorSubject(null);

    onInit(): void {
        this.refresh();
    }

    /**
     * 
     * @ignore
     * Method Refreshes the user state.
    * ### Example:
    ```typescript
    import { UserService, User } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';

    export class MyComponent implements OnInit{
       
        constructor(private userService: UserService){}
        
          refresh() {
               this.userService.refresh();
           }
       }
   ```
   */
    refresh(): void {
        this.apiService.refreshToken()
            .pipe(
                switchMap(() => this.apiService.get(`/usermanagement/v1/userinfo`, this.type)),
                take(1)
            ).subscribe(user => {
                localStorage.setItem('userId', user.Id);
                this.publish(plainToClass(this.type, user));
            });
    }

    /**
     * @ignore
     * Method updates the state of the user
    * ### Example:
    ```typescript
    import { UserService, User } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';

    export class MyComponent implements OnInit{
       
        constructor(private userService: UserService){}
        
          publish(user: User) {
               this.userService.publish(user);
           }
       }
   ```
   */
    publish(user: User): void {
        this.state.next(user);
    }


    /**
     * @ignore
     * Method gets user details that is active
    * ### Example:
    ```typescript
    import { UserService, User } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';

    export class MyComponent implements OnInit{
       
        user: User;
        user$: Observable<User>
        constructor(private userService: UserService){}
        
          changePassword(pwd:string) {
             this.userService.active().subscribe(user => this.user = user);
               // or
             this.user$ = this.userService.active();
           }
       }
   ```
   */
    active(): Observable<User> {
        return this.state
            .pipe(
                filter(user => !isNil(user))
            );
    }

    /**
     * Method gets active user
     * ### Example:
```typescript
import { UserService, User } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';
export class MyComponent implements OnInit{
    user: User;
    user$: Observable<User>
    constructor(private userService: UserService){}
    
    this.userService.getCurrentUser().subscribe(user => this.user = user);
    // or
    this.user$ = this.userService.getCurrentUser();
  
}
```
     * @returns active user
     */
    getCurrentUser(): Observable<User> {
        return this.active();
    }

    /**
     * Method sets the currency for the current user
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';
     export class MyComponent implements OnInit{
         user: User;
         user$: Observable<User>
         constructor(private userService: UserService){}
         
         this.userService.setCurrency(value).subscribe(user => this.user = user);
         // or
         this.user$ = this.userService.setCurrency(value);
     
     }
     ```
     * @param currencyIsoCode the iso code of the currency to set (i.e. 'USD')
     * @param commit set to true to commit the change to the db.
     * @returns current user with currency
     */
    setCurrency(currencyIsoCode: string, commit: boolean = false): Observable<User> {
        if (commit === true) {
            return this.me().pipe(
                take(1),
                map(user => {
                    user.Currency = LocaleCurrency.getCurrency(currencyIsoCode);
                    return user;
                }),
                mergeMap(user => this.updateCurrentUser(user)),
                tap(() => this.refresh())
            )
        } else {
            return this.me()
                .pipe(
                    tap(user => {
                        user.Currency = LocaleCurrency.getCurrency(currencyIsoCode);
                        this.publish(user);
                    })
                );
        }
    }

    /**
     * Primary method for retrieving the current user record
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';
     export class MyComponent implements OnInit{
         user: User;
         user$: Observable<User>
         constructor(private userService: UserService){}
         
         this.userService.me().subscribe(user => this.user = user);
         // or
         this.user$ = this.userService.me();
     
     }
     ```
     * @returns an observable of type User
    */
    me(): Observable<User> {
        return this.getCurrentUser();
    }

    /**
     * Used for determining if the current user is a guest user.
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         isGuest: boolean;
         constructor(private userService: UserService){}
         
         this.isGuest = this.userService.isGuest();
     
     }
     ```
     * @returns a boolean observable. Will be true if the user is a guest user.
     */
    isGuest(): Observable<boolean> {
        return this.me().pipe(take(1), map(u => u.Alias === 'guest' || !u.Id),);
    }

    /**
     * Method is used to create a guest user record prior to registration. Will set the defaults on the record to browser defaults.
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';
     export class MyComponent implements OnInit{
         guestUser: User;
         guestUser$: Observable<User>
         constructor(private userService: UserService){}
         
         this.userService.initializeGuestUser().subscribe(user => this.user = user);
         // or
         this.user$ = this.userService.initializeGuestUser();
     
     }
     ```
     * @returns a user record containing the browser defaults (will not be committed to db).
     */
    initializeGuestUser(): Observable<User> {
        let u: User = new User();
        let userLang = this.getBrowserLocale();
        u.CountryCode = this.configurationService.get('defaultCountry');
        u.Language = userLang;
        u.Locale = u.Language;
        u.EmailEncodingKey = 'UTF-8';
        u.Alias = 'guest';
        return of(u);
    }

    /**
     * @ignore
     */
    getLocale(): Observable<string> {
        return this.me().pipe(map(user => {
            try {
                if (user.Locale)
                    return get(JSON.parse(user.Locale), 'Name');
                else if (this.configurationService.get('defaultLanguage'))
                    return this.configurationService.get('defaultLanguage');
                else
                    return this.getBrowserLocale(false);
            }
            catch (e) {
                return user.Locale;
            }

        }));
    }

    /**
     * @ignore
     */
    getLanguage(): Observable<string> {
        return this.me().pipe(map(user => {
            if (user.Language)
                return user.Language;
            else if (this.configurationService.get('defaultLanguage'))
                return this.configurationService.get('defaultLanguage');
            else
                return this.getBrowserLocale(false);
        }));
    }

    /**
     * Retrieves the browser locale for the current user
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         lang:string;
         constructor(private userService: UserService){}
         
         getBrowserLocale(){
             this.lang = this.userService.getBrowserLocale();
            }
     }
     ```
     * @param underscore when set to true, will replace dash ('-') with an underscore ('_')
     */
    getBrowserLocale(underscore: boolean = true) {
        let userLang = this.configurationService.get('defaultLanguage', navigator.language);
        if (underscore)
            return userLang.replace('-', '_');
        else
            return userLang;
    }

    /**
    * Retrieves the current user locale to support salesforce and other environment
    * ### Example:
    ```typescript
    import { UserService, User } from '@congacommerce/ecommerce';
    export class MyComponent implements OnInit{
        lang:string;
        constructor(private userService: UserService){}
        
        getCurrentUserLanguage(){
            this.lang = this.userService.getCurrentUserLocale();
        }
    
    }
    ```
    * @param underscore when set to true, will replace dash ('-') with an underscore ('_')
    * @returns it return replaced string for current user locale
    */
    getCurrentUserLocale(underscore: boolean = true): Observable<string> {
        return this.getLocale().pipe(map((result) => {
            let userLang = result;
            if (underscore)
                return userLang.replace('-', '_');
            else
                return userLang.replace('_', '-');

        }));
    }

    /**
     * Method sets the locale for the current user.
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         constructor(private userService: UserService){}
         
         setLocale(value:string){
             this.userService.setLocale(value);
         }
     }
     ```
     * @param locale locale to set on current user
     * @param commit (Optional) Set to true to commit the locale to the user record
     * @returns an observable of type User
     */
    setLocale(locale: string, commit: boolean = false): Observable<void> {
        // this.cacheService._set('locale', locale, true);
        if (commit === true) {
            return this.me().pipe(take(1),
                map(user => {
                    user.Currency = LocaleCurrency.getCurrency(locale);
                    user.Language = locale;
                    user.Locale = locale;
                    return user;
                }),
                mergeMap(user => this.update([user])),
                map(() => null));
        } else {
            return of(null);
            // return of(this.cacheService.refresh(this.CACHE_KEY));
        }
    }

    /**
     * @ignore
     * Primary method for authenticating community users. Uses the SOAP Api to retrieve a session id and associate it with
     * any future calls.
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         constructor(private userService: UserService){}
         
         login(username:string, password:string){
             this.userService.login(username,password);
         }
     
     }
     ```
     * @param username The username of the user to login
     * @param password The password of the user to login
     */
    login(username: string, password: string): Observable<void> {
        return null; //this.apiService.login(username, password).pipe(mergeMap(() => this.cacheService.clear()));
    }

    /**
     * Method will trigger the oauth process for a connected app.
     * @ignore
     * NOTE: You must implement the redirect / callback process and set the returned access token on the force service manually using this.forceService.setAccessToken(...);
     *
     */
    loginOauth(): void {
        //  this.apiService.loginOauth();
    }

    /**
     * @ignore
     * Method will trigger a password reset for the given username
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         constructor(private userService: UserService){}
         
           resetPassword() {
               this.userService.sendPasswordResetEmail();
            }
        }
        ```
     * @param username the username to trigger the password reset for.
     * @returns an observable of type user
     */
    sendPasswordResetEmail(username: string): Observable<any> {
        return this.apiService.post('resetPassword', { email: username });
    }

    /**
     * Primary logout method.
     * @ignore
     * @returns a void observable when the process has completed.
     */
    logout(): Observable<void> {
        return null; // this.apiService.logout().pipe(mergeMap(() => this.cacheService.clear()));
    }

    /**
     * @ignore
     * Method is used to set a password for the current user.
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
        
         user: User;
         user$: Observable<User>
         constructor(private userService: UserService){}
         
           changePassword(pwd:string) {
              this.userService.setPassword(pwd).subscribe(user => this.user = user);
                // or
              this.user$ = this.userService.setPassword(pwd);
            }
        }
    ```
     * @param newPassword the new password to set on the current user.
     * @returns an observable of the current user
     */
    setPassword(newPassword: string): Observable<User> {
        return this.apiService.post('changePassword', { password: newPassword }).pipe(mergeMap(res => this.me()));
    }

    /**
     * @ignore
     * Method is used to determine if the user has authenticated and an access token exists
     * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
        isUserLoggedIn:boolean;
        isUserLoggedIn$:Observable<boolean>;
         constructor(private userService: UserService){}
         
           checkLoginState():boolean {
               this.userService.isLoggedIn().subscribe(res=> isUserLoggedIn = res);
               // or
               isUserLoggedIn$ = this.userService.isLoggedIn();
            }
        }
    ```
     * @returns a boolean observable
     */
    isLoggedIn(): Observable<boolean> {
        return of(true); //To DO: this.me().pipe(map(res => (res.Id && res.Alias !== 'guest') ? true : false));
    }

    /**
    * @ignore
    * Method generates an alias for the current record based on the first name and last name.
    * ### Example:
     ```typescript
     import { UserService, User } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         constructor(private userService: UserService){}
         
           setUserAlias(value) {
               this.userService.setAlias(value);
            }
        }
    ```
    * @param user the user record to set the alias value on
    */
    setAlias(user: User): void {
        if (user.FirstName && user.FirstName.trim().length >= 1 && user.LastName && user.LastName && user.LastName.trim().length >= 1)
            user.Alias = user.FirstName.substring(0, 1) + user.LastName.substring(0, 7);
        else
            user.Alias = '';
    }

    /**
     * Method sets the timezonesidkey for a given user record
     * ### Example:
      ```typescript
      import { UserService, User } from '@congacommerce/ecommerce';
      export class MyComponent implements OnInit{
          constructor(private userService: UserService){}
          
            setTimezone(value) {
                this.userService.setTimezone(value);
             }
         }
    ```
     * @param user the user record to set the timezonesidkey on
     */
    setTimezone(user: User): void {
        user.TimeZoneSidKey = this.configurationService.get('defaults.timeZoneSidKey', 'America/New_York');
        // user.TimeZoneSidKey = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    /**
     * Method sets the defaults like language, locale & email encoding type for user
     * ### Example:
     ```typescript
      import { UserService, User } from '@congacommerce/ecommerce';
      export class MyComponent implements OnInit{
          constructor(private userService: UserService){}
          
            setDefaultUserData(value) {
                this.userService.setUserDefaults(value);
             }
         }
    ```
     * @param user the user record to set the defaults on
     */
    setUserDefaults(user: User): void {
        user.Language = this.getBrowserLocale();
        user.Locale = user.Language;
        user.EmailEncodingKey = 'UTF-8';
    }

    /**
     * @ignore
     * Primary method for registering a given user record. Set any defaults on the user record passed in as the first argument.
     * Will associate an account and a profile with the user record based on the community settings.
     * ### Example:
      ```typescript
      import { UserService, User } from '@congacommerce/ecommerce';
      export class MyComponent implements OnInit{
          constructor(private userService: UserService){}
          
            registration(value) {
                this.userService.register(value);
             }
         }
    ```
     * @param user A user record with defaults set
     * @returns an observable of the register user
     */
    register(user: User): Observable<User> {
        this.setAlias(user);
        this.setTimezone(user);
        this.setUserDefaults(user);
        delete user.Contact;
        return this.apiService.post('register', {
            u: JSON.stringify(user)
        });
    }

    /**
     * Method updates the user details.
     * ### Example:
      ```typescript
      import { UserService, User } from '@congacommerce/ecommerce';
      export class MyComponent implements OnInit{
          constructor(private userService: UserService){}
          
            updateUserInfo(value) {
                this.userService.updateCurrentUser(value);
             }
         }
    ```
     * @param user the user record to update.
     * @returns an observable of the updated user.
     */
    updateCurrentUser(user: User): Observable<User> {
        const payload = user.strip();
        return this.apiService.put(`/usermanagement/v1/users/${user.Id}`, payload, this.type).pipe(
            tap(res => this.publish(res as User))
        )
    }
}
