import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { get, remove, find, filter, includes, map as _map, forEach } from 'lodash';
import { Product, CartItem, CartService, Cart, PriceListService } from '@congacommerce/ecommerce';
/**
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Batch selection service keeps track of which products & cartItems in the application have been selected for batch actions.
 * 
 */
export class BatchSelectionService {
  /**
   * List of currently selected products.
   */
  private products: Array<Product> = [];
  /**
   * List of products to be subscribed to.
   */
  public _products: BehaviorSubject<Array<Product>> = new BehaviorSubject<Array<Product>>([]);

  /**
   * List of currently selected lineItems.
   */
  private lineItems: Array<CartItem> = [];
  /**
   * List of lineItems to be subscribed to.
   */
  public _lineItems: BehaviorSubject<Array<CartItem>> = new BehaviorSubject<Array<CartItem>>([]);

  private cartSubscription: Subscription = null;

  constructor(private cartService: CartService, private plService: PriceListService) {
    this.cartSubscription = this.cartService.getMyCart().subscribe(cart => {
      this.updateLineItemSelections(cart.LineItems);
      this.updateProductSelections(cart);
    });
  }

  /**
   * Adds a new product to the list of selected products.
   * @param product Product to be added to the selection.
   */
  public addProductToSelection(product: Product) {
    this.products.unshift(product);
    this._products.next([...this.products]);
  }

  /**
   * Adds all products to the list of selected products.
   * @param products Products to be added to the selection.
   */
  public addAllProductstoSelection(products: Array<Product>) {
    forEach(products, (p) => {
      if (filter(this.products, ['Id', p.Id]).length <= 0) {
        this.products.unshift(p);
      }
    });
    this._products.next([...this.products]);
  }

  /**
   * Removes products from the list of selected products.
   * @param product Product to be removed from the selection.
   */
  public removeProductFromSelection(product: Product) {
    remove(this.products, { 'Id': product.Id });
    this._products.next([...this.products]);
  }

  /**
   * Removes all products from the list of selected products.
   * @param products Products to be removed from the selection.
   */
  public removeAllProductsFromSelection(products: Array<Product>) {
    forEach(products, (p) => {
      if (filter(this.products, ['Id', p.Id]).length >= 0) {
        remove(this.products, { 'Id': p.Id });
      }
    });
    this._products.next([...this.products]);
  }

  /**
   * @ignore
   */
  public removeAllProducts() {
    this.products = [];
    this._products.next([]);
  }

  /**
   * Adds a list of products to drawer selection.
   * @param products List of products to be added to drawer selection
   */
  public setSelectedProducts(products: Array<Product>) {
    this.products = products;
    this._products.next([...this.products]);
  }

  /**
   * Gets the list of currently selected products.
   * @returns Observable<Array<Product>> return an array list of products.
   */
  public getSelectedProducts(): Observable<Array<Product>> {
    return this._products;
  }

  /**
   * Checks if the given product is part of the selected product list.
   * @param product Product to check against the list of selected products.
   * @returns an observable of type boolean.
   */
  public isProductSelected(product: Product): Observable<boolean> {
    return of(!!find(this.products, { Id: product.Id }));
  }

  /**
   * update product list in drawer if pricelist is changed when switching cart
   * @param cart Cart to check pricelist of the cart
   */
  private updateProductSelections(cart: Cart) {
    const nonExistingSelections = this.plService.isValidPriceList(get(cart, 'PriceList')) ? filter(this._products.value, p => !includes(_map(get(p, 'PriceLists'), item => item.PriceList.Id), get(cart, 'PriceList.Id'))) : this._products.value;
    _map(nonExistingSelections, selection => this.removeProductFromSelection(selection));
  }

  /**
   * Adds a new lineitem to the list of selected lineItems.
   * @param lineItem LineItem to be added to the selection.
   */
  public addLineItemToSelection(lineItem: CartItem) {
    this.lineItems.unshift(lineItem);
    this._lineItems.next([...this.lineItems]);
  }

  /**
   * Adds all lineitems to the list of selected LineItems.
   * @param lineItems LineItems to be added to the selection.
   */
  public addAllLineItemstoSelection(lineItems: Array<CartItem>) {
    forEach(lineItems, (l) => {
      if (filter(this.lineItems, ['Id', l.Id]).length <= 0) {
        this.lineItems.unshift(l);
      }
    });
    this._lineItems.next([...this.lineItems]);
  }

  /**
   * Removes LineItems from the list of selected LineItems.
   * @param lineItem CartItem to be removed from the selection.
   */
  public removeLineItemFromSelection(lineItem: CartItem) {
    remove(this.lineItems, { 'Id': lineItem.Id });
    this._lineItems.next([...this.lineItems]);
  }

  /**
   * Removes all lineItems from the list of selected lineItem.
   * @param lineItems LineItems to be removed from the selection.
   */
  public removeAllLineItemsFromSelection(lineItems: Array<CartItem>) {
    forEach(lineItems, (l) => {
      if (filter(this.lineItems, ['Id', l.Id]).length >= 0) {
        remove(this.lineItems, { 'Id': l.Id });
      }
    });
    this._lineItems.next([...this.lineItems]);
  }

  /**
   * @ignore
   */
  public removeAllLineitems() {
    this.lineItems = [];
    this._lineItems.next([]);
  }

  /**
   * Adds a list of cart items to drawer selection.
   * @param lineItems List of cart items to be added to drawer selection.
   */
  public setSelectedLineItems(lineItems: Array<CartItem>) {
    this.lineItems = lineItems;
    this._lineItems.next([...this.lineItems]);
  }

  /**
   * Gets the list of currently selected lineItem.
   * @returns Observable<Array<CartItem>> return an array list of cart items.
   */
  public getSelectedLineItems(): Observable<Array<CartItem>> {
    return this._lineItems;
  }

  /**
   * Checks if the given lineItem is part of the selected lineItem list.
   * @param lineItem lineItem to check against the list of selected lineItems.
   * @returns an observable of type boolean.
   */
  public isLineItemSelected(lineItem: CartItem): Observable<boolean> {
    return of(!!find(this.lineItems, { Id: lineItem.Id }));
  }

  /**
   * @ignore
   */
  private updateLineItemSelections(items: Array<CartItem>) {
    const nonExistingSelections = filter(this._lineItems.value, li => !includes(_map(items, item => item.Id), li.Id));
    _map(nonExistingSelections, selection => this.removeLineItemFromSelection(selection));
  }

  ngOnDestroy() {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
  }
}
