
import {of, empty,  Observable, Observer, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '@congacommerce/ecommerce';
import * as _ from 'lodash';
/**
 * @ignore
 */

@Injectable({
  providedIn: 'root'
})
/**
 * Product selection service keeps track of which products in the application have been selected for batch actions.
 */
export class ProductSelectionService {
  /**
   * List of currently selected products.
   */
  private products: Array<Product> = [];
  /**
   * List of products to be subscribed to.
   */
  private _products: BehaviorSubject<Array<Product>> = new BehaviorSubject<Array<Product>>([]);
  /**
   * Adds a new product to the list of selected products.
   * @param product Product to be added to the selection.
   */
  public addProductToSelection(product: Product) {
    this.products.unshift(product);
    this._products.next([...this.products]);
  }
  /**
   * Removes products from the list of selected products.
   * @param product Product to be removed from the selection.
   */
  public removeProductFromSelection(product: Product) {
    _.remove(this.products, product);
    this._products.next([...this.products]);
  }

  public setSelectedProducts(products: Array<Product>) {
    this.products = products;
    this._products.next([...this.products]);
  }
  /**
   * Gets the list of currently selected products.
   * @returns an observable of selected products
   */
  public getSelectedProducts(): Observable<Array<Product>> {
    return this._products;
  }
  /**
   * Checks if the given product is part of the selected product list.
   * @param product Product to check against the list of selected products.
   * @returns Observable<boolean> true if product is selected and false if not
   */
  public isProductSelected(product: Product): Observable<boolean> {
    return of(!!_.find(this.products, {Id: product.Id}));
  }

}
