import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable, combineLatest, of } from 'rxjs';
import { mergeMap, take, map, delayWhen, tap, filter, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { first, flatten, map as _map, get, filter as _filter, forEach, isEmpty } from 'lodash';

import { AObjectService } from '@congacommerce/core';
import { Quote } from '../classes/quote.model';
import { Cart } from '../../cart/classes/index';
import { CartService } from '../../cart/services/cart.service';
import { AttachmentService } from '../../catalog/services/attachment.service';
import { UserService } from '../../crm/services/user.service';
import { ContactService } from '../../crm/services/contact.service';
import { CartItemService } from '../../cart/services/cart-item.service';
import { NoteService } from '../../catalog/services/note.service';
import { GenerateDocument } from '../../../interfaces/generate-dcoument.interface';
import { QuoteLineItemService } from './quote-line-item.service';
import { AccountService } from '../../crm/services/account.service';
import { CartItemProductService } from '../../cart/services/cart-item-product.service';
import { plainToClass } from 'class-transformer';
import { QuoteLineItem } from '../classes';
import { FieldFilter } from '../../../interfaces';

/**
 * 
 * The quote represents a price breakdown for a given product configuration. Quotes are generally associated with an approval process and can be converted to a cart or an order.
 * <h3>Usage</h3>
 *
 ```typescript
 import { QuoteService } from '@congacommerce/ecommerce';

 constructor(private quoteService: QuoteService) {}

 // or

 export class MyService extends AObjectService {
     private quoteService: QuoteService = this.injector.get(QuoteService);
  }
 ```
 *
 */
@Injectable({
    providedIn: 'root'
})
export class QuoteService extends AObjectService {
    type = Quote;

    contactService = this.injector.get(ContactService);

    cartItemService = this.injector.get(CartItemService);

    noteService = this.injector.get(NoteService);

    private userService = this.injector.get(UserService);

    private cartService = this.injector.get(CartService);

    private translateService = this.injector.get(TranslateService);

    private quoteLineItemService = this.injector.get(QuoteLineItemService);

    private attachmentService = this.injector.get(AttachmentService);

    private accountService = this.injector.get(AccountService);

    protected cartItemProductService: CartItemProductService = this.injector.get(CartItemProductService);

    onInit() {
        this.contactService = this.injector.get(ContactService);
        this.cartItemService = this.injector.get(CartItemService);
    }

    /** The Method gets details of the Quote. 
     * ### Example:
     ```typescript
     import { QuoteService, Quote } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           quote: Quote;

           constructor(private quoteService: QuoteService){}

                this.quoteService.getQuote(quoteId).subscribe(
                    c => c,
                    err => {...}
                );
        }
     }
     ```
     * @param Id the Id of the quote 
     * @returns an observable of the quote instance that was created from the cart
     * @ignore
     *  // TODO : use this method getQuote in quote detail component
    */
    getQuote(Id: string): Observable<Quote> {
        // return combineLatest(
        //     this.apiService.get(`/quotes?condition[0]=Id,Equal,${Id}&lookups=PriceListId,Primary_Contact,BillToAccountId,ShipToAccountId,Account,CreatedBy`, this.type),
        //     this.quoteLineItemService.getQuoteLineItems(Id),
        //     this.noteService.getNotes(Id),
        //     this.attachmentService.getAttachments(Id)
        // ).pipe(map(([arr, lineItems, notes, attachments]) => {
        //     const quote: Quote = first(arr);
        //     if (!quote) {
        //         return;
        //     }

        //     quote.R00N70000001yUfBEAU = lineItems;
        //     quote.Notes = notes;
        //     quote.Attachments = attachments;
        //     return quote;
        // }));
        return of(null);
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
    //                 const conditions: Array<ACondition> = [
    //                     new ACondition(this.type, 'OwnerId', 'Equal', user.Id),
    //                     new ACondition(this.type, 'CreatedById', 'Equal', user.Id)
    //                 ];
    //                 return [new AFilter(this.type, conditions, null, 'OR'), new AFilter(this.type, [new ACondition(this.type, 'AccountId', 'Equal', account.Id)])];
    //             })
    //         );
    // }

    /**
     * Returns a list of quotes for the given user.
     * ### Example:
     ```typescript
     import { QuoteService, Quote } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           quoteList: Array<Quote>;
           quoteList$: Observable<Array<Quote>>;

           constructor(private quoteService: QuoteService){}

           ngOnInit(){
                this.quoteService.getMyQuotes().subscribe(q => this.quoteList = q);
                // or
                this.quoteList$ = this.quoteService.getMyQuotes();
           }
      }
     ```
     * @param days the number of days in the past from now with which to retrieve quotes.
     * @param limit the total number of records to return
     * @param offset the offset of the records to return (i.e. records 10-20, the offset will be 10)
     * @param orderBy the field by which to order the records
     * @param orderDirection the direction in which to sort the records
     * @returns a an observable array of quote instances for the current user
     */
    getMyQuotes(days?: number, limit: number = 10, pageNumber: number = 0, orderBy: string = 'CreatedDate', orderDirection: 'ASC' | 'DESC' = 'DESC'): Observable<Array<Quote>> {
        /* TO DO : */
        return of(null);
        // return this.apiService.get(`/quotes?lookups=PriceListId&children=SummaryGroups&sort[field]=${orderBy}&sort[direction]=${orderDirection}&page[limit]=${limit}&page[current]=${pageNumber}`, this.type);
    }

    /**
     * Method converts the current cart into a quote instance. Sets the business object on the cart to 'Proposal'
     * ### Example:
     ```typescript
     import { QuoteService, Quote } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           quote: Quote;

           constructor(private quoteService: QuoteService){}

           ngOnInit(){
                const q = new Quote();
                q.Name = 'Sample Quote';
                this.quoteService.convertCartToQuote(q).subscribe(
                    q => this.quote = q,
                    err => {...}
                );
           }
      }
     ```
     * @param quote an optional quote instance to specify predefined parameters on the quote that gets created
     * @returns an observable of the quote instance that was created from the cart
     */
    convertCartToQuote(quote: Quote = new Quote()): Observable<Quote> {
        /* TO DO : When API available  */
        return of(null);
        // quote.PrimaryContact = (quote.PrimaryContact.Id) ? quote.PrimaryContact.Id : get(quote, 'PrimaryContact.Id');
        // const q = quote;
        // return this.apiService.post(`/carts/${CartService.getCurrentCartId()}/proposal`, q, this.type)
        //     .pipe(tap(() => {
        //         //  this.cacheService.refresh(this.type);
        //         CartService.deleteLocalCart();
        //         this.cartService.refreshCart();
        //     }));
    }

    /**
     * Method creates new cart and clones the finalized cart linked to the quote Id passed as argument to the new cart and set the new cart as active
     *
     * ### Example:
     ```typescript
     import { QuoteService, Quote } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           quote: Quote;

           constructor(private quoteService: QuoteService){}

           convertQuoteToCart(quoteId: string) {
                this.quoteService.convertQuoteToCart(quoteId).subscribe(
                    c => c,
                    err => {...}
                );
           }
        }
     }
     ```
     * @param quote an optional quote instance to specify predefined parameters on the quote that gets created
     * @returns an observable of the quote instance that was created from the cart
     */

    convertQuoteToCart(quoteId: string): Observable<Cart> {
        /* TO DO : When API available  */
        return of(null);
        // return this.createCart(quoteId).pipe(
        //     mergeMap(cartId => this.cartService.getCartWithId(cartId)),
        //     delayWhen(cart => this.cartItemService.delete(_filter(get(cart, 'LineItems'), item => (item.LineType === 'Misc' && item.ChargeType === 'Sales Tax')), false)),
        //     mergeMap(cart => this.cartService.setCartActive(cart))
        // );
    }

    /**
     * Method generates a document for a given quote record based on a template.
     * ### Example:
     ```typescript
     import { QuoteService, Quote, TemplateService } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{

           constructor(private quoteService: QuoteService, private templateService: TemplateService){}

           generateDocumentForQuote(quote: Quote){
               this.templateService.getActiveTemplates('Proposal')
                .take(1)
                .subscribe(templateList => {
                    this.quoteService.generateDocument(templateList[0], quote, 'PDF', true, 'Full access').subscribe(
                        () => {...},
                        err => {...}
                    );
                });
           }
      }
     ```
     * @param template The instance of the template record with which to generate the document
     * @param quote the instance of the quote to generate the document from
     * @param format the format of the document to create
     * @param isDraft A boolean value determining if the draft watermark should be placed on the quote
     * @param pLevel Access level of the document that gets generated
     * @param synchronizeWithCartId the cart id to synchronize the quote with first before generating the document
     * @returns an empty observable when the process completes
     */
    // generateDocument(template: Template, quote: Quote, format: 'PDF' | 'DOC' | 'DOCX' | 'RTF' = 'PDF', isDraft: boolean = true, pLevel: 'Full access' | 'Insert comments only' | 'Insert comments and tracked changes only' | 'Read only' | 'Fill in form fields only' = 'Read only', synchronizeWithCartId: string = null): Observable<void> {
    // return this.organizationId().flatMap(orgId => {
    //     if(synchronizeWithCartId)
    //         return this.soapService.doRequest('Apttus_CPQApi/CPQWebService', 'synchronizeCart', { request: { CartId: synchronizeWithCartId } }).flatMap(() => this.soapService.doRequest('Apttus_Proposal/MergeWebService', 'generateDoc2', {
    //             templateId: template.Id,
    //             proposalId: quote.Id,
    //             pLevel: pLevel,
    //             docFormat: format,
    //             isDraft: isDraft,
    //             sessionId: this.connection.accessToken,
    //             serverUrl: this.connection.instanceUrl + '/services/Soap/u/39.0/' + orgId
    //         }));
    //     else
    //         return this.soapService.doRequest('Apttus_Proposal/MergeWebService', 'generateDoc2', {
    //             templateId: template.Id,
    //             proposalId: quote.Id,
    //             pLevel: pLevel,
    //             docFormat: format,
    //             isDraft: isDraft,
    //             sessionId: this.connection.accessToken,
    //             serverUrl: this.connection.instanceUrl + '/services/Soap/u/39.0/' + orgId
    //         });
    // });

    //  return null;
    // }

    /**
     * Method gets a quote by the name
     * ### Example:
     ```typescript
     import { QuoteService, Quote } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           quote: Quote;

           constructor(private quoteService: QuoteService){}

           getQuoteByName(name: string){
                this.quoteService.getQuoteByName(name).subscribe(q => this.quote = q);
           }
      }
     ```
     * @param name the name field value of the record to retrieve
     * @returns an observable of the quote retrieved
     */
    getQuoteByName(name: string): Observable<Quote> {
        // TODO: Replace with RLP API
        return null; // this.where([new ACondition(this.type, 'Name', 'Equal', name)]).pipe(map(res => res[0]));
    }

    /**
     * Method to abandon the cart in Draft status.
     * ### Example:
     ```typescript
     import { QuoteService } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           result: boolean;

           constructor(private quoteService: QuoteService){}

           abandonCart(){
                this.quoteService.abandonCart().subscribe(r => this.result = r);
           }
      }
     ```
     * @returns <code>true</code> if the operation was successful, <code>false</code> otherwise
     */
    abandonCart(): Observable<boolean> {
        /* TO DO : */
        return of(null);
        // return this.cartService.getMyCart().pipe(take(1), mergeMap(
        //     cart => {
        //         return this.apiService.post(`/carts/${cart.Id}/abandon`);
        //     }
        // ));
    }

    /**
     * Method to accept the given quote.
     * ### Example:
     ```typescript
     import { QuoteService } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           result: boolean;

           constructor(private quoteService: QuoteService){}

           acceptQuote(quoteId: string){
                this.quoteService.acceptQuote(quoteId).subscribe(r => this.result = r);
           }
      }
     ```
     * @param quoteId the id of quote
     * @returns <code>true</code> if the operation was successful, <code>false</code> otherwise
     */
    acceptQuote(quoteId: string): Observable<boolean> {
        if (!quoteId) {
            this.translateService.stream('SERVICES.INVALID_QUOTE_ID').subscribe((val: string) => {
                return observableThrowError(val);
            });
        }
        return this.apiService.post(`/quote/v1/quotes/${quoteId}/accept`);
    }


    /**
     * Method to create a new cart for quote
     * ### Example:
     ```typescript
     import { QuoteService } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           result: string;

           constructor(private quoteService: QuoteService){}

           abandonCart(){
                this.quoteService.createCart().subscribe(r => this.result = r);
           }
      }
     ```
     * @param quoteId the id of quote
     * @returns the id of new cart for given quote
     */
    createCart(quoteId: string): Observable<string> {
        if (!quoteId) {
            this.translateService.stream('SERVICES.INVALID_QUOTE_ID').subscribe((val: string) => {
                return observableThrowError(val);
            });
        }
        return this.apiService.post(`/quotes/${quoteId}/carts`);
    }

    /**
     * Method to generate the document for a custom object
     * ### Example:
     ```typescript
     import { QuoteService, GenerateDocument } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           result: string;

           constructor(private quoteService: QuoteService){}

           acceptQuote(quoteId: string){
                this.quoteService.generateDocument(generateDocumentRequest: GenerateDocument).subscribe(r => this.result = r);
           }
      }
     ```
     * @param generateDocumentRequest a request for generating the document for a custom object
     * @returns Id of generated document
     */
    generateDocument(generateDocumentRequest: GenerateDocument): Observable<string> {
        /* TO DO : When API available  */
        return of(null);
        // if (!generateDocumentRequest) {
        //     this.translateService.stream('SERVICES.INVALID_GENERATE_DOC_REQ').subscribe((val: string) => {
        //         return observableThrowError(val);
        //     });
        // }
        // return this.apiService.post(`quotes/generate-document`, generateDocumentRequest);
    }

    /**
   * Method to get the aggregate of quote total by approval stage
   * ### Example:
   ```typescript
   import { QuoteService, GenerateDocument } from '@congacommerce/ecommerce';
   import { Observable } from 'rxjs/Observable';

   export class MyComponent implements OnInit{
         result: string;

         constructor(private quoteService: QuoteService){}

         getGrandTotalByApprovalStage(){
             this.quoteService.getGrandTotalByApprovalStage().subscribe(r => r);
         }
         }
    }
   ```
   * @returns Aggregate of quote total object based on the Approval Stage.
   */
    getGrandTotalByApprovalStage(): Observable<object> {
        /* TO DO : */
        return of(null);
        // return combineLatest(this.userService.me(), this.accountService.getCurrentAccount()).pipe(mergeMap(([user, account]) => {
        //     return this.apiService.post('/Apttus_QPConfig__ProposalSummaryGroup__c/query', {
        //         'aggregate': true,
        //         'groupBy': ['apttus_qpconfig__proposalid__r.Approval_Stage'],
        //         'aggregateFields': [{
        //             'field': 'NetPrice',
        //             'aggregateType': 'SUM'
        //         }],
        //         'conditions': [{
        //             'field': 'apttus_qpconfig__proposalid__r.OwnerId',
        //             'filterOperator': 'In',
        //             'value': user.Id
        //         },
        //         {
        //             'field': 'Name',
        //             'filterOperator': 'Equal',
        //             'value': 'Grand Total'
        //         },
        //         {
        //             'field': 'apttus_qpconfig__proposalid__r.AccountId',
        //             'filterOperator': 'Equal',
        //             'value': account.Id
        //         }]
        //     })
        //         .pipe(
        //             map(res => _map(res, rec => {
        //                 return {
        //                     'Stage': get(rec, 'Apttus_Proposal__Approval_Stage__c'),
        //                     'NetPrice': get(rec, 'SUM_NetPrice')
        //                 };
        //             }))
        //         );
        // }));
    }

    /**
     * Method moves the quote status from Draft to Approved.
     * ### Example:
     ```typescript
     import { QuoteService } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';
     export class MyComponent implements OnInit{
           result: boolean;
           constructor(private quoteService: QuoteService){}
           finalizeQuote(quoteId: string){
                this.quoteService.finalizeQuote(quoteId).subscribe(r => this.result = r);
           }
      }
     ```
     * This method updates the status on quote from Draft to Approved.
     * @param quoteId string identifier of the quote.
     * @returns <code>true</code> if the operation was successful, <code>false</code> otherwise.
     */
    finalizeQuote(quoteId: string): Observable<boolean> {
        /* TO DO : When API available  */
        return of(null);
        // if (!quoteId) {
        //     this.translateService.stream('SERVICES.INVALID_QUOTE_ID').subscribe((val: string) => {
        //         return observableThrowError(val);
        //     });
        // }
        // return this.apiService.post(`/quotes/${quoteId}/finalize`);
    }

    /**
      * This method returns the quote details based on given quote Id.
      * ### Example:
      ```typescript
      import { QuoteService, Quote } from '@congacommerce/ecommerce';
      import { Observable } from 'rxjs/Observable';
      export class MyComponent implements OnInit{
            result: Quote
            result$: Observable<Quote>;
            constructor(private quoteService: QuoteService){}
            getQuoteById(quoteId: string){
             this.quoteService.getQuoteById(quoteId).subscribe(r => this.result = r);
             // or
             results$ = this.quoteService.getQuoteById(quoteId);
            }
       }
      ```
      * @param quoteId string identifier of the quote.
      * @returns Observable<Quote>.
      */
    getQuoteById(quoteId: string): Observable<Quote> {
        return this.apiService.get(`/quote/v1/quotes/${quoteId}?includes=items`, Quote).pipe(
            switchMap(res => combineLatest([of(res), this.cartItemProductService.addProductInfoToLineItems(get(res, 'Items'))])),
            map(([quote, quoteLineItem]) => {
                const lineItems = plainToClass(QuoteLineItem, quoteLineItem, { ignoreDecorators: true }) as unknown as Array<QuoteLineItem>;
                quote.Items = lineItems;
                return quote;
            })
        );
    }

    /**
      * This method returns the list of quote.
      * ### Example:
      ```typescript
      import { QuoteService, QuoteResult, FieldFilter } from '@congacommerce/ecommerce';
      import { Observable } from 'rxjs/Observable';
      export class MyComponent implements OnInit{
            result: QuoteResult
            result$: Observable<QuoteResult>;
            constructor(private quoteService: QuoteService){}
            getQuoteList(filters: Array<FieldFilter>){
             this.quoteService.getQuoteList(filters).subscribe(r => this.result = r);
             // or
             results$ = this.quoteService.getQuoteList(filters);
            }
       }
      ```
      * @param filters filteres params of type Array<FieldFilter> holds the filter which need to apply on quote list.
      * @returns Observable<QuoteResult>.
      */
    getQuoteList(filters?: Array<FieldFilter>): Observable<QuoteResult> {
        let queryparam = new URLSearchParams();
        forEach(filters, (filter) => {
            filter.field && queryparam.append('filter', `${filter.filterOperator}(${filter.field}:'${filter.value}')`);
        });
        const params = isEmpty(queryparam.toString()) ? '' : `${queryparam.toString()}`;
        return this.apiService.get(`/quote/v1/quotes?${params}&includeTotalCount=true`, null, true, false).pipe( //to stop toaster messages from api service
            map(result => {
                return {
                    QuoteList: plainToClass(this.type, result, { excludeExtraneousValues: true }) as unknown as Array<Quote>,
                    TotalRecord: get(result, 'TotalCount')
                } as QuoteResult
            })
        )
    }

    /**
      * This method is use to create a quote.
      * ### Example:
      ```typescript
      import { QuoteService } from '@congacommerce/ecommerce';
      import { Observable } from 'rxjs/Observable';
      export class MyComponent implements OnInit{
            result: Quote;
            result$: Observable<Quote>;
         
            constructor(private quoteService: QuoteService){}
 
            createQuote(quote: Quote){
               this.result$= this.quoteService.createQuote(quote);
               //or
               this.quoteService.createQuote(quote).subscribe(c=> this.result=c);           
            }
       }
       ```
      * @param quote Params hold the information of requested quote.
      * @returns Observable<Quote>.
      */
    createQuote(quote: Quote): Observable<Quote> {
        return this.apiService.post('/quote/v1/quotes', [quote], this.type);
    }
}



/**
 * Result set of List of quotes
 */
export interface QuoteResult {
    /**
     * CartList are Array of cart records.
     */
    QuoteList: Array<Quote>
    /**
     * Total count of list of cart records.
     */
    TotalRecord: number
}
