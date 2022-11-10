import { Injectable } from '@angular/core';
import { zip, throwError as observableThrowError, iif as observableIif, of, Observable, combineLatest } from 'rxjs';
import { map, take, mergeMap, tap, delayWhen, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { first, isEmpty, isNil, get, set, defaultTo, filter, forEach } from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { CartService } from '../../cart/services/cart.service';
import { CartItemService } from '../../cart/services/cart-item.service';
import { CartItem, Cart } from '../../cart/classes/index';
import { NoteService } from '../../catalog/services/note.service';
import { AttachmentService } from '../../catalog/services/attachment.service';
import { PriceListService } from '../../pricing/services/price-list.service';
import { UserService } from '../../crm/services/user.service';
import { AccountService } from '../../crm/services/account.service';
import { Order, OrderLineItem } from '../classes/index';
import { Contact } from '../../crm/classes/contact.model';
import { Account } from '../../crm/classes/account.model'
import { AccountInfo } from '../../crm/interfaces/account-info.interface';
import { FieldFilter } from '../../../interfaces';
import { plainToClass } from 'class-transformer';
import { OrderLineItemService } from './order-line-item.service';
import { CartItemProductService } from '../../cart/services/cart-item-product.service';

/**
 * 
 * The order represents purchase of products. The orders are generally converted from the cart.
 *   
 * <h3>Usage</h3>
 *
 ```typescript
 import { OrderService } from '@congacommerce/ecommerce';
 
 constructor(private orderService: OrderService) {}
 
 // or
 
 export class MyService extends AObjectService {
      private orderService: OrderService = this.injector.get(OrderService);
  }
 ```
 */
@Injectable({
    providedIn: 'root'
})
export class OrderService extends AObjectService {
    type = Order;

    cartItemService = this.injector.get(CartItemService);
    protected userService = this.injector.get(UserService);
    protected cartService = this.injector.get(CartService);
    protected priceListService = this.injector.get(PriceListService);
    protected accountService = this.injector.get(AccountService);
    private itemService = this.injector.get(CartItemService);
    private translateService = this.injector.get(TranslateService);
    private cartItemProductService: CartItemProductService = this.injector.get(CartItemProductService);
    private noteService = this.injector.get(NoteService);
    private attachmentService = this.injector.get(AttachmentService);
    private orderLineItemService = this.injector.get(OrderLineItemService);

    /**
     * The method fetches the order based on given order Id in parameter.
     * ### Example:
     ```typescript
     import { OrderService, Order } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';
     export class MyComponent implements OnInit{
           result: Order
           result$: Observable<Order>;
           constructor(private orderService: OrderService){}

           getOrder(orderId: string){
            this.orderService.getOrder(orderId).subscribe(r => this.result = r);
            // or
            results$ = this.orderService.getOrder(orderId);                
           }
      }
     ```
     * @param Id is an order Id is of type string.
     * @returns An observable containing the array of Order for a given Order Id.
     */
    getOrder(Id: string): Observable<Order> {
        return (this.apiService.get(`/order/v1/orders/${Id}?includes=items`, this.type)
            // this.noteService.getNotes(Id),
            // this.attachmentService.getAttachments(Id) TODO: Add back when APIs are avaliable
        ).pipe(
            switchMap(res => combineLatest([of(res), this.cartItemProductService.addProductInfoToLineItems(get(res, 'Items'))])),
            map(([order, orderLineItem]) => {
                const lineItems = plainToClass(OrderLineItem, orderLineItem, { ignoreDecorators: true }) as unknown as Array<OrderLineItem>;
                order.Items = lineItems;

                // order.Notes = notes;
                // order.Attachments = attachments; TODO: Add back when APIs are avaliable
                return order;
            }));
    }

    /**
     * @ignore
     */
    // globalFilter(): Observable<Array<AFilter>> {
    //     return combineLatest(
    //         this.userService.getCurrentUser(),
    //         this.accountService.getCurrentAccount())
    //         .pipe(
    //             filter(([user, account]) => user != null),
    //             map(([user, account]) => {
    //                 let conditions: Array<ACondition> = [
    //                     new ACondition(this.type, 'OwnerId', 'Equal', user.Id),
    //                     new ACondition(this.type, 'CreatedById', 'Equal', user.Id)
    //                 ];
    //                 return [new AFilter(this.type, conditions, null, 'OR'), new AFilter(this.type, [new ACondition(this.type, 'SoldToAccountId', 'Equal', account.Id)])];
    //             })
    //         );
    // }

    /**
     * @ignore
     */
    getMyOrders(accountId: string = null, days?: number, limit: number = 10, pageNumber: number = 0, orderBy: string = 'CreatedDate', orderDirection: 'ASC' | 'DESC' = 'DESC'): Observable<Array<Order>> {
        // const conditions = [];
        // if (accountId)
        //     conditions.push(new ACondition(this.type, 'BillToAccountId', 'Equal', accountId));
        // if (days)
        //     conditions.push(new ACondition(this.type, 'CreatedDate', 'LastXDays', days));
        // // return this.query({
        // //     conditions: conditions,
        //     sortOrder: [new ASort(this.type, orderBy, orderDirection)],
        //     page: new APageInfo(limit, pageNumber),
        //     expand: false
        // });
        // To Do: Replace with RLP API with same conditions.
        return of(null);
    }

    /**@ignore */
    getOrderTotal(): Observable<any[]> {
        return of(null);
    }

    /**
     * @ignore
     */
    convertCartToOrder(order: Order = new Order(), primaryContact: Contact, cart?: Cart, selectedAccount?: AccountInfo, acceptOrder: boolean = true): Observable<Order> {
        const account$ = isEmpty(selectedAccount)
            ?
            this.accountService.getCurrentAccount().pipe(map(account => {
                return {
                    BillToAccountId: account.Id,
                    ShipToAccountId: account.Id,
                    SoldToAccountId: account.Id
                } as AccountInfo;
            }))
            : of(selectedAccount);
        const cart$ = !isNil(cart) ? of(cart) : this.cartService.getMyCart();
        return zip(account$, cart$)
            .pipe(
                mergeMap(([_account, _cart]) => {
                    order.ShipToAccount = defaultTo(get(_account, 'ShipToAccount.Id') ? get(_account, 'ShipToAccount.Id') : get(_cart, 'ShipToAccount.Id'), get(_account, 'Id')) as unknown as Account;
                    order.BillToAccount = get(_account, 'BillToAccount.Id') ? get(_account, 'BillToAccount.Id') : defaultTo(get(_cart, 'BillToAccount.Id'), get(_account, 'Id')) as unknown as Account;
                    order.SoldToAccount = get(_account, 'SoldToAccount.Id') ? get(_account, 'SoldToAccount.Id') : get(_account, 'Id');

                    // TODO: Pass orderReq object in the payload when checkokut API has the support.
                    // let orderReq = { Order: order, Contact: primaryContact };
                    return this.apiService.post(`/cart/v1/carts/${cart.Id}/order`, null, this.type)
                        .pipe(tap(() => {
                            CartService.deleteLocalCart();
                            this.cartService.refreshCart();
                        }));
                })
            );
    }

    /**
     * @ignore
     */
    convertOrderToCart(order: Order): Observable<Cart> {
        // return this.createCart(order.Id).pipe(
        //     mergeMap(cartId => this.cartService.getCartWithId(cartId)),
        //     delayWhen(cart => this.cartItemService.delete(filter(get(cart, 'LineItems'), item => (item.LineType === 'Misc' && item.ChargeType === 'Sales Tax')), false)),
        //     mergeMap(cart => this.cartService.setCartActive(cart))
        // ) as Observable<Cart>;
        return of(null);
    }

    /**
     * @ignore
     */
    mergeCartItems(orderItemList: Array<OrderLineItem>, cart?: Cart): Observable<void> {
        // return observableIif(() => cart != null, of(cart), this.cartService.getMyCart().pipe(take(1))).pipe(mergeMap(tempCart => this.priceListService.getPriceListId().pipe(take(1), mergeMap(priceListId => {
        //     let cartItemInsertList: Array<CartItem> = [];
        //     let cartItemUpdateList: Array<CartItem> = [];

        //     for (let oldCartItem of orderItemList) {
        //         let cartItem = new CartItem();
        //         if (tempCart.LineItems && tempCart.LineItems) {
        //             let currentCartItem = tempCart.LineItems.filter(item => get(item, 'Product.Id') === oldCartItem.Product.Id)[0];
        //             if (currentCartItem) {
        //                 cartItem.Id = currentCartItem.Id;
        //                 cartItem.Quantity = currentCartItem.Quantity;
        //                 cartItemUpdateList.push(cartItem);
        //             }
        //         }

        //         if (!cartItem.Id) {
        //             cartItem.Product = oldCartItem.Product;
        //             cartItem.PriceList.Id = priceListId;
        //             cartItem.ItemSequence = tempCart.NumberOfItems + 1;
        //             cartItem.LineNumber = tempCart.NumberOfItems + 1;
        //             cartItem.PrimaryLineNumber = tempCart.NumberOfItems + 1;
        //             set(cartItem, 'Configuration.Id', tempCart.Id);
        //             cartItemInsertList.push(cartItem);
        //         }
        //         cartItem.Quantity += oldCartItem.Quantity;
        //     }

        //     return observableIif(() => cartItemUpdateList.length > 0, this.itemService.update(cartItemUpdateList), of(null)).pipe(
        //         mergeMap(() => observableIif(() => cartItemInsertList.length > 0, this.itemService.create(cartItemInsertList), of(null))));

        // }), tap(() => this.cartService.priceCart()))));
        return of(null);
    }

    /**
     * @ignore
     */
    getOrderByName(orderName: string): Observable<Order> {
        // ToDo: Replace with RLP API
        return of(null); // this.where([new ACondition(this.type, 'Name', 'Equal', orderName)]).pipe(map(res => res[0]));
    }

    /**
     * @ignore
     */
    getOrderByQuote(quoteId: string): Observable<Order> {
        return this.apiService.get(`/order/v1/orders?filter=eq(Proposal.Id:'${quoteId}')&page=1&limit=1`, this.type).pipe(map(res => first(res)));
    }

    /**
     * @ignore
     */
    acceptOrder(orderId: string): Observable<Order> {
        return this.apiService.post(`order/v1/orders/${orderId}/confirm`);
    }

    /**
     * @ignore
     */
    createCart(orderId: string): Observable<string> {
        // if (!orderId) {
        //     this.translateService.stream('SERVICES.INVALID_ORDER_ID').subscribe((val: string) => {
        //         return observableThrowError(val);
        //     });
        // }
        // return this.apiService.post(`/orders/${orderId}/carts`);
        return of(null);
    }

    /**
     * @ignore
     */
    getAllOrders(filters?: Array<FieldFilter> | string): Observable<Array<Order>> {
        let queryparam = new URLSearchParams();
        forEach(filters as Array<FieldFilter>, (filter) => {
            filter.field && queryparam.append('filter', `${filter.filterOperator}(${filter.field}:'${filter.value}')`);
        });
        let params = isEmpty(queryparam.toString()) ? '' : `${queryparam.toString()}`;
        if (typeof (filters) === 'string') params = filters
        return this.apiService.get(`/order/v1/orders?${params}`, null, true, false)//to stop toaster messages from api service
    }

    /**
    * @ignore
    */
    updateOrder(orderId: string, payload: OrderPayload): Observable<Array<Order>> {
        return this.apiService.patch(`/order/v1/orders/${orderId}`, payload)
    }
}

export interface OrderPayload {
    PrimaryContact?: Contact;
    BillToAccount?: Account;
    Description?: string;
    ShipToAccount?: Account;
}
