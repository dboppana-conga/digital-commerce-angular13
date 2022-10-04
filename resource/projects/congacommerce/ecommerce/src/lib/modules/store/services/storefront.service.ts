import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { get, isNil } from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { Storefront } from '../../store/classes/storefront.model';
import { UserService } from '../../crm/services/user.service';

/**
 * The storefront record is the backbone to the customer experience. It drives catalog, pricing and interface.
 * 
 * <h3>Usage</h3>
 *
 ```typescript
 import { StorefrontService, AObjectService } from '@congacommerce/ecommerce';

 constructor(private storeFrontService: StorefrontService) {}

 // or

 export class MyService extends AObjectService {
     private storeFrontService: StorefrontService = this.injector.get(StorefrontService);
  }
 */
@Injectable({
  providedIn: 'root'
})
export class StorefrontService extends AObjectService {
  type = Storefront;

  private userService: UserService = this.injector.get(UserService);
  private state: BehaviorSubject<Object> = new BehaviorSubject<Object>(null);

  onInit() {
    this.refresh();
  }

  /**
   * This method is responsible for fetching the active storefront record.
   * @ignore
   * ### Example:
     ```typescript
     import { StorefrontService } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         constructor(private storeFrontService: StorefrontService) {}
         
         this.storeFrontService.refresh();
     }
     ```
   */
  refresh(): void {
    this.userService.me().pipe(
      switchMap(() => this.apiService.get('admin/v1/storefronts/active')),
      take(1)
    ).subscribe(data => this.state.next(data));
  }

  /**
   * @ignore
   */
  active(): Observable<Object> {
    return this.state;
  }

  /**
   * Retrieves the storefront record
   * ### Example:
   ```typescript
   import { StorefrontService, Storefront } from '@congacommerce/ecommerce';
   import { Observable } from 'rxjs/Observable';
   export class MyComponent implements OnInit{
    storefront: Storefront;
    storefront$: Observable<Storefront>;
    constructor(private storefrontService: StorefrontService){}
    ngOnInit(){
        this.storefrontService.getStorefront().subscribe(s => this.storefront = s);
        // or
        this.storefront$ = this.storefrontService.getStorefront();
    }
}
   ```
   * @returns an Observable containing the storefront record
   */
  getStorefront(): Observable<Storefront> {
    return this.state.pipe(
      filter(d => !isNil(d)),
      map(data => {
        return plainToClass(this.type, data);
      })
    );
  }

  /**
   * @ignore
   */
  getTurboEnvironment(): Observable<string> {
    return this.getSetting('Turbo');
  }

  /**
   * @ignore
   */
  getDeferredPrice(): Observable<boolean> {
    return this.getSetting('DeferPricing');
  }

  /**
   * @ignore
   */
  isFavoriteDisabled(): Observable<boolean> {
    return this.getSetting('DisableFavorites');
  }

  /**
   * @ignore
   */
  getSetting(key: string): Observable<any> {
    return this.state.pipe(
      filter(r => !isNil(r)),
      map(res => get(res, key))
    )
  }

}