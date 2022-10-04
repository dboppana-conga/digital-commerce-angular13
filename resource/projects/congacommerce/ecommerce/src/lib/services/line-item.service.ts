import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { AObjectService, TreeUtils } from '@congacommerce/core';
import { CartItem } from '../modules/cart/classes/cart-item.model';
import { QuoteLineItem } from '../modules/order/classes/quote-line-item.model';
import { OrderLineItem } from '../modules/order/classes/order-line-item.model';
import { AssetLineItem } from '../modules/abo/classes/asset-item.model';
import { Cart } from '../modules/cart/classes/cart.model';
import { Order } from '../modules/order/classes/order.model';
import { Quote } from '../modules/order/classes/quote.model';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';


/**
 * Line Item Service returns the details of  line items related to the CartItem , AssetLineItem ,QuoteLineItem , OrderLineItem.
 * <h3>Usage</h3>
 *
 ```typescript
import { LineItemService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private lineItemService: LineItemService)
}
// or
export class MyService extends AObjectService {
     private lineItemService: LineItemService = this.injector.get(LineItemService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class LineItemService extends AObjectService {

    /**
     * The method takes a line item and returns the categorized line item.
     * ### Example:
    ```typescript
    import { LineItemService, ItemGroup, CartItem , AssetLineItem ,QuoteLineItem ,OrderLineItem } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';

    export class MyComponent implements OnInit{
        lineItemList: ItemGroup;
        lineItemList$: Array<ItemGroup>;

        groupItems(items: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>){
            LineItemService.groupItems(items).subscribe(a => this.lineItemList = a);
            // or
            this.lineItemList$ = LineItemService.groupItems(items);
        }
    }
    ```
     * @param items Array of type Cart item, Asset line item, Quote line item Or Order line item
    **/ 
    static groupItems(items: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>): Array<ItemGroup> {
        const output = _.map(
            _.compact(Object.values(_.groupBy(items, 'LineNumber'))),
            (line => {
                line = _.compact(line);
                const mainLine = _.minBy(_.filter(line, (i) => i.IsPrimaryLine && i.LineType === 'Product/Service'), 'ItemSequence') || _.find(line, i => i.IsPrimaryLine);
                if (!_.isNil(mainLine)) {
                    return {
                        MainLine: mainLine,
                        Children: _.filter(line, i => _.get(i, 'PrimaryLineNumber') !== _.get(mainLine, 'PrimaryLineNumber') || _.get(i, 'ItemSequence') !== _.get(mainLine, 'PrimaryLineNumber')),
                        PrimaryLines: new Array(_.minBy(_.filter(line, (i) => i.IsPrimaryLine && i.LineType === 'Product/Service'), 'ItemSequence')),
                        SecondaryLines: _.filter(line, (i) => !i.IsPrimaryLine && i.LineType !== 'Option'),
                        RollupLines: _.filter(line, (i) => i.IsOptionRollupLine),
                        Options: TreeUtils.arrayToTree(_.filter(line, (i) => i.LineType === 'Option'), {
                            parentProperty: 'ParentBundleNumber',
                            childrenProperty: '_metadata.children',
                            customID: 'PrimaryLineNumber'
                        }),
                        Flat: line
                    };
                } else
                    return null;
            })
        );
        return _.compact(output);
    }

    /**
     * Method takes a line item and returns the full list of line items related to it. Can be any line item within the bundle.
     * @param item the primary line item to get the related cart items for
     * @param relatedTo An optional context object to avoid additional network callouts
     * @ignore
     */
     getOptionsForItem(item: CartItem | AssetLineItem | QuoteLineItem | OrderLineItem, relatedTo?: Cart | Order | Quote): Observable<Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>> {
        // If the item is a cart item and has a related asset
        if (item) {

            let field = 'Configuration.Id';
            // if (item instanceof AssetLineItem)
            //     field = 'BusinessObject.Id';
            // else if (item instanceof QuoteLineItem)
            //     field = 'Proposal';
            // else if (item instanceof OrderLineItem)
            //     field = 'Order.Id';


            let queryparam = new URLSearchParams();
          
            item && queryparam.append('filter', `eq(LineNumber:'${item.LineNumber}')`);
            item && queryparam.append('filter', `eq(${field}:'${_.get(item, field)}')`);
            const params = _.isEmpty(queryparam.toString()) ? '' : `${queryparam.toString()}`;
            // TO DO: getlineitem APi available need to update the code.
          
            // return (!_.isNil(relatedTo)// TO Do : getLineitem RLP API when available
            //         // && ((item instanceof CartItem)
            //         // &&(relatedTo instanceof Cart)
            //        && (_.get(item, 'Configuration.Id') === _.get(relatedTo, 'Id')))
            //     ? of(_.filter(_.get(relatedTo, 'LineItems', []), i => _.isEqual(_.get(i, 'LineNumber'), item.LineNumber)))
                return this.apiService.post(`/cart/v1/carts/${localStorage.getItem('local-cart')}/price`, null).pipe(map(r => _.get(r, 'CartResponse.LineItems')))
    } else
            return of(null);
    }
}

/**
 * Special type for groups of line items in a structured format. Used for displaying line item records in a detail page.
 */
export interface ItemGroup {
    /**
     * The main line item.
     */
    MainLine: CartItem | AssetLineItem | QuoteLineItem | OrderLineItem;
    /**
     * Child line items related to the main line.
     */
    Children: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>;
    /**
     * Primary line items.
     */
    PrimaryLines: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>;
    /**
     * Secondary line items.
     */
    SecondaryLines: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>;
    /**
     * Option line items.
     */
    Options: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>;
    /**
     * Roll up line items.
     */
    RollupLines: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>;
}

