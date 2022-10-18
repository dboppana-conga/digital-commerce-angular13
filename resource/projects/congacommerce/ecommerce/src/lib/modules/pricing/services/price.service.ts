import { Injectable } from '@angular/core';
import { throwError as observableThrowError, combineLatest, Observable, of, zip } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import {
    isNil, get, isEmpty, flatten, defaultTo, sumBy, reduce,
    sum, includes, set, filter, compact, find, map as _map, isArray
} from 'lodash';

// Core
import { MetadataService } from '@congacommerce/core';

// Services
import { PriceListService } from '../../pricing/services/price-list.service';
import { PriceMatrixService } from '../../pricing/services/price-matrix.service';
import { CartService } from '../../cart/services/cart.service';
import { PriceListItemService } from './price-list-item.service';
import { ProductAttributeValueService } from '../../catalog/services/product-attribute.service';
import { StorefrontService } from '../../store/services/storefront.service';
import { ConversionService } from './conversion.service';

// Models
import { OrderLineItem, Order, QuoteLineItem, Quote } from '../../order/classes/index';
import { Product, ProductAttributeValue, ProductAttribute, ProductOptionComponent } from '../../catalog/classes/index';
import { PriceListItem, PriceMatrix, Price, PriceRule, PriceRuleEntry, PriceMatrixEntry } from '../../pricing/classes/index';
import { Cart } from '../../cart/classes/cart.model';
import { CartItem } from '../../cart/classes/cart-item.model';
import { AssetLineItem } from '../../abo/classes/asset-item.model';

// Interfaces
import { LocalCurrencyPipe } from '../pipes/convert.pipe';
import { ChargeType } from '../enums/charge-type.enum';
import { LineStatus } from '../../cart/enums/line-status.enum';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * Client-side pricing engine for retrieving price for various points in the ecommerce application.
 * NOTE: It is not guarunteed that this service will always return accurate pricing for a given cart. You should always call cartService.priceCart(...) to trigger
 * the server-side pricing engine to get the final price of a given cart.
 * There are also pipes provided that wrap this service to provide pricing within a template (i.e. ProductPricePipe, OrderPricePipe, CartPricePipe etc...)
 * <h3>Usage</h3>
 *
 ```typescript
import { PriceService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private priceService: PriceService)
}
// or
export class MyService extends AObjectService {
     private priceService: PriceService = this.injector.get(PriceService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class PriceService {
    queryKey: string = null;
    queryList: Array<PriceListItem>;
    matrixData = {};
    cartPending: boolean = false;
    previousCartPrice: Price = null;

    /**
     * Method calcuates the adjustment amount for a line item based on its adjustment type.
     * @param adjustmentAmount numeric value representing the adjustment amount on line item.
     * @param adjustmentType string value representing the type of adjustment.
     * @param amount numeric value representing the price on line item. The price can be list price, base price etc.
     * @returns a numberic value representing the adjustment amount.
     */
    static adjustValue(adjustmentAmount: number, adjustmentType: string, amount: number): number {
        adjustmentAmount = (isNaN(adjustmentAmount)) ? 0 : adjustmentAmount;
        let val = amount;
        if (adjustmentType === Adjustment.PER_DISCOUNT)
            val = (amount - (amount * (adjustmentAmount / 100)));
        else if (adjustmentType === Adjustment.DISCOUNT_AMOUNT)
            val = amount - (adjustmentAmount);
        else if (adjustmentType === Adjustment.PER_MARKUP)
            val = amount + ((amount * (adjustmentAmount / 100)));
        else if (adjustmentType === Adjustment.MARKUP_AMT)
            val = amount + (adjustmentAmount);
        else if (adjustmentType === Adjustment.PRICE_FACTOR)
            val = amount * (adjustmentAmount);
        else if (adjustmentType === Adjustment.LIST_PRICE_OVERRIDE)
            val = (adjustmentAmount);

        return val;
    }

    constructor(private priceListService: PriceListService,
        private cartService: CartService,
        private priceMatrixService: PriceMatrixService,
        private metadataService: MetadataService,
        private localCurrencyPipe: LocalCurrencyPipe,
        private productAttributeValueService: ProductAttributeValueService,
        private conversionService: ConversionService,
        private storefrontService: StorefrontService) { }

    /**
     * Method is used to retrieve the price for a given product.
     * ### Example:
```typescript
import { PriceService, Price, Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

    getProductPrice(product: Product){
        this.priceService.getProductPrice(product).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getProductPrice(product);
    }
}
```

    /**
     *
     * @param product the instance of the product to return the price for.
     * @param quantity the number of product items to calculate.
     * @param term an integer value representing the selling term, defaulted to 1.
     * @param attributeValue an optional parameter representing the product attribute value.
     * @param bundle flag indicates if the product is a bundle with option groups and product option components.
     * @param chargeType an optional parameter representing the charge type to calculate the price for.
     * @returns a hot observable containing the price instance for the given product.
     */
    getProductPrice(product: Product, quantity: number = 1, term: number = 1, attributeValue?: ProductAttributeValue, bundle: boolean = false, chargeType?: ChargeType): Observable<Price> {
        return combineLatest([
            this.productAttributeValueService.describe(),
            this.priceListService.getPriceList()
        ])
            .pipe(
                mergeMap(([metadata, priceList]) => {
                    let adjustmentType, adjustmentAmount = null;
                    const pli = PriceListItemService.getPriceListItemForProduct(product, chargeType);

                    if (priceList && !isNil(get(priceList, 'BasedOnPriceList.Id')) && get(priceList, 'BasedOnPriceList.Id') === get(pli, 'PriceListId')) {
                        adjustmentType = priceList.BasedOnAdjustmentType;
                        adjustmentAmount = priceList.BasedOnAdjustmentAmount;
                    }

                    if (!isNil(pli)) {
                        const unitPrice = (get(pli, 'ContractPrice', 0) > 0) ? get(pli, 'ContractPrice') : get(pli, 'ListPrice');
                        const plCurrencyAmount = this.convertCurrency(unitPrice);
                        const unitPriceWithAdjustments = PriceService.adjustValue(adjustmentAmount, adjustmentType, plCurrencyAmount);

                        const p: Price = new Price(this.localCurrencyPipe);
                        const priceType = get(pli, 'PriceType');
                        p.basePrice = unitPriceWithAdjustments;
                        p.listPrice = unitPriceWithAdjustments;
                        p.listExtendedPrice = unitPriceWithAdjustments * quantity;
                        p.baseExtendedPrice = unitPriceWithAdjustments * quantity * term;
                        p.netPrice = (priceType === 'Recurring' && term) ? unitPriceWithAdjustments * quantity * term : unitPriceWithAdjustments * quantity;

                        // Attributes
                        const attr = defaultTo(attributeValue, this.productAttributeValueService.getInstanceWithDefaults(product, metadata));
                        this.matrixAdjustment(p, get(pli, 'PriceMatrices'), quantity, attr, null);

                        if (bundle) {
                            const productOptions = filter(flatten(_map(get(product, 'OptionGroups'), (group) => get(group, 'Options'))), c => get(c, 'Default') === true);
                            const optionObsv$ = (!isEmpty(productOptions))
                                ? zip(...productOptions.map(c => this.getProductPrice(get(c, 'ComponentProduct'), defaultTo(c.DefaultQuantity, 1), 1, undefined, true)))
                                : of(null);
                            return optionObsv$.pipe(
                                map(optionPrices => {
                                    p.netPrice += defaultTo(sumBy(optionPrices, 'netPrice') * quantity, 0);
                                    return p;
                                })
                            );
                        } else {
                            return of(p);
                        }
                    } else
                        return of(new Price(this.localCurrencyPipe));
                })
            );
    }

    /**
     * Method is used to retrieve the price of an option for a given product
     * ### Example:
```typescript
import { PriceService, Price, ProductOptionComponent } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

    getOptionAdjustmentPrice(option: ProductOptionComponent){
        this.priceService.getOptionAdjustmentPrice(option).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getOptionAdjustmentPrice(option);
    }
}
```
     * @param option the instance of the product option component to calculate the adjustment amount for
     * @param quantity the quantity of options to get the price for
     * @returns a hot observable containing the price of the given option
     */
    getOptionAdjustmentPrice(option: ProductOptionComponent, quantity: number = 1): Observable<Price> {
        if (option)
            return this.getProductPrice(option.ComponentProduct, quantity);
        else
            return of(new Price(this.localCurrencyPipe, 0, 0, 0));
    }

    /**
     * Method returns a price for a given attribute and its value on a product
     * ### Example:
```typescript
import { PriceService, Price, ProductAttribute, Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

     getAttributePriceForProduct(product: Product, attribute: ProductAttribute, attributeValue: any){
        this.priceService.getAttributePriceForProduct(product, attribute, attributeValue).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getAttributePriceForProduct(product, attribute, attributeValue);
    }
}
```
     * @param product the instance of the product that the attribute is associated with
     * @param attribute the instance of the attribute to calculate the adjustment for
     * @param attributeValue The value of the attribute to calculate the price for
     * @returns a hot observable containing the price of a given attribute value
     */
    getAttributePriceForProduct(product: Product, attribute: ProductAttribute, attributeValue: any): Observable<Price> {
        return this.priceListService.getPriceList().pipe(mergeMap(priceList => {

            const priceListItem = get(product, 'PriceLists')
                .filter(pli => (pli != null) ? pli.PriceList.Id === priceList.Id : false)[0];
            const price = (priceListItem) ? (priceListItem.ContractPrice) ? priceListItem.ContractPrice : priceListItem.ListPrice : null;
            if (!priceListItem)
                return observableThrowError(new Error('Product does not have a valid price list item'));
            else {
                return this.priceMatrixService.getPriceMatrixData([priceListItem]).pipe(map(priceMatrixData => {
                    if (priceMatrixData.length > 0 && get(priceMatrixData[0], 'MatrixEntries')) {
                        const sortedDimensions = priceMatrixData.sort((n1, n2) => n1.Sequence - n2.Sequence);
                        let val = null;
                        for (let matrix of sortedDimensions) {
                            matrix.MatrixEntries.forEach(entry => {
                                for (let i = 1; i <= 6; i++) {
                                    if (get(attribute, 'Field') === get(matrix, 'Dimension' + i + '.Datasource') &&
                                        get(entry, 'Dimension' + i + 'Value') === attributeValue) {
                                        val = PriceService.adjustValue(entry.AdjustmentAmount, entry.AdjustmentType, priceListItem.ListPrice);
                                        break;
                                    }
                                }
                            });
                        }
                        const final = (val - price);
                        return new Price(this.localCurrencyPipe, final);
                    } else
                        return new Price(this.localCurrencyPipe, 0);
                }));
            }
        }));
    }

    /**
     * Method returns the price for a given cart. If the first parameter is left blank, it will return the price for the current cart.
     * ### Example:
```typescript
import { PriceService, Price, Cart } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

     getCartPrice(){
        this.priceService.getAttributePriceForProduct().subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getAttributePriceForProduct();

    //or
    
    getCartPrice(cart: Observable<Cart> | Cart){
        this.priceService.getAttributePriceForProduct(cart).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getAttributePriceForProduct(cart);

    }
}
```
     * @param cart$ An optional parameter of the cart to calculate the price for. Can be an observable or a Cart instance. If left blank, will return the price for the current cart.
     * @returns A hot observable containing the price of the given cart
     */
    getCartPrice(cart$?: Observable<Cart> | Cart): Observable<Price> {
        if (!cart$)
            cart$ = this.cartService.getMyCart();
        else if (cart$ instanceof Cart)
            cart$ = of(cart$);

        return cart$.pipe(
            mergeMap(cart => {
                const grandTotal = find(get(cart, 'SummaryGroups', []), (group) => group.LineType === 'Grand Total');
                const subTotal = filter(get(cart, 'SummaryGroups', []), (group) => (group.LineType === 'Subtotal' && group.ChargeType !== 'Sales Tax'));
                if (grandTotal)
                    return of(new Price(this.localCurrencyPipe
                        , grandTotal.NetPrice
                        , grandTotal.BasePrice
                        , grandTotal.ExtendedListPrice
                        , sum(subTotal.map(t => t.ExtendedListPrice))
                        , sum(subTotal.map(t => t.BaseExtendedPrice)) + grandTotal.OptionPrice));
                else {
                    return of(new Price(this.localCurrencyPipe));
                }
            })
        );
    }

    /**
     * Method returns a price instance for a given cart item. If the price for the item has already been calculated, it will not do client side calculation.
     * ### Example:
```typescript
import { PriceService, Price, CartItem , AssetLineItem , OrderLineItem , QuoteLineItem } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

      getLineItemPrice(itemList: Array<CartItem | AssetLineItem | OrderLineItem | QuoteLineItem> | CartItem | AssetLineItem | QuoteLineItem | OrderLineItem){
        this.priceService.getLineItemPrice(itemList).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getLineItemPrice(itemList);
    }
}
```
     * @param itemList list of line items to return a price for.
     * Line items can be from a cart, an asset, an order or a quote.
     * @returns A hot observable containing the price of the given item.
     */
getLineItemPrice(itemList: Array<CartItem | AssetLineItem | OrderLineItem | QuoteLineItem> | CartItem | AssetLineItem | QuoteLineItem | OrderLineItem,
    options?: Array<AssetLineItem | QuoteLineItem | OrderLineItem>): Observable<Price> {
    const validLines = [LineStatus.Amend, LineStatus.New, LineStatus.Upgrade, LineStatus.Renew, LineStatus.Increment, LineStatus.Existing, LineStatus.Activate];

    const getItemPrice = (item: CartItem | AssetLineItem | OrderLineItem | QuoteLineItem, chargeType?: ChargeType): Observable<Price> => {
        const product = (get(item, 'LineType') === 'Option') ? get(item, 'Option') : get(item, 'Product');
        set(item, 'PriceListItem.Frequency', defaultTo(get(item, 'PriceListItem.Frequency'), '--None--'));

        const empty$ = of(new Price(this.localCurrencyPipe, 0, 0, 0, 0, 0));

        if (isNil(item))
            return empty$;

        if (item.IsOptionRollupLine) {
            return this.getRollupItemPrice(item);
        }
        let breakupItems = (item instanceof OrderLineItem) ? 'OrderTaxBreakups' : 'TaxBreakups';
        if (includes(validLines, get(item, 'LineStatus') || get(item, 'AssetStatus')) || isNil(get(item, 'LineStatus'))) {
            return this.storefrontService.getStorefront()
                .pipe(
                    take(1),
                    map(store =>
                        new Price(this.localCurrencyPipe
                            , item.NetPrice
                            + ((get(store, 'EnableTaxCalculations', false) && get(item, breakupItems)) ? sumBy(get(item, breakupItems), 'TaxAmount') : 0)
                            + (get(store, 'EnableTaxCalculations', false) ? (sumBy(flatten(compact(_map(options, breakupItems))), 'TaxAmount')) : 0)
                            , item.BasePrice
                            , (item.LineType === 'Misc' ? 0 : defaultTo(get(item, 'ListPrice.Value'), get(item, 'ListPrice')))
                            , (item.LineType === 'Misc' ? 0 : defaultTo(get(item, 'ListPrice.Value'), get(item, 'ListPrice')) * item.Quantity)
                            , item.ExtendedPrice)
                    ) // Close map
                ); // Close pipe
        } else {
            return empty$;
        }
    };

    if (isArray(itemList)) {
        const items = compact(filter(itemList, i => includes(validLines, get(i, 'LineStatus') || get(i, 'AssetStatus'))));
        return combineLatest(_map(items, i => getItemPrice(i, ChargeType.StandardPrice)))
            .pipe(
                map(prices => {
                    return reduce(prices, (acc, val) => acc.addPrice(val));
                })
            );
    } else
        return getItemPrice(itemList as CartItem | AssetLineItem | QuoteLineItem | OrderLineItem);
}

    /**
     * @ignore
     */
    getRollupItemPrice(item: CartItem | AssetLineItem | QuoteLineItem | OrderLineItem): Observable<Price> {
        return of(new Price(
            this.localCurrencyPipe,
            item.NetPrice
        ));
    }

    /**
     * Method returns a price for a given order instance.
     * ### Example:
```typescript
import { PriceService, Price, Order } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

      getOrderPrice(order: Order){
        this.priceService.getOrderPrice(order).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getOrderPrice(order);
    }
}
```
     * @param order the instance of the order to return a price for
     * @returns a hot observable containing the price of the order
     */
    getOrderPrice(order: Order): Observable<Price> {
        return this.storefrontService.getStorefront()
            .pipe(mergeMap(store => {
                const orderPrice = new Price(this.localCurrencyPipe);
                const optionPrice = sum(filter(get(order, 'OrderLineItems'), lineItem => lineItem.LineType === 'Option').map(item => item.BaseExtendedPrice));

                // Filter the line items with price type as 'Usage' since usage pricing is computed only at billing time. (Current behavior in CPQ).
                filter(get(order, 'OrderLineItems')
                    , i => (i.LineType === 'Product/Service' && i.PriceType !== 'Usage' || (get(store, 'EnableTaxCalculations', false) && i.LineType === 'Misc'))).forEach(lineItem => {
                        const linePrice = new Price(this.localCurrencyPipe
                            , lineItem.NetPrice
                            , lineItem.BasePrice
                            , (lineItem.LineType === 'Misc' ? 0 : get(lineItem, 'PriceListItem.ListPrice'))
                            , (lineItem.LineType === 'Misc' ? 0 : get(lineItem, 'NetPrice'))
                            , (lineItem.LineType === 'Misc' ? 0 : lineItem.BaseExtendedPrice));
                        return orderPrice.addPrice(linePrice);
                    });
                orderPrice.addPrice(new Price(this.localCurrencyPipe, null, null, null, null, optionPrice));
                return of(orderPrice);
            }));
    }

    /**
     * @ignore
     */
    getAssetLineItemPrice(assetLineItem: AssetLineItem): Observable<Price> {
        return of(new Price(this.localCurrencyPipe
            , get(assetLineItem, 'NetPrice', 0)
            , get(assetLineItem, 'BasePrice', 0)
            , get(assetLineItem, 'ListPrice', 0)
            , get(assetLineItem, 'ExtendedPrice', 0)
            , get(assetLineItem, 'BaseExtendedPrice', 0)
        )
        );
    }

    /**
     * Method returns a price for a given Quote instance.
     * ### Example:
```typescript
import { PriceService, Price, Quote} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

      getQuotePrice(quote: Quote){
        this.priceService.getQuotePrice(quote).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getQuotePrice(quote);
    }
}
```
     * @param quote the instance of the Quote to return a price for
     * @returns a hot observable containing the price of the Quote
     */
    getQuotePrice(quote: Quote): Observable<Price> {
        return this.storefrontService.getStorefront()
            .pipe(mergeMap(store => {
                const quotePrice = new Price(this.localCurrencyPipe);
                filter(get(quote, 'QuoteLineItems')
                    , i => ((i.LineType === 'Product/Service' && i.PriceType !== 'Usage') ||
                        (get(store, 'EnableTaxCalculations', false) && i.LineType === 'Misc'))).forEach(lineItem => {
                            const linePrice = new Price(this.localCurrencyPipe
                                , lineItem.NetPrice
                                , lineItem.BasePrice
                                , (lineItem.LineType === 'Misc' ? 0 : get(lineItem, 'PriceListItem.ListPrice'))
                                , (lineItem.LineType === 'Misc' ? 0 : get(lineItem, 'NetPrice'))
                                , (lineItem.LineType === 'Misc' ? 0 : lineItem.ExtendedPrice));
                            return quotePrice.addPrice(linePrice);
                        });
                return of(quotePrice);
            }));
    }

    /**
     * Method returns price for a given OrderLineItem instance.
     * ### Example:
```typescript
import { PriceService, Price, OrderLineItem} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

      getOrderLineItemPrice(orderLI: OrderLineItem){
        this.priceService.getOrderLineItemPrice(orderLI).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getOrderLineItemPrice(orderLI);
    }
}
```
     * @param OrderLineItem the instance of the OrderLineItem to return a price for
     * @returns a hot observable containing the price of the LineItem
     */
    getOrderLineItemPrice(orderLI: OrderLineItem): Observable<Price> {
        return this.storefrontService.getStorefront().pipe(mergeMap(store => {
            if (get(store, 'EnableTaxCalculations', false) && get(orderLI, 'Taxable', false)) {
                return of(new Price(this.localCurrencyPipe
                    , (orderLI.NetPrice + sum(get(orderLI, 'OrderTaxBreakups').map(res => res.TaxAmount)))
                    , orderLI.BasePrice
                    , orderLI.ListPrice));
            }
            else
                return of(new Price(this.localCurrencyPipe, orderLI.NetPrice, orderLI.BasePrice, orderLI.ListPrice));
        }));
    }

    /**
     * Method returns a NetPrice for a given QuoteLineItem instance.
     * ### Example:
```typescript
import { PriceService, Price, QuoteLineItem} from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    price: Price;
    price$: Observable<Price>;

    constructor(private priceService: PriceService){}

      getQuoteLineItemPrice(quoteLI: QuoteLineItem){
        this.priceService.getQuoteLineItemPrice(quoteLI).subscribe(a => this.price = a);
        // or
        this.price$ = this.priceService.getQuoteLineItemPrice(quoteLI);
    }
}
```
     * @param QuoteLineItem the instance of the QuoteLineItem to return a price for
     * @returns a hot observable containing the price of the QuoteLineItem
     */
    getQuoteLineItemPrice(quoteLI: QuoteLineItem): Observable<Price> {
        return this.storefrontService.getStorefront().pipe(mergeMap(store => {
            if (get(store, 'EnableTaxCalculations', false) && get(quoteLI, 'Taxable', false)) {
                return of(new Price(this.localCurrencyPipe
                    , (quoteLI.NetPrice + sum(get(quoteLI, 'TaxBreakups').map(res => res.TaxAmount)))
                    , quoteLI.BasePrice
                    , quoteLI.ListPrice));
            }
            else
                return of(new Price(this.localCurrencyPipe, quoteLI.NetPrice, quoteLI.BasePrice, quoteLI.ListPrice));
        }));
    }

    /**
     * @ignore
     */
    private ruleAdjustment(p: Price, priceRules: Array<PriceRule>, lineItem: CartItem): Price {
        const product = lineItem.Product;
        const productGroups = defaultTo(get(product, 'ProductGroups'), []).map(groupMember => groupMember.ProductGroup.Id);
        // Get matching rule sets
        const matchingRules = priceRules.filter(rule =>
            (rule.Ruleset.ProductFamily === product.Family || rule.Ruleset.ProductFamily == null)
            && (rule.Ruleset.ProductCategory === get(product, 'Categories[0].Name') || rule.Ruleset.ProductCategory == null)
            && (productGroups.indexOf(get(rule.Ruleset.ProductGroup, 'Id') >= 0 || get(rule.Ruleset.ProductGroup, 'Id') == null))
            && this.validateCriteria(rule.Ruleset.Criteria, lineItem)
        );
        matchingRules.forEach(rule => this.processEntries(rule, rule.RuleEntries, p, lineItem.Quantity, lineItem.AttributeValue, lineItem));
        return p;
    }

    /**
     * @ignore
     */
    private validateCriteria(criteriaString: string, lineItem: CartItem): boolean {
        if (!criteriaString)
            return true;
        else {
            const criteriaObject = JSON.parse(criteriaString);
            if (criteriaObject.sObjectName !== 'Apttus_Config2__LineItem__c')
                return false;
            let valid = true;
            get(criteriaObject, 'filter.predicates', []).forEach(p => {
                let validItem = false;
                if (p.CompOper === 'contains' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '').indexOf(get(p, 'FieldValue', '')) >= 0)
                    validItem = true;
                else if (p.CompOper === 'equal to' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '') === get(p, 'FieldValue', ''))
                    validItem = true;
                else if (p.CompOper === 'not equal to' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '') !== get(p, 'FieldValue', ''))
                    validItem = true;
                else if (p.CompOper === 'starts with' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '').indexOf(get(p, 'FieldValue', '')) === 0)
                    validItem = true;
                else if (p.CompOper === 'does not contain' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '').indexOf(get(p, 'FieldValue', '')) < 0)
                    validItem = true;
                else if (p.CompOper === 'less than' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '') < get(p, 'FieldValue', ''))
                    validItem = true;
                else if (p.CompOper === 'greater than' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '') > get(p, 'FieldValue', ''))
                    validItem = true;
                else if (p.CompOper === 'less than or equal to' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '') <= get(p, 'FieldValue', ''))
                    validItem = true;
                else if (p.CompOper === 'greater than or equal to' && get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '') >= get(p, 'FieldValue', ''))
                    validItem = true;
                else if (p.CompOper === 'in' && get(p, 'FieldValue', '').indexOf(get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '')) >= 0)
                    validItem = true;
                else if (p.CompOper === 'not in' && get(p, 'FieldValue', '').indexOf(get(lineItem, this.metadataService.getKeyName(lineItem, p.FieldName), '')) < 0)
                    validItem = true;
                if (!validItem)
                    valid = false;
            });
            return valid;
        }
    }

    /**
     * @ignore
     */
    private matrixAdjustment(p: Price, priceMatrices: Array<PriceMatrix>, quantity: number, attributeValue: ProductAttributeValue, context: CartItem | OrderLineItem): void {
        if (!isEmpty(get(priceMatrices, '[0].MatrixEntries', []))) {
            const sortedDimensions = priceMatrices.sort((n1, n2) => n1.Sequence - n2.Sequence);
            const qty = get(context, 'Quantity', quantity);
            for (const matrix of sortedDimensions) {
                this.processEntries(matrix, matrix.MatrixEntries, p, qty, attributeValue, context);
                if (matrix.StopProcessingMoreMatrices) {
                    break;
                }
            }
        }
    }

    /**
     * @ignore
     */
    private processEntries(record: PriceMatrix | PriceRule, entries: Array<PriceMatrixEntry | PriceRuleEntry>, p: Price, quantity: number, attributeValue: ProductAttributeValue, lineItem?: CartItem | OrderLineItem): void {
        let lastEntry = null;
        const sortedEntries = entries.sort((n1, n2) => n1.Sequence - n2.Sequence);
        for (const entry of sortedEntries) {
            let validEntry: boolean = false;
            for (let i = 1; i <= 6; i++) {
                const prefix = 'Dimension' + i;
                if (get(record, prefix + '.ContextType') || get(record, prefix + '.BusinessObject')) {
                    if (get(record, prefix + '.ContextType') === 'Product Attribute') {
                        if (attributeValue && attributeValue.hasOwnProperty(get(record, prefix + '.Datasource'))) {
                            validEntry = this.validateEntry(
                                get(record, prefix + 'ValueType')
                                , get(lineItem, this.metadataService.getKeyName(lineItem, get(record, prefix + '.Datasource')))
                                , get(entry, prefix + 'Value'));
                        }
                    } else if (get(record, prefix + '.ContextType') === 'Line Item' || get(record, prefix + '.ContextType') === 'Order Line Item' || get(record, prefix + '.BusinessObject') === 'Apttus_Config2__LineItem__c') {
                        validEntry = this.validateEntry(
                            get(record, prefix + 'ValueType')
                            , get(lineItem, this.metadataService.getKeyName(lineItem, get(record, prefix + '.Datasource')))
                            , get(entry, prefix + 'Value'));
                    }
                }
                if (validEntry)
                    break;
            }
            if (validEntry) {
                lastEntry = entry;
                break;
            }
        }
        if (get(lastEntry, 'AdjustmentType') === Adjustment.LIST_PRICE_OVERRIDE)
            p.basePrice = get(lastEntry, 'AdjustmentAmount');
        else
            p.basePrice = PriceService.adjustValue(get(lastEntry, 'AdjustmentAmount'), get(lastEntry, 'AdjustmentType'), p.basePrice);
    }

    /**
     * @ignore
     */
    private validateEntry(attrType: string, attrValue: any, expectedValue: any): boolean {
        if (attrType === 'Discrete')
            return attrValue === expectedValue || Number(attrValue) === Number(expectedValue);
        else if (attrType === 'Range') {
            return Number(attrValue) <= Number(expectedValue);
        } else
            return false;
    }

    /**
     * Method converts a given price value to price list currency, based on the conversion rates defined.
     * @ignore
     */
    private convertCurrency(value: number): number {
        let res = value;
        this.conversionService.getCurrencyTypeForPricelist().pipe(take(1)).subscribe(currency => {
            const conversionRate = (currency && currency.ConversionRate) ? currency.ConversionRate : 1;
            res = value * conversionRate;
        });
        return res;
    }
}
/**@ignore */
enum Adjustment {
    PER_DISCOUNT = '% Discount',
    DISCOUNT_AMOUNT = 'Discount Amount',
    PER_MARKUP = '% Markup',
    MARKUP_AMT = 'Markup Amount',
    PRICE_FACTOR = 'Price Factor',
    LIST_PRICE_OVERRIDE = 'List Price Override'
}