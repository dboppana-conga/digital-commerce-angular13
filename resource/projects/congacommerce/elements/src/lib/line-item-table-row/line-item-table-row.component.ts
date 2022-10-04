import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import {
    Cart, Storefront, CartItem, CartService,
    StorefrontService, OrderLineItem, QuoteLineItem,
    AssetLineItem
} from '@congacommerce/ecommerce';
import { ProductConfigurationSummaryComponent } from '../product-configuration-summary/product-configuration-summary.component';
import { BatchSelectionService } from '../../shared/services/index';
import { CartItemView } from './interfaces/line-item-view.interface';

/**
 * Line item table row component is used to display line items on cart, quote, and order detail pages.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/line-item-table-row.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
 import { LineItemTableRowModule } from '@congacommerce/elements';

 @NgModule({
  imports: [LineItemTableRowModule, ...]
})
 export class AppModule {}
 ```
 * @example
 ```typescript
 * <apt-line-item-table-row
 *              [cart]="cart"
 *              [parent]="parentItem"
 *              [children]="childItems"
 *              [index]="index"
 * ></apt-line-item-table-row>
 ```
 */
@Component({
    selector: 'apt-line-item-table-row',
    templateUrl: './line-item-table-row.component.html',
    styleUrls: ['./line-item-table-row.component.scss'],
    encapsulation:ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineItemTableRowComponent implements OnInit, OnChanges {
    /**
     * Reference to the current cart.
     */
    @Input() cart: Cart;

    /**
     * Primary line item to show in table.
     */
    @Input() parent: any;

    /**
     * Taking product options for tax breakup items.
     */
    @Input() options: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>;

    /**
     * Non primary child line items associated with this row.
     */
    @Input() children: any;

    /**
     * The index of the row in the parent table
     */
    @Input() index: number;

    /**
     * Flag defines whether line item fields should be editable.
     */
    @Input() editableFields: boolean = true;
    @ViewChild('productConfiguration')
    summaryDialog: ProductConfigurationSummaryComponent;

    /**
     * Observable instance of the storefront.
     * @ignore
     */
    storefront$: Observable<Storefront>;

    userView$: BehaviorSubject<Array<CartItemView>> = new BehaviorSubject(new Array());
    /**
     * Cart line item reference.
     * @ignore
     */
    lineItem: CartItem | QuoteLineItem | OrderLineItem;

    /**
     * Flag to check if this component should be read only.
     * @ignore
     */
    readonly: boolean = false;

    /**
     * The product identifier set in the configuration file.
     * @ignore
     */
    identifier: string = this.cartService.configurationService.get('productIdentifier');

    /** @ignore */
    showTaxPopUp: boolean = false;

    /** @ignore */
    totalEstimatedTax: number = 0;

    renderSummary = false;

    /** @ignore */
    isFavoriteConfigurationItem: boolean = false;

    private quantity: number;

    /** @ignore */
    private subs: Array<any> = [];

    /** @ignore */
    public selected$: Observable<boolean>;

    constructor(
        private cartService: CartService,
        private storefrontService: StorefrontService,
        protected batchSelectionService: BatchSelectionService,
        private cdr: ChangeDetectorRef) {
        this.selected$ = of(false);
    }

    ngOnChanges() {
        if (this.cart && this.cart.BusinessObjectType === 'Favorite Configuration') {
            this.readonly = true;
            this.isFavoriteConfigurationItem = true;
        }
        if (this.parent instanceof CartItem) {
            const totalIncentiveAmount = _.sumBy(_.filter(this.cart.LineItems, (li) => (li.LineNumber === this.parent.LineNumber)), 'IncentiveAdjustmentAmount');
            this.parent.set('totalIncentiveAmount', totalIncentiveAmount);
            if (this.parent.AssetLineItem) {
                this.parent.Quantity = (this.parent.Quantity == null) ? this.parent.TotalQuantity : this.parent.Quantity;
            }
        }
        this.quantity = this.parent.Quantity;
    }

    ngOnInit() {
        this.storefront$ = this.storefrontService.getStorefront();
        if (!(this.parent instanceof CartItem)) {
            this.parent.PricingFrequency = this.parent.Frequency;
            this.readonly = true;
            if (_.get(this.parent, 'Taxable')) {
                this.calculateTotalTax();
            }
        }
        this.subs.push(this.batchSelectionService.getSelectedLineItems().subscribe(cartItems => {
            this.selected$ = this.batchSelectionService.isLineItemSelected(this.parent).pipe(take(1));
            this.cdr.detectChanges();
        }));
    }

    /**
     * Changes the quantity of the cart item passed to this method.
     * @param cartItem Cart item reference to change quantity.
     * @param event The event object
     * @fires CartService.updateCartItems()
     * @ignore
     */
    changeItemQuantity(cartItem: CartItem) {
        if (!cartItem.Quantity || cartItem.Quantity <= 0) {
            cartItem.Quantity = this.quantity;
        } else {
            this.cartService.updateCartItems([cartItem]).pipe(take(1)).subscribe(
                res => { },
                err => _.set(this.cart, 'IsPricePending', false)
            );
        }
    }

    /**
     * Changes the adjustment amount and type.
     * @param cartItem Cart item reference to change adjustment amount and adjusment type.
     * @fires CartService.updateCartItems()
     * @ignore
     */
    updateAdjustments(cartItem: CartItem) {
        this.cartService.updateCartItems([cartItem]).pipe(take(1)).subscribe(
            res => { },
            err => _.set(this.cart, 'IsPricePending', false)
        );
    }


    /**
     * Removes the provided CartItem from the user's current active cart.
     * @param item CartItem instance to remove from cart.
     * @param evt Event associated with the user action.
     * @fires CartService.removeCartItem()
     * @ignore
     */
    removeCartItem(item: CartItem, evt) {
        _.set(item, '_metadata._loading', true);
        this.cartService.removeCartItem(item).pipe(take(1)).subscribe(
            () => {
                _.set(item, '_metadata._loading', false);
            },
            () => {
                _.set(item, '_metadata._loading', false);
            }
        );
    }

    /**@ignore */
    showSummary() {
        this.renderSummary = true;
        setTimeout(() => this.summaryDialog.show());
    }

    /** @ignore */
    trackById(index, record): string {
        return _.get(record, 'Id');
    }

    /**
     * This will open a popup for selected line item and show the tax breakup for product and its options.
     * @param lineItemId Line item for which you want to see pop-up.
     * @ignore
     * TO DO:
     */
    openEstimateTaxPopup() {
        // let items = this.getTaxItemsBasedOnType();
        // Object.entries(_.groupBy(_.omitBy(_.concat(this.optionsTaxItems, items), _.isNil), 'TaxType'))
        //     .forEach(([key, value]) => {
        //         let singleTaxItem = new TaxBreakup();
        //         singleTaxItem.TaxType = key;
        //         _.forEach(value, (ti) => {
        //             singleTaxItem.BreakupType = _.get(ti, 'BreakupType');
        //             singleTaxItem.TaxAmount += _.get(ti, 'TaxAmount');
        //         });
        //         this.taxItems.push(singleTaxItem);
        //     });
        // this.showTaxPopUp = true;
    }

    /**
     * This method calculates total tax for given line item.
     * @ignore
     * TO DO:
     */
    calculateTotalTax() {
        //  this.optionsTaxItems = (<Array<OrderLineItem>>this.options).every((item: OrderLineItem) => item instanceof OrderLineItem) ? _.flatten(_.map(this.options, 'OrderTaxBreakups')) : _.flatten(_.map(this.options, 'TaxBreakups'));
        //  this.totalEstimatedTax = _.sumBy(_.concat(this.getTaxItemsBasedOnType(), this.optionsTaxItems), 'TaxAmount');
    }

    /** @ignore */
    showTaxPopupLink(): boolean {
        return (this.parent && !(this.parent instanceof CartItem) && _.get(this.parent, 'Taxable'));
    }

    /** @ignore */
    getTaxItemsBasedOnType() {
        let taxItems;
        if (this.parent instanceof OrderLineItem) {
            taxItems = _.get(this.parent, 'OrderTaxBreakups');
        }
        else {
            taxItems = _.get(this.parent, 'TaxBreakups');
        }
        return taxItems;
    }

    /** @ignore */
    trackByFn(index, item) {
        return item.Id ? item.Id : index;
    }

    /** @ignore */
    isOrderOrProposal(parentRecord) {
        return _.get(parentRecord, 'OrderId') || _.get(parentRecord, 'Proposal');
    }

    /** @ignore */
    handleCheckbox(e) {
        if (e.target.checked) this.batchSelectionService.addLineItemToSelection(this.parent);
        else this.batchSelectionService.removeLineItemFromSelection(this.parent);
    }

    /** @ignore */
    isCartLineItem(lineItem) {
        return lineItem instanceof CartItem && !this.isFavoriteConfigurationItem;
    }

    /** @ignore */
    updateValues(view: CartItemView, parent: CartItem) {
        if (!_.isEqual(view, parent)) {
            if (!parent.Quantity || parent.Quantity <= 0) {
                parent.Quantity = this.quantity;
            }
            parent[view.fieldName] = view;
            this.cartService.updateCartItems([parent]).pipe(take(1)).subscribe(
                res => { },
                err => _.set(this.cart, 'IsPricePending', false)
            );
        }

    }

    /**
     * @ignore
     */
    ngOnDestroy() {
        if (this.subs.length > 0) {
            this.subs.forEach(sub => sub.unsubscribe());
        }
    }
}