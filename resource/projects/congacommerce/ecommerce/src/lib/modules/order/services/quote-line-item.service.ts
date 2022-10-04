
import { mergeMap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { QuoteLineItem } from '../classes/quote-line-item.model';
import { LineItemService } from '../../../services/line-item.service';

/**
 * @ignore
 * The quote represents a price breakdown for a given product configuration. Quotes are generally associated with an approval process and can be converted to a cart or an order.
 */
@Injectable({
    providedIn: 'root'
})
export class QuoteLineItemService extends LineItemService {
    type = QuoteLineItem;

    /**
     * This method returns the quote line item with adjustment details.
     * ### Example:
     ```typescript
     import { QuoteLineItemService, QuoteLineItem } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';
     export class MyComponent implements OnInit{
    quoteLineItem: OrderLineItem;
    quoteLineItem$: Observable<OrderLineItem>;
    constructor(private quoteLineItemService: QuoteLineItemService){}
    ngOnInit(){
        this.quoteLineItemService.getPromotionDetailsForQuoteLineItem(lineItemId: string).subscribe(o => this.quoteLineItem = o);
        // or
        this.quoteLineItem$ = this.quoteLineItemService.getPromotionDetailsForQuoteLineItem(lineItemId: string);
    }
}
     ```
     * This method returns the adjustment items on a given quote line item.
     * @param lineItemId Id of the quote line item.
     * @returns An observable containing the given quote line item with adjustment item details.
     * To Do:
     */
    public getPromotionDetailsForQuoteLineItem(lineItemId: string): Observable<Array<QuoteLineItem>> {
        return null; // this.where([new ACondition(this.type, 'Id', 'Equal', lineItemId)]);
    }

    /**
     * This method returns the bundled options for the quote line item passed.
     * @param quoteLineItem Instance of the quote line item passed.
     * @returns An observable containing the array of option line items for a given quote line item.
     * To Do:
     */
    public getBundleItemsForQuoteLineItem(quoteLineItem: string | QuoteLineItem): Observable<Array<QuoteLineItem>> {
        // const quoteLineItem$ = (typeof quoteLineItem === 'string') ? this.get([quoteLineItem]).pipe(map(res => res[0])) : of(quoteLineItem);
        // return quoteLineItem$.pipe(mergeMap((item: QuoteLineItem) => this.where([
        //     new ACondition(this.type, 'ParentBundleNumber', 'Equal', item.LineNumber),
        //     new ACondition(this.type, 'Proposal', 'Equal', item.ProposalId)
        // ])));
        return null;
    }

    /**
           * This method returns  list of quote line items for the given quoteId
           * ### Example:
      ```typescript
      import { QuoteLineItemService, QuoteLineItem } from '@congacommerce/ecommerce';
      import { Observable } from 'rxjs/Observable';
      
      export class MyComponent implements OnInit{
          QuoteLineItemList: Array<QuoteLineItem>;
          QuoteLineItemList$: Observable<Array<QuoteLineItem>>;
      
          constructor(private quoteLineItemService:QuoteLineItemService){}
      
          ngOnInit(){
              this.quoteLineItemService.getQuoteLineItems(quoteId: string).subscribe(o => this.quoteLineItemList = o);
              // or
              this.quoteLineItemList$ = this.quoteLineItemService.getQuoteLineItems(quoteId: string);
          }
      }
      ```
           * @override
           * @param quoteId the quote id to fetch the related quote line items results
           * @returns an observable array of quote line items
           */
    getQuoteLineItems(quoteId: string): Observable<Array<QuoteLineItem>> {
        return this.apiService.post('/Apttus_Proposal__Proposal_Line_Item__c/query', {
            'conditions': [
                {
                    'field': 'ProposalId',
                    'filterOperator': 'Equal',
                    'value': quoteId
                }
            ],
            'lookups': [
                {
                    'field': 'Apttus_Proposal__Product__c'
                },
                {
                    'field': 'Apttus_QPConfig__AttributeValueId__c'
                }
            ],
            'children': [{
                'field': 'Apttus_QPConfig__TaxBreakups__r'
            }]
        }, this.type, null);
    }
}