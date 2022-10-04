import { Injectable } from '@angular/core';
import { Contact } from '../classes/index';
import { AObjectService } from '@congacommerce/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map, catchError} from 'rxjs/operators';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * The contact service provides methods for interacting with the contacts the current user has access to.
 <h3>Usage</h3>
 *
 ```typescript
import { ContactService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private contactService: ContactService)
}
// or
export class MyService extends AObjectService {
     private contactService: ContactService = this.injector.get(ContactService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class ContactService extends AObjectService{
    type = Contact;
    protected userService = this.injector.get(UserService);

    /**
     * Gets the contact record for the current user. If the user is not logged in, it will return a new contact instance.
     * ### Example:
```typescript
import { ContactService, Contact } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    contact: Contact;
    contact$: Observable<Contact>;

    constructor(private contactService: ContactService){}

    ngOnInit(){
        this.contactService.getMyContact().subscribe(c => this.contact = c);
        // or
        this.contact$ = this.contactService.getMyContact();
    }
}
```
     * @returns an Observable containing the current contact record
     *
     */
    public getMyContact(): Observable<Contact> {
        // To Do:
        // return this.userService.me().pipe(mergeMap(user => {
        //     if (user.Id && user.Alias !== 'guest')
        //         return this.where(null, 'AND', null, null, null, [
        //             new AJoin(User, 'Id', 'ContactId', [new ACondition(User, 'Id', 'Equal', user.Id)])
        //         ])
        //         .pipe(
        //             map(res => {
        //                 if(!isEmpty(res))
        //                     return first(res);
        //                 else
        //                     return this.getInstance();
        //             })
        //         );
        //     else
        //         return of(this.getInstance());
        // }));
        return null;
    }

    /**
     * Gets the contact record for the current user. If the user is not logged in.
     * ### Example:
```typescript
import { ContactService, Contact } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    contact: Contact;
    contact$: Observable<Contact>;

    constructor(private contactService: ContactService){}

    ngOnInit(){
        this.contactService.getContactForUser().subscribe(c => this.contact = c);
        // or
        this.contact$ = this.contactService.getContactForUser();
    }
}
```
     * @returns an Observable containing the current contact record
     */
    public getContactForUser(): Observable<Contact> {
        //TO Do:
        return null;
        // this.apiService.userId().pipe(
        //     mergeMap(userId => this.where([new ACondition(this.type, 'UserId', 'Equal', userId)])),
        //     map(contacts => contacts[0]),
        //     catchError(e => {
        //         return null;
        //     }),);
    }

     /**
     * Gets the contact record based on first name, last name and email address passed.
     * ### Example:
```typescript
import { ContactService, Contact } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    contact: Contact;
    contact$: Observable<Contact>;

    constructor(private contactService: ContactService){}

    ngOnInit(){
        this.contactService.getContact(firstName, lastName, email).subscribe(c => this.contact = c);
        // or
        this.contact$ = this.contactService.getContact(firstName, lastName, email);
    }
}
```
     * @param objQueryParams A object contains properties like firstName, lastName, email etc..
     * @returns an Observable containing the current contact record.
     * 
     * 
     */
    public getContact(objQueryParams): Observable<Contact>{
        // To DO: 
        const conditionList = [];
        for (const key in objQueryParams) {
            // if (objQueryParams[key]) {
            //     conditionList.push(new ACondition(this.type, key, 'Equal', objQueryParams[key]));
            // }
        }
       // return this.where(conditionList,'AND',null,null,null,null,true).pipe(
        // map(res => res[0]),
        // catchError(e => {
        //     return null;
        // }),);
        return null;
    }
}