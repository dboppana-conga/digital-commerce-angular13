import { Component, Input, OnInit, Output, EventEmitter, OnChanges, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, combineLatest, of, Observable, throwError } from 'rxjs';
import { mergeMap, take, map, switchMap, tap, catchError } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { sumBy, filter, get, find, isNil, defaultTo, set, isEmpty, some, map as _map, flatten } from 'lodash';
import {
    Cart, Storefront, StorefrontService, UserService, QuoteService, CartService,
    Quote, Order, ConstraintRuleService, AccountService,
    OrderService, CartItem, Contact
} from '@congacommerce/ecommerce';
import { ExceptionService } from '../../shared/services/exception.service';
/**
 * The price summary component displays the total price, promotion(s) applied, tax, sub total and action button(s) as per the need.
 * <strong>This component is a work in progress.</strong>
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/priceSummary.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { PriceSummaryModule } from '@congacommerce/elements';

@NgModule({
  imports: [PriceSummaryModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-price-summary
*              [record]="cart"
*              [form]="form"
*              [spinner]="isLoading"
*              [page]="'checkout'"
*              (onSubmitOrder)="handleClick()"
*              (onRequestQuote)="handleClick()"
* ></apt-price-summary>
```
*/

@Component({
    selector: 'apt-price-summary',
    templateUrl: './price-summary.component.html',
    styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent implements OnInit, OnDestroy, OnChanges {
    /**
     * The input record to display the price summary for. Can be of type Cart, Quote and Order
     */
    @Input() record: Cart | Quote | Order;

    /**
     * The input form to validate the parent component's Form on submit
     */
    @Input() form?: NgForm;

    /**
     * Flag to disable the submit button.
     */
    @Input() disableSubmit: boolean = false;

    /**
     * The input page to manage UI element(s)'s visibility (show/hide) based on the page where this component is being used
     */
    @Input() page: 'checkout' | 'create-proposal' | 'quotes' | 'orders' | 'paymentForOrder' | 'carts' | '';

    /**
    * Payment state such as Card and Invoice
    */
    @Input() paymentState: 'PONUMBER' | 'INVOICE' | 'PAYNOW' | '';

    /** Flag to set the loading spinner active */
    @Input() loading: boolean = false;

    /**
     * Flag to show the payment status on the summary card.
     */
    @Input() showStatus: boolean = false;

    /**
     * Event emitter fired when the order is summited.
     */
    @Output() onSubmitOrder: EventEmitter<string> = new EventEmitter();

    /**
     * Event emitter fired when the request quote button is pressed.
     */
    @Output() onRequestQuote: EventEmitter<any> = new EventEmitter();

    /**
     * Event emitter fired when the Finalize and Submit button is pressed.
     */
    @Output() onFinalizeQuote: EventEmitter<any> = new EventEmitter();

    /**
     * Event emitter fired when the make payment button is pressed.
     */
    @Output() onPaymentRequest: EventEmitter<any> = new EventEmitter();
    /** @ignore */
    @ViewChild('discardChangesTemplate') discardChangesTemplate: TemplateRef<any>;
    /** @ignore */
    view$: BehaviorSubject<PriceSummaryView> = new BehaviorSubject<PriceSummaryView>({} as PriceSummaryView);
    /** @ignore */
    showTaxPopup: boolean = false;
    /** @ignore */
    subscription: Subscription;
    /**@ignore */
    calculateTaxForOrder: boolean = false;
    /** @ignore */
    fieldMap = [
        {
            type: this.orderService.type,
            field: 'OrderLineItems'
        },
        {
            type: this.quoteService.type,
            field: 'QuoteLineItems'
        },
        {
            type: this.cartService.type,
            field: 'LineItems'
        }
    ];
    /** @ignore */
    discardChangesModal: BsModalRef;
    taxSubscription: Subscription;

    constructor(private storefrontService: StorefrontService, private userService: UserService,
        private crService: ConstraintRuleService, private modalService: BsModalService, private quoteService: QuoteService,
        private cartService: CartService, private exceptionService: ExceptionService,
        private router: Router, private accountService: AccountService, private orderService: OrderService) { }

    /** @ignore */
    private calculateTotalEstimatedTax(lineItems: any): number {
        return sumBy(filter(lineItems, lineItem => get(lineItem, 'LineType') === 'Misc'), 'NetPrice');
    }

    /** @ignore */
    calculateTotalTax(): Observable<CartItem> { //TODO
        if (this.page === 'create-proposal' || this.page === 'checkout' || this.calculateTaxForOrder) {
            this.setLoading(true);
            return this.storefrontService.getStorefront().pipe(
                mergeMap(() => {
                    return of(null);//TODO
                    //     if (get(storefront, 'EnableTaxCalculations') && this.record instanceof Cart)
                    //         return this.taxService.computeTaxForCart().pipe(
                    //             tap(r => {
                    //                 this.exceptionService.showSuccess('TAX.COMPUTE_TAX_SUCCESS', 'TAX.COMPUTE_TAX_SUCCESS_TITLE');
                    //                 return r;
                    //             }),
                    //             tap(() => this.setLoading(false)),
                    //             catchError(e => {
                    //                 this.setLoading(false);
                    //                 this.exceptionService.showWarning(e, 'TAX.COMPUTE_TAX_ERROR_TITLE');
                    //                 return throwError(e);
                    //             })
                    //         );
                    //     else
                    //         return of(null);
                    // }),
                    // take(1)
                }
                ));
        }
        return of(null);
    }

    /** @ignore */
    calculateTotalPromotions(): number {
        return sumBy(
            filter(
                get(this.record, `${get(find(this.fieldMap, f => f.type === this.record.getType()), 'field')}`),
                line => line.PriceType !== 'Usage'
            ),
            'IncentiveAdjustmentAmount'
        );
    }

    /** @ignore */
    // TODO: This is added temporarily for August 2022 demo.
    calculateTotalAdjusmentAmount(): number {
        let adjustmentPrice = 0;
        if (this.record instanceof Cart) {
            adjustmentPrice = sumBy(flatten(_map(filter(this.record.LineItems, item => item.PriceType !== 'Usage'), line => line.AdjustmentLineItems)), 'AdjustmentAmount');
        }
        return adjustmentPrice;
    }

    /** @ignore */
    computeTaxForOrder(): Observable<CartItem> {
        if (this.record instanceof Cart && some(get(this.record, 'LineItems'), i => get(i, 'Taxable') === true)) {
            this.calculateTaxForOrder = true;
            return this.calculateTotalTax();
        }
        return of(null);
    }

    /** @ignore */
    setLoading(value: boolean): void {
        const view = this.view$.value;
        view.loading = value;
        this.view$.next(view);
    }
    /** @ignore */
    openEstimateTaxPopup() {
        this.showTaxPopup = true;
    }

    ngOnDestroy() {
        if (!isNil(this.subscription))
            this.subscription.unsubscribe();
        if (this.taxSubscription) this.taxSubscription.unsubscribe();
    }

    ngOnChanges() {
        if (!isNil(this.record)) {
            this.ngOnDestroy();
            this.subscription = combineLatest(
                this.storefrontService.getStorefront()
                , this.crService.hasPendingErrors()
                , this.userService.isLoggedIn()
                , this.cartService.getMyCart()
                , this.accountService.getCurrentAccount()
                , of(null)
            )
                .pipe(
                    map(([storefront, hasPendingErrors, isLoggedIn, cart, account, taxBreakups]) => {
                        const hasErrors = hasPendingErrors || get(cart, 'hasErrors', false);
                        return {
                            storefront: storefront,
                            accountId: get(storefront, 'DefaultAccountforGuestUsers') ? get(account, 'Id') : null,
                            isLoggedIn: isLoggedIn,
                            totalPromotions: this.calculateTotalPromotions(),
                            hasErrors: hasErrors,
                            lineItemCount: defaultTo((this.record instanceof Quote) ? get(this, 'record.QuoteLineItems.length') : get(this, 'record.OrderLineItems.length'), get(this, 'record.LineItems.length')),
                            order: get(this, 'record.Order'),
                            quote: (this.record instanceof Cart) ? get(this, 'record.Proposald') : get(this, 'record.Quote'),
                            totalEstimatedTax: null,
                            showTaxLink: get(storefront, 'EnableTaxCalculations') && this.showEstimatedTaxLink(),
                            enableTaxCalculations: get(storefront, 'EnableTaxCalculations'),
                            taxItems: taxBreakups,
                            paymentStatus: get(this.record, 'PaymentStatus'),
                            loading: this.loading || (this.cartService.isPricePending(cart) && !hasErrors) || this.cartService.isPricePending(cart) || !isEmpty(filter(cart.LineItems, r => r.PricingStatus === 'Pending')),
                            totalAdjustmentAmount: this.calculateTotalAdjusmentAmount()

                        } as PriceSummaryView;
                    })
                )
                .subscribe(r => this.view$.next(r));
        }
    }

    ngOnInit() { }

    /**
     * Method opens the discard changes confirmation modal dialog.
     * @ignore
     */
    openDiscardChangeModals() {
        this.discardChangesModal = this.modalService.show(this.discardChangesTemplate);
    }

    /**
     * Method is invoked when abonding the cart while editing the quote line item.
     * @fires this.quoteService.abandonCart()
     * @ignore
     */
    onDiscardChanges() {
        this.setLoading(true);
        const record = this.record;
        this.cartService.getMyCart().pipe(
            take(1),
            mergeMap(cart => {
                return this.cartService.abandonCart(get(cart, 'Id')).pipe(
                    mergeMap(() => this.cartService.createNewCart()),
                    mergeMap(newCart => this.cartService.setCartActive(newCart))
                );
            })
        ).subscribe(() => {
            this.setLoading(false);
            isNil(get(record, 'Proposald')) ? this.router.navigate(['/orders', get(record, 'Order.Id')]) : this.router.navigate(['/proposals', get(record, 'Proposald.Id')]);
            this.discardChangesModal.hide();
        });
    }
    /** @ignore */
    submitOrder() {
        this.onSubmitOrder.emit();
    }
    /** @ignore */
    submitPayment() {
        this.onPaymentRequest.emit();
    }
    /** @ignore */
    requestQuote() {
        this.onRequestQuote.emit();
    }
    /** @ignore */
    finalizeQuote() {
        this.onFinalizeQuote.emit();
    }
    /** @ignore */
    getCartState(): string {
        return (this.record instanceof Cart) ? get(this.record, '_state', '') : '';
    }
    /** @ignore */
    showEstimatedTaxLink(): boolean {
        return this.page === 'quotes' ||
            this.page === 'orders' ||
            this.page === 'checkout' ||
            this.page === 'create-proposal' ||
            this.page === 'paymentForOrder' ||
            this.page === '';
    }
    /** @ignore */
    disableButton(): boolean {
        return !(this.record instanceof Cart && get(this.record, 'LineItems.length') > 0);
    }
    /** @ignore */
    isQuoteOnCart(): boolean {
        return this.record instanceof Cart && !isNil(get(this.record, 'Proposald.Id'));
    }

    /**
     * Function used to save the changes after editing the order,
     * It will calculate the tax first and convert cart to order.
     */
    confirmOrderChanges() {
        this.setLoading(true);
        let orderRequestObj: Order = new Order();
        const contact: Contact = new Contact();
        combineLatest([this.cartService.getMyCart()]).pipe(
            take(1),
            switchMap(([res]) => combineLatest([of(res), this.orderService.getOrder(get(res, 'OrderId'))])),
            switchMap(([cart, order]) => {
                orderRequestObj = order;
                if (get(orderRequestObj, 'PrimaryContactId')) {
                    set(orderRequestObj, 'PrimaryContact.Id', get(orderRequestObj.PrimaryContact, 'Id'));
                    contact.FirstName = get(orderRequestObj.PrimaryContact, 'FirstName');
                    contact.LastName = get(orderRequestObj.PrimaryContact, 'LastName');
                    contact.Email = get(orderRequestObj.PrimaryContact, 'Email');
                    return this.orderService.convertCartToOrder(orderRequestObj, contact, cart, null, false);
                }
            })
        ).subscribe(order => {
            this.calculateTaxForOrder = false;
            this.setLoading(false);
            this.router.navigate(['/orders', order.Id]);
        },
            err => {
                this.setLoading(false);
                this.calculateTaxForOrder = false;
            }
        );
    }
}
/** @ignore */
interface PriceSummaryView {
    storefront: Storefront;
    accountId: string;
    isLoggedIn: boolean;
    loading: boolean;
    totalPromotions: number;
    hasErrors: boolean;
    totalEstimatedTax: number;
    showTaxLink: boolean;
    enableTaxCalculations: boolean;
    lineItemCount: number;
    paymentStatus: string;
    quote: Quote;
    order: Order;
    totalAdjustmentAmount?: number;
}
