import { AObjectService } from '@congacommerce/core';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { OrderLineItem } from '../classes/order-line-item.model';

/**
 * @ignore
 * The order line item object represents an order line item in Apttus. Only order line item for given order will be returned by this service.
 */
@Injectable({
    providedIn: 'root'
})
export class OrderLineItemService extends AObjectService {
    type = OrderLineItem;

    /**
     * method returns a list of order line items for the order
     * ### Example:
```typescript
import { OrderLineItemService, OrderLineItem } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    orderLineItemList: Array<OrderLineItem>;
    orderLineItemList$: Observable<Array<OrderLineItem>>;

    constructor(private orderLineItemService: OrderLineItemService){}

    ngOnInit(){
        this.orderLineItemService.getOrderLineItemsForOrder(orderId: string).subscribe(o => this.orderLineItemList = o);
        // or
        this.orderLineItemList$ = this.orderLineItemService.getOrderLineItemsForOrder(orderId: string);
    }
}
```
     * @override
     * @param orderId the order id to filter the order line items results
     * @param days the number of days into the past with which to retrieve orders. If left empty, will retrieve all orders
     * @param limit the total number of records to return
     * @param offset the offset of the records to return (i.e. records 10-20, the offset will be 10)
     * @param orderBy the field by which to order the records
     * @param orderDirection the direction in which to sort the records
     * @returns an observable array of order line items
     * To DO:  Add back when API is available
     */
    public getOrderLineItemsForOrder(orderId: string = null, days?: number, limit: number = 10, pageNumber: number = 0, orderBy: string = 'CreatedDate', orderDirection: 'ASC' | 'DESC' = 'DESC'): Observable<Array<OrderLineItem>> {
        // const conditions = [];

        // if (orderId)
        //     conditions.push(new ACondition(this.type, 'OrderId', 'Equal', orderId));

        // return this.where(conditions, 'AND', null, [
        //     new ASort(this.type, orderBy, orderDirection)
        // ], new APageInfo(limit, pageNumber), null);
        return of(null);
    }


    /**
         * This method returns  list of order line items for the given orderId
         * ### Example:
    ```typescript
    import { OrderLineItemService, OrderLineItem } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';
    
    export class MyComponent implements OnInit{
        orderLineItemList: Array<OrderLineItem>;
        orderLineItemList$: Observable<Array<OrderLineItem>>;
    
        constructor(private orderLineItemService: OrderLineItemService){}
    
        ngOnInit(){
            this.orderLineItemService.getOrderLineItems(orderId: string).subscribe(o => this.orderLineItemList = o);
            // or
            this.orderLineItemList$ = this.orderLineItemService.getOrderLineItems(orderId: string);
        }
    }
    ```
         * @override
         * @param orderId the order id to fetch the related order line items results
         * @returns an observable array of order line items
         * TODO:  Add back when API is available
         */
    getOrderLineItems(orderId: string = null): Observable<Array<OrderLineItem>> {
        // return this.apiService.post('/Apttus_Config2__OrderLineItem__c/query', {
        //     'conditions': [
        //         {
        //             'field': 'OrderId',
        //             'filterOperator': 'Equal',
        //             'value': orderId
        //         }
        //     ],
        //     'lookups': [
        //         {
        //             'field': 'Apttus_Config2__ProductId__c'
        //         },
        //         {
        //             'field': 'Apttus_Config2__AttributeValueId__c'
        //         }
        //     ],
        //     'children': [{
        //         'field': 'Apttus_Config2__OrderTaxBreakups__r'
        //     }]
        // }, this.type, null);
        return of(null);
    }
}