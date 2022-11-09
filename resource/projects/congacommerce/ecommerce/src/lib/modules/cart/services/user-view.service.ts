import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { get, isEmpty, map as _map } from 'lodash';
import { AObjectService, ApiService } from '@congacommerce/core';
import { User } from '../../crm/classes/user.model';
import { ConfigCustomDisplayColumns } from '../classes/config-custom-display-columns.model';
import { UserService } from '../../crm/services/user.service';

/**
 * <strong> This service is a work in progress</strong>
 * User view service returns the configurable view of cart item fields to be displayed for a user on cart page.
 * <h3>Usage</h3>
*
```typescript
import { UserViewService, AObjectService} from '@congacommerce/ecommerce';

constructor(private userViewService: UserViewService) {}

// or

export class MyService extends AObjectService {
     private userViewService: UserViewService = this.injector.get(UserViewService);
 }
```
 **/

@Injectable({
  providedIn: 'root'
})

export class UserViewService extends AObjectService {
  type = ConfigCustomDisplayColumns;

  /**
   * List of user view records for a given user.
   */
  userViews: Array<UserView> = new Array();

  storageKey = 'user-view';

  apiService: ApiService = this.injector.get(ApiService);
  protected userService: UserService = this.injector.get(UserService);

  /**
   * This method fetches the list of display columns for cart item fields, matching the default user view.
   * ### Example:
     ```typescript
     import { UserViewService } from '@congacommerce/ecommerce';

     constructor(private userViewService: UserViewService) {
     this.subscriptions.push(this.userViewService.getUserView().subscribe(res => {....}));
     }
   ```
   * @param viewId string identifier, an optional parameter representing the user view.
   * @returns an observable containing list of display columns for cart item fields.
   * To DO:  Add back when API is available
   */
  getUserView(viewId: string = null): Observable<Array<UserView>> {
    return of(null);
    // return this.userService.getCurrentUser().pipe(
    //   switchMap((user: User) => {
    //     const view = get(JSON.parse(localStorage.getItem(this.storageKey)), `${user.Id}`);
    //     if (!isEmpty(view)) return of(view);

    //     if (viewId) {
    //       return this.apiService.get(`/users/${get(user, 'Id')}/views/${viewId}`);
    //     }
    //     else {
    //       return this.apiService.get(`/users/${get(user, 'Id')}/views/active`);
    //     }
    //   }),
    //   map(data => {
    //     this.userViews = data as Array<UserView>;
    //     const mappedViews: Array<UserView> = [];
    //     _map(data, item => {
    //       const view = {
    //         isSelected: item.IsSelected,
    //         displayColumn: plainToClass(this.type, item.DisplayColumn) as unknown as ConfigCustomDisplayColumns
    //       }
    //       mappedViews.push(view as UserView);
    //     });
    //     return mappedViews;
    //   })
    // );
  }

  /**
   * @ignore
   */
  getUserViews(): Observable<Array<ConfigCustomDisplayColumns>> {
    return of(null);
    // return this.userService.getCurrentUser().pipe(
    //   switchMap((user: User) => this.apiService.get(`/users/${get(user, 'Id')}/views`)),
    //   map(res => plainToClass(this.type, res) as unknown as Array<ConfigCustomDisplayColumns>)
    // );
  }

  /**
   * This method stores the given list of user view records in browser storage.
   * ### Example:
     ```typescript
     import { UserViewService, UserView } from '@congacommerce/ecommerce';
      result$: Observable<boolean> ;
      result: boolean;
     constructor(private userViewService: UserViewService) {
      updateUserView(view: Array<UserView>){
        this.userViewService.updateUserView(view).subscribe(c => this.result = c);
        //or
        this.result$= this.userViewService.updateUserView(view);
      }
     
     }));
     }
     ```
   * @param view list of user view records to be stored.
   * @returns an observable of boolean.
   * To DO:  Add back when API is available
   */
  updateUserView(view: Array<UserView>, viewId: string = null): Observable<boolean> {
    return of(null);
    // return this.userService.getCurrentUser().pipe(
    //   switchMap((user: User) => {
    //     if (view) {
    //       localStorage.setItem(this.storageKey, JSON.stringify({ [user.Id]: view }));
    //       return of(true);
    //     }
    //     return of(false);
    //   })
    // );
  }

}

export interface UserView {
  /**
   * Flag indicates if cart item field is part of the user view.
   */
  isSelected: boolean;

  /**
   * An instance of ConfigCustomDisplayColumns record with cart item field properties like Field name, Sequence, IsEditable.
   */
  displayColumn: ConfigCustomDisplayColumns;
}
