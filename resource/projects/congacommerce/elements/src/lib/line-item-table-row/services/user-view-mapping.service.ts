import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map as _map, get, pickBy, keys, first, includes, isEqual, cloneDeep, forEach } from 'lodash';
import { UserView, UserViewService, CartItem } from '@congacommerce/ecommerce';
import { CartItemView } from '../interfaces/line-item-view.interface';

/**
 * <strong>Work in Progress</strong>
 * 
 * User view mapping service maps the response from user view service to CartItemView interface.
 * <h3>Usage</h3>
 *
 ```typescript
    import { UserViewMappingService, AObjectService  } from '@congacommerce/ecommerce';
    constructor(private mappingService: UserViewMappingService) { }
// or
    export class MyService extends AObjectService {
     private mappingService: UserViewMappingService = this.injector.get(UserViewMappingService);
    }
 ```
 */
@Injectable({
  providedIn: 'root'
})
export class UserViewMappingService implements OnDestroy {

  /**
   * Behavior subject containing list of cart item views, for all cart item field selections available on cart page.
   */
  cartItemView$: BehaviorSubject<Array<CartItemView>> = new BehaviorSubject(null);

  /**
   * Behavior subject containing list of cart item views, for the selected cart item fields on cart page.
   */
  selectedItems$: BehaviorSubject<Array<CartItemView>> = new BehaviorSubject(null);

  /** @ignore */
  currentSelections: Array<CartItemView> = [];

  /** @ignore */
  subscriptions: Array<Subscription> = new Array();

  constructor(private userViewService: UserViewService) {
    this.subscriptions.push(this.userViewService.getUserView().subscribe(res => {
      const myView = this.mapUserView(res);
      this.updateUserView(myView);
    }));
  }

  /**
   * This method saves the cart item fields selected from line item menu component.
   * ### Example:
     ```typescript
    import { UserViewMappingService } from '@congacommerce/ecommerce'; 
    constructor(private mappingService: UserViewMappingService) { }
    saveSelections(): void {
    this.mappingService.saveUserSelections(this.menuItems$.value).subscribe(...);
  }
   ```
   * @fires userViewService.updateUserView().
   * @param view list of cart item view records to be saved.
   */
  saveUserSelections(view: Array<CartItemView>) {
    // Save changes only if current selections are changed.
    if (!isEqual(view, this.currentSelections)) {
      this.updateUserView(view);
      const userViews = this.userViewService.userViews;
      const selectedFieldIds = _map(this.selectedItems$.value, item => item.id);
      forEach(userViews, view => {
        view.isSelected = includes(selectedFieldIds, view.displayColumn.Id);
      });
      this.subscriptions.push(this.userViewService.updateUserView(userViews).subscribe());
    }
  }

  /**
   * @ignore
   */
  updateUserView(view: Array<CartItemView>) {
    this.currentSelections = cloneDeep(view);
    this.cartItemView$.next(view);
    const selectedItems = filter(this.cartItemView$.value, item => item.isSelected);
    this.selectedItems$.next(selectedItems);
  }

  /**
   * This method returns the list of CartItemView records, for all cart item field selections available on cart page.
   * ### Example:
     ```typescript
    import { UserViewMappingService } from '@congacommerce/ecommerce';
    constructor(private mappingService: UserViewMappingService) { }
    ngOnInit(): void {
    this.menuItems$ = this.mappingService.getCurrentView();
  }
  ```
   * @returns List of CartItemView records.
   */
  getCurrentView(): BehaviorSubject<Array<CartItemView>> {
    return this.cartItemView$;
  }

  /**
   * This method returns the list of CartItemView records, for the selected cart item fields on cart page.
   * ### Example:
     ```typescript
    import { UserViewMappingService } from '@congacommerce/ecommerce';
    constructor(private mappingService: UserViewMappingService) { }
    ngOnInit(): void {
    this.menuItems$ = this.mappingService.getSelectedItems();
  }
  ```
   * @returns List of CartItemView records.
   */
  getSelectedItems(): BehaviorSubject<Array<CartItemView>> {
    return this.selectedItems$;
  }

  /**
   * This method maps list of user view records to a list of CartItemView.
   * ### Example:
     ```typescript
    import { UserViewMappingService } from '@congacommerce/ecommerce';
    constructor(private mappingService: UserViewMappingService) { }
     this.subscriptions.push(this.userViewService.getUserView().subscribe(res => {
            const myView = this.mappingService.mapUserView(res);
     }));
     }
     ```
   * @param userView list of user view records to be mapped to CartItemView.
   * @returns list of CartItemView records mapped from user views.
   */
  mapUserView(userView: Array<UserView>): Array<CartItemView> {
    const views: Array<CartItemView> = new Array<CartItemView>();
    _map(userView, item => {
      const view = {
        id: get(item, 'displayColumn.Id'),
        fieldName: get(item, 'displayColumn.FieldName'),
        sequence: get(item, 'displayColumn.Sequence'),
        label: this.getFieldLabel(get(item, 'displayColumn.FieldName')),
        isEditable: get(item, 'displayColumn.IsEditable'),
        isSelected: get(item, 'isSelected')
      };
      views.push(view as CartItemView);
    });
    return views;
  }

  /** 
   * @ignore
   */
  getFieldLabel(field: string): string {
    const cartItemFields = new CartItem().getMetadataFromExpose();
    const label = ''; // first(keys(pickBy(cartItemFields, { name: field })));
    return label ? label : field;
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}