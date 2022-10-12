import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map as rmap } from 'rxjs/operators';
import { map, get, filter, every, isNil, first } from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { CartItem } from '../../cart/classes/cart-item.model';
import { Favorite } from '../classes/favorite.model';
import { CartService } from '../../cart/services/cart.service';
import { PriceListService } from '../../pricing/services/price-list.service';
import { FavoriteItemRequest } from '../interfaces/index';

/**
 * @ignore
 * Favorite service defines a way to save a configuration as favorite or add a saved configuration to active cart.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends AObjectService {
  override type = Favorite;

  protected cartService: CartService = this.injector.get(CartService);
  protected priceListService: PriceListService = this.injector.get(PriceListService);

  /**
   * @ignore
   */
  // globalFilter(): Observable<Array<AFilter>> {
  //   return this.priceListService.getPriceList().pipe(
  //     take(1),
  //     rmap(priceList => {
  //       return [new AFilter(this.type, [new ACondition(this.type, 'Apttus_Config2__PriceListId__c', 'Equal', `${get(priceList, 'Id')}`)])];
  //     })
  //   )
  // }

  /**
   * @param favoriteId string value representing favorite identifier to fetch details for.
   * @param lookups string value representing the lookups to be fetched for a given favorite.
   * @returns observable containing the favorite record.
   */
  getFavoriteById(favoriteId: string, lookups: string | null = null): Observable<Favorite> {
    const queryParam = lookups ? `?lookups=${lookups}` : '';
    return this.apiService.get(`/Apttus_Config2__FavoriteConfiguration__c/${favoriteId}${queryParam}`, this.type);
  }

  /**
   * @param configurationId string value representing favorite configuration Id.
   * @returns observable containing list of favorite configuration line items. 
   */
  getFavoriteItems(configurationId: string): Observable<Array<CartItem>> {
    return this.apiService.post('/Apttus_Config2__LineItem__c/query', {
      'alias': false,
      'conditions': [
        {
          'field': 'ConfigurationId',
          'filterOperator': 'Equal',
          'value': configurationId
        }
      ],
      'lookups': [
        {
          'field': 'Product',
          'children': [
            {
              'field': 'OptionGroups'
            }
          ]
        },
        {
          'field': 'Option',
          'children': [
            {
              'field': 'OptionGroups'
            }
          ]
        },
        {
          'field': 'ProductOption'
        },
        {
          'field': 'AttributeValue'
        },
        {
          'field': 'AssetLineItem'
        },
        {
          'field': 'PriceListItem'
        }
      ],
      'children': [{
        'field': 'AdjustmentLineItems'
      }]
    }, CartItem, false, false);
  }

  /**
   * This method adds saved favorite configurations to active cart.
   * @param favorite favorite record or string identifier of the favorite.
   * @returns an observable containing list of cart items added from a favorite.
   */
  addFavoriteToCart(favorite: string | Favorite): Observable<Array<CartItem>> {
    const favoriteId = favorite instanceof Favorite ? favorite.Id : favorite;
    return this.cartService.addItem({ 'FavoriteId': favoriteId as string });
  }

  /**
  * The method makes an api call to add the favorite items using the existing favoriteId and
  * returns an observable of list of cartItems which got added to the existing favorite configuration.
  * @param favoriteId is of type string , pass the favorite Id.
  * @param payload is of type Array<FavoriteItemRequest> which consists of productid and qty information
  *  or Array<Number> is an instance of Array with number, consists of linenumber of cartitem,
  * which is part of request payload.
  * @returns an observable of list of cartitems got added to the favorite configuration.
  */
  addFavorite(favoriteId: string, payload: Array<FavoriteItemRequest> | Array<number>): Observable<Array<CartItem>> {
    return this.apiService.post(
      `/favorites/${favoriteId}/items`,
      payload
    );
  }

  /**
   * The method is responsible for creating new favorite by invoking api callout, and returns an observable of
   * favorite which got created with favorite information.
   * @param payload is instance of favorite
   * @returns an observable of Favorite which got newly created.
   */
  createFavorite(payload: Array<Favorite>): Observable<Favorite> {
    const requestObj = map(payload, (item) => item.strip());
    return this.apiService
      .post(`/favorites`, requestObj, this.type)
      .pipe(rmap(res => first(res) as Favorite));
  }

  /**
   * This method removes a given favorite.
   * @param favorite favorite record or favorite Id.
   * @returns observable instance of favorite record.
   */
  removeFavorite(favorite: string | Favorite): Observable<Favorite> {
    const favoriteId = favorite instanceof Favorite ? favorite.Id : favorite;
    return this.apiService.delete(`/favorites/${favoriteId}`, this.type);
  }

  /**
  * This method updates a given favorite. Only Name, Description and Scope of favorite can be updated.
  * @param favorite record to be updated.
  * @returns observable containing favorite record with updated fields.
  */
  updateFavorite(favorite: Favorite): Observable<Favorite> {
    const payload = {
      'Name': favorite.Name,
      'Description': favorite.Description,
      'Scope': favorite.Scope
    }
    return this.apiService.put(`/favorites/${favorite.Id}`, payload, this.type);
  }

  /**
   * This method removes list of favorites passed.
   * @param favoriteIds list of favorite records or string identifiers to be removed.
   * @returns observable containing list of favorites.
   */
  removeFavorites(favoriteList: Array<Favorite> | Array<string>): Observable<Array<Favorite>> {
    const favorites = filter(favoriteList, f => !isNil(f));
    const payload = every(favorites, fav => typeof (fav) === 'string') ?
      map(favorites, fav => ({ Id: fav }))
      : map(favorites, fav => ({ Id: get(fav, 'Id') }));
    return this.apiService.post(`/favorites/delete`, payload, this.type);
  }
}
