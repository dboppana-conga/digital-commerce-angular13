import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { get, isNil, isEmpty, map as _map } from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import {
  Favorite,
  FavoriteService,
  CartItem,
  Product,
  FavoriteItemRequest,
  PriceListService,
  UserService
} from '@congacommerce/ecommerce';
import { LookupOptions } from '../../shared/interfaces/lookup-option.interface';
import { ExceptionService } from '../../shared/services/exception.service';

/**
 * <strong>This component is a work in progress.</strong>
 * Favorite modal lets you add products/cart line items from the drawer to the Favorite Configuration.
 * The modal provides option to choose from existing favorites or allow 
 * users to create new favorite and add/update items to the favorite configuartion.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/favorite%20modal.png" style="max-width: 100%">
 * <h3>Usage</h3>
 * 
 * ```typescript
import { FavoriteModalModule } from '@congacommerce/elements';
@NgModule({
  imports: [FavoriteModalModule, ...]
})
export class AppModule {}
 ```
*
* @example
 ```typescript
* <apt-favorite-modal></apt-favorite-modal>
 ```
*/

@Component({
  selector: 'apt-favorite-modal',
  templateUrl: './favorite-modal.component.html',
  styleUrls: ['./favorite-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FavoriteModalComponent implements OnInit, OnDestroy {
  /**
  * @ignore
  * */
  favorite = new Favorite();
  lookupResults: Array<Favorite> = [];
  view$: BehaviorSubject<Array<Favorite>> = new BehaviorSubject<Array<Favorite>>(null);
  layout: 'AddExistingFav' | 'AddNewFav' = 'AddExistingFav';
  value: string;
  favoriteName: string;
  loading: Boolean = false;
  lookUpLoading: Boolean = false;

  _items: Array<CartItem | Product>;
  searchTerm: string;
  lookupOptions: LookupOptions = {
    primaryTextField: 'Name',
    fieldList: ['Id', 'Name'],
  };
  sub: Subscription;

  constructor(
    public modalRef: BsModalRef,
    private plService: PriceListService,
    private userService: UserService,
    private exceptionService: ExceptionService,
    private favService: FavoriteService
  ) { }

  ngOnInit(): void {
    this.setFavLookupFieldData();
    if (this.view$) {
      this.sub = this.view$.subscribe((r) => {
        if (r && r.length === 0) this.layout = 'AddNewFav';
      });
    }
  }

  /**
   * @ignore
   * */
  onLookupSearch(data) {
    this.favoriteName = get(data, 'term');
    this.setFavLookupFieldData(get(data, 'term'));
  }

  /**
   * @ignore
   * */
  setFavLookupFieldData(searchString: string = '') {
    this.searchTerm =
      searchString.trim().length > 0
        ? `'${searchString.trim()}'`
        : searchString.trim();
    this.lookUpLoading = true;

    let options = {
      conditions: null,
      expressionOperator: 'AND',
      filters: null,
      sortOrder: null,
      fieldList: ['Name', 'Id']
    };
    if (searchString) options['searchString'] = searchString;

    let recordObsv$: Observable<any> = of(null);
    if (!isNil(this.value)) recordObsv$ = this.favService.fetch(this.value);

    combineLatest([this.userService.getCurrentUser(), this.plService.getPriceListId()])
      .pipe(
        switchMap(([user, plId]) => {
          let filters = [];
          // filters.push(new AFilter(this.favService.type, [
          //   new ACondition(this.favService.type, 'Scope', 'Equal', 'Private'),
          //   new ACondition(this.favService.type, 'CreatedById', 'Equal', get(user, 'Id')),
          //   new ACondition(this.favService.type, 'OwnerId', 'Equal', get(user, 'Id'))
          // ], null, 'AND'));
          // filters.push(new AFilter(this.favService.type, [
          //   new ACondition(this.favService.type, 'Scope', 'Equal', 'Public')], null, 'AND'));

          // options.filters = [new AFilter(this.favService.type, null, filters, 'OR')];
          // const obsv$ =
          //   !this.lookupResults || this.lookupResults.length === 0
          //     ? this.favService.query(assign(options))
          //     : of(this.lookupResults);
          // return combineLatest([obsv$, recordObsv$])
          return of(null);
        }),
        take(1))
      .subscribe(
        ([results, record]) => {
          this.lookUpLoading = false;
          if (!isNil(record) && !isEmpty(results)) results.unshift(record);
          this.lookupResults = results;
          this.view$.next(this.lookupResults);
        },
        (err) => {
          this.lookUpLoading = false;
          this.view$.next(null);
        }
      );
  }

  /**
   * Method Addfavorite is responsible for adding the products or lineitems 
   * to the already existing Favorite configuration fro the drawer.
   * @fires this.favService.addFavorite 
   * */
  addFavorite() {
    this.loading = true;
    const payload = this.generatePayload();
    this.favService
      .addFavorite(this.value, payload)
      .pipe(take(1))
      .subscribe(
        (succ) => {
          this.loading = false;
          this.modalRef.hide();
          const result = this.lookupResults.find(r => r.Id === this.value);
          this.exceptionService.showSuccess(
            'SUCCESS.FAVORITE.UPDATE_FAVORITE',
            'SUCCESS.TITLE',
            { name: result.Name }
          );
        },
        (err) => {
          this.loading = false;
          this.modalRef.hide();
        }
      );
  }

  /**
   * Method createFavorite is responsible for creating new favorite and 
   * adding the products or lineitems to the newly created favorite configuration.
   * @fires this.favService.createFavorite 
   * @fires this.favService.addFavorite
  * */
  createFavorite() {
    this.loading = true;
    this.plService
      .getPriceListId()
      .pipe(
        switchMap((pId: string) => {
          if (!this.favorite.Scope) this.favorite.Scope = 'Private';
          this.favorite.PriceListId = pId;
          this.favorite.Name = this.favoriteName;
          return this.favService.createFavorite([this.favorite]);
        }),
        switchMap((fav: Favorite) => {
          this.favorite = fav;
          const payload = this.generatePayload();
          return this.favService.addFavorite(fav.Id, payload);
        }),
        take(1)
      )
      .subscribe(
        (succ) => {
          this.loading = false;
          this.modalRef.hide();
          this.exceptionService.showSuccess(
            'SUCCESS.FAVORITE.ADD_FAVORITE',
            'SUCCESS.TITLE',
            { name: this.favorite.Name }
          );
        },
        (err) => {
          this.loading = false;
          this.modalRef.hide();
        }
      );
  }

  /**
   * @ignore
   */
  private generatePayload(): Array<FavoriteItemRequest> | Array<number> {
    let payload: Array<FavoriteItemRequest> | Array<number> = [];
    if (this._items[0] instanceof CartItem)
      payload = _map(this._items, 'LineNumber');
    if (this._items[0] instanceof Product) {
      payload = _map(this._items, (item) => ({
        ProductId: item.Id,
        Quantity: item.Quantity ? item.Quantity : 1,
      }));
    }
    return payload;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
