import { Injectable } from '@angular/core';
import { of, Observable, combineLatest, throwError, zip } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import {
    get, map as _map, isNil, filter, forEach, concat, find, first, isEqual, join,
    defaultTo, cloneDeep, assign, omit, pick, keys, flatten, compact, debounce, set
} from 'lodash';
import * as moment from 'moment';
import { AObjectService } from '@congacommerce/core';
import { AssetLineItem } from '../../abo/classes/asset-item.model';
import { QuoteLineItem, OrderLineItem } from '../../order/classes';
import { ProductAttributeValue } from '../../catalog/classes/product-attribute-value.model';
import { CartItem } from '../classes/cart-item.model';
import { Product } from '../../catalog/classes/product.model';
import { Cart } from '../classes/cart.model';
import { ProductOptionComponent } from '../../catalog/classes/product-option.model';
import { LineStatus } from '../enums';
import { ProductAttributeValueService } from '../../catalog/services/product-attribute.service';
import { PriceListItemService } from '../../pricing/services/price-list-item.service';
import { PriceListService } from '../../pricing/services/price-list.service';
import { AccountService } from '../../crm/services/account.service';
import { StorefrontService } from '../../store/services/storefront.service';
import { LineItemService } from '../../../services/line-item.service';
import { CartService } from './cart.service';
import { CategoryService } from '../../catalog/services/category.service';

/** @ignore */
const _moment = moment;

/**
 * Cart Item service returns the selling term and the end date of a recurring product.
 * <h3>Usage</h3>
 *
 ```typescript
import { CartItemService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private cartItemService: CartItemService)
}
// or
export class MyService extends AObjectService {
     private cartItemService: CartItemService = this.injector.get(CartItemService);
 }
```
*/
@Injectable({
    providedIn: 'root'
})
export class CartItemService extends LineItemService {
    type = CartItem;
    frequencyMap = {
        'Hourly': 'hours',
        'Monthly': 'months',
        'Daily': 'days',
        'Weekly': 'weeks',
        'Quarterly': 'years',
        'Half Yearly': 'years',
        'Yearly': 'years',
        '--None--': '--None--'
    };

    private cartService: CartService = this.injector.get(CartService);
    protected productAttributeValueService: ProductAttributeValueService = this.injector.get(ProductAttributeValueService);
    protected accountService: AccountService = this.injector.get(AccountService);
    protected storefrontService: StorefrontService = this.injector.get(StorefrontService);
    protected priceListService: PriceListService = this.injector.get(PriceListService);
    protected categoryService: CategoryService = this.injector.get(CategoryService);

    /**
     * Need to use an offset to account for the debounce time. (i.e. user clicking add to cart a really quickly)
     */
    private lineItemOffset = 0;
    private debounceReset;

    /**
     * This method returns the end date of a recurring product based on its start date and the selling frequency.
     * 
     * ### Example:
```typescript
import { CartItemService, CartItem } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    endDate: Date;

    constructor(private cartItemService: CartItemService){}

    getEndDateForProduct(startDate: Date, term: number, frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | '--None--' ){
        this.endDate = this.cartItemService.getEndDateForProduct(startDate, term, frequency);
    }
}
```
     * @param purchaseDate the day of purchase of the product.
     * @param frequency the selling frequency for the product. Selling frequency may take values like hourly, daily, weekly, monthly, quarterly, half yearly and yearly.
     * @returns a date value representing the day of end of service of the product.
     */
    getEndDate(purchaseDate: Date, term: number, frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | '--None--'): Date {
        let endDate: Date;
        let date: Date = new Date(purchaseDate);
        switch (frequency) {
            case 'Hourly': {
                endDate = _moment(date).add(term, 'h').toDate();
                break;
            }
            case 'Daily': {
                endDate = _moment(date).add(term, 'd').toDate();
                break;
            }
            case 'Weekly': {
                endDate = _moment(date).add(term, 'w').toDate();
                break;
            }
            case 'Monthly': {
                endDate = _moment(date).add(term, 'M').toDate();
                break;
            }
            case 'Quarterly': {
                endDate = _moment(date).add(term, 'Q').toDate();
                break;
            }
            case 'Half Yearly': {
                endDate = _moment(date).add(term * 6, 'M').toDate();
                break;
            }
            case 'Yearly': {
                endDate = _moment(date).add(term, 'y').toDate();
                break;
            }
            default: {
                endDate = date;
            }
        }
        return endDate = (frequency !== 'Hourly' && frequency !== '--None--') ? _moment(endDate).subtract(1, 'd').toDate() : endDate;
    }

    /**
     * This method is used to calculate selling term of the recurring product based on its start date, end date and the selling frequency.
     * ### Example:
```typescript
import { CartItemService, CartItem } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    term: number;

    constructor(private cartItemService: CartItemService){}

    getTermForProduct(startDate: Date, endDate: Date, frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | '--None--' ){
        this.term = this.cartItemService.getTermForProduct(startDate, endDate, frequency);
    }
}
```
     * @param startDate the day of purchase of the product.
     * @param endDate the day of end of service for the product.
     * @param frequency the selling frequency of the product.
     * @returns number representing the selling term of the recurring product.
    */
    getTerm(startDate: moment.Moment, endDate: moment.Moment, frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | '--None--'): number {
        let tempEndDate = cloneDeep(endDate);
        tempEndDate.add(1, 'd');
        if (startDate.format('DD') === endDate.format('DD') || startDate.format('DD') === tempEndDate.format('DD')) {
            endDate = endDate.add(1, 'd');
        }
        let val = endDate.diff(startDate, this.frequencyMap[frequency] as moment.unitOfTime.Diff, true);
        if (frequency === 'Quarterly')
            val = val * 4;
        if (frequency === 'Half Yearly')
            val = val * 2;
        val = Math.round(val * 1000) / 1000;
        return val;
    }

    /**
     * @ignore
     */
    getReadableTerm(term: number, frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | 'One Time' | '--None--'): string {
        let val = term;
        if (frequency === 'One Time')
            return frequency;
        else {
            if (frequency === 'Quarterly')
                val = val * 4;
            if (frequency === 'Half Yearly')
                val = val * 2;
            val = Math.round(val * 1000) / 1000;
            return `${val} ${this.frequencyMap[frequency]}`;
        }
    }

    /**
     * This method returns cart line items based on the cart id and line type passed.
     * @param cartId Cart Id for which the line items are to be retrieved.
     * @param lineType Type of cart line item to be retrieved.
     * @returns An observable containing the array of cart line items of a given line type, for a given cart.
     * @ignore
     */
    getCartItemsForCart(cartId: string, lineType?: 'Product/Service' | 'Option' | 'Misc'): Observable<Array<CartItem>> {
        // return this.where(
        //     [
        //         new ACondition(this.type, 'ConfigurationId', 'Equal', cartId),
        //         new ACondition(this.type, 'LineType', 'In', (lineType) ? [lineType] : ['Product/Service', 'Option', 'Misc'])
        //     ]
        // );
        return null;
    }

    /**
     * This method returns the bundled options for the cart line item passed.
     * @param item Instance of the cart, asset, quote or order line item passed.
     * @param context An optional context object to avoid additional network callouts
     * @returns An observable containing the array of option line items for a given cart, asset, quote or order line item.
     * @ignore
     */
    getBundleItemsForCartItem(item: CartItem | AssetLineItem | QuoteLineItem | OrderLineItem, context?: Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>): Observable<Array<CartItem | AssetLineItem | QuoteLineItem | OrderLineItem>> {
        return of(null);
        // If the item is a cart item and has a related asset
        // const service = this.metadataService.getAObjectServiceForType(item);
        // if (service && item) {

        //     let field = 'ConfigurationId';
        //     if (item instanceof AssetLineItem)
        //         field = 'BusinessObjectId';
        //     else if (item instanceof QuoteLineItem)
        //         field = 'QuoteId';
        //     else if (item instanceof OrderLineItem)
        //         field = 'OrderId';


        //     // const item$ = service.get([get(item, 'Id')]).pipe(map(res => res[0]));
        //     // return (!isNil(context) && !(item instanceof AssetLineItem))
        //     //     ? of(filter(context, i => isEqual(i.LineNumber, get(item, 'PrimaryLineNumber'))))
        //     //     : item$.pipe(
        //     //         mergeMap((i: CartItem | AssetLineItem | QuoteLineItem | OrderLineItem) => service.where([
        //     //             new ACondition(service.type, 'LineNumber', 'Equal', get(i, 'PrimaryLineNumber')),
        //     //             new ACondition(service.type, field, 'Equal', get(i, field))
        //     //         ]))
        //     //     );
        //     return null;
        // } else
        //     return of(null);
    }


    /**
     * Method will generate the default cart items for a given asset.
     * @param cartItem the primary cart item with a related asset. Generated from the amend / configure asset API
     * @returns an Obseravable containing the array of CartItem associated with cart
     * @ignore
    */
    getCartItemsForAsset(cartItem: CartItem, context?: Cart): Observable<Array<CartItem>> {
        /* TO DO : We're not using this method at the moment. */
        return of(null);
        // if (isNil(cartItem, 'AssetLineItem'))
        //     return throwError(new Error('You must provide a cart item with a related asset generated from the amend or configure asset API'));
        // return zip(this.getOptionsForItem(get(cartItem, 'AssetLineItem')), this.getOptionsForItem(cartItem, context))
        //     .pipe(
        //         map(([assetItems, cartItems]) => {
        //             // Map the asset lines
        //             return concat(
        //                 _map(assetItems,
        //                     // To a new cart item
        //                     asset => {
        //                         const existing = find(cartItems, (i) => get(i, 'AssetLineItem.Id') === get(asset, 'Id'));
        //                         if (!isNil(existing))
        //                             return existing;
        //                         else {
        //                             // Line copies the details of an asset line item to a new cart item ommiting the default Salesforce fields
        //                             const attributeValue = assign(new ProductAttributeValue(), omit(pick(get(asset, 'AttributeValue'), keys(new ProductAttributeValue())), AObjectService.defaultFields));
        //                             const newCartItem = assign(new CartItem(), omit(pick(asset, keys(new CartItem())), AObjectService.defaultFields));
        //                             newCartItem.AttributeValue = attributeValue;
        //                             newCartItem.AssetLineItem = cloneDeep(asset);
        //                             newCartItem.AssetLineItemId = get(asset, 'Id');
        //                             newCartItem.LineStatus = LineStatus.Existing;
        //                             return newCartItem;
        //                         }
        //                     }
        //                 ), filter(cartItems, i => isNil(get(i, 'AssetLineItem'))));
        //         })
        //     );
    }


    /**
     * Method gets the cart items for a given product. A bundle product with option groups populated must be passed in to retrieve related option cart items.
     * ### Example:
```typescript
import { CartItemService, CartItem } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    cartItemList: Array<CartItem>;
    cartItemList$: Observable<Array<CartItem>>;

    constructor(private cartItemService: CartItemService){}

    getCartItems(product: Product){
        this.cartItemService.getCartItemsForProduct(product).subscribe(a => this.cartItemList = a);
        // or
        this.cartItemList$ = this.cartItemService.getCartItemsForProduct(product);
    }
}
```
     * @param product the product or bundle product record to generate the cart items for
     * @param quantity the quantity to use for the cart item(s)
     * @param cart the related cart that the cart items will be added to. Must be passed in or the line number that is used will start at 1
     * @param cartItems optional list of related cart items to determine the starting primary line number
     * @param productOptionComponent The related ProductOptionComponent record for generating option line items
     * @param parentBundleNumber the default parent bundle number to use
     * @param lineNumber the default line number to use.
     * @param lineStatus the default line status to use.
     * @returns an Obseravable containing the array of CartItem associated with Product
**/
    getCartItemsForProduct(product: Product, quantity: number = 1, cart?: Cart, cartItems?: Array<CartItem>, productOptionComponent?: ProductOptionComponent, parentBundleNumber?: number, lineNumber?: number, lineStatus?: LineStatus): Observable<Array<CartItem>> {
        let product$ = of(product);
        return combineLatest([product$, this.productAttributeValueService.describe(), of(null), of(null)])// TODO: Add these back when Pricelist and Account is available
            .pipe(
                map(([p, metadata, priceListId, account]) => {
                    let cartItemList = new Array<CartItem>();
                    let primaryLineNumber = this.getNextPrimaryLineNumber(defaultTo(cartItems, get(cart, 'LineItems', [])), cart);

                    const generateLinesForProduct = (bundleProduct: Product, lineNo: number, primaryNo: number, parentNo?: number, optionComponent?: ProductOptionComponent, itemSequence: number = primaryNo): void => {
                        const cartItem = new CartItem();
                        const priceListItem = defaultTo(
                            PriceListItemService.getPriceListItemForProduct(get(optionComponent, 'ComponentProduct', bundleProduct)),
                            PriceListItemService.getPriceListItemForProduct(bundleProduct)
                        );
                        if (priceListItem) {
                            const startDate = new Date();
                            const endDate = _moment(this.getEndDate(new Date(), defaultTo(get(priceListItem, 'DefaultSellingTerm'), 1), defaultTo(get(priceListItem, 'Frequency'), '--None--')));
                            const categoryList = this.categoryService.getCategoryBranchForProductSync((optionComponent != null) ? get(optionComponent, 'ComponentProduct') : bundleProduct);
                            const classification = first(categoryList);
                            const classificationHierarchy = join(_map(categoryList, 'Name'), ' | ');
                            const hierarchyInfo = join(_map(categoryList, c => c.Name + ':Id=' + c.Id + ' | ' + c.Name + ':IncludeInTotalsView__c=' + c.IncludeInTotalsView), ' | ');


                            set(cartItem, 'Classification.Id', get(classification, 'Id'));
                            cartItem.ClassificationHierarchy = classificationHierarchy;
                            cartItem.ClassificationHierarchyInfo = hierarchyInfo;
                            cartItem.LineType = isNil(optionComponent) ? 'Product/Service' : 'Option';
                            cartItem.IsPrimaryLine = true;
                            cartItem.PricingStatus = 'Pending';
                            cartItem.Product = p;
                            set(cartItem, 'Product.Id', get(p, 'Id'));
                            cartItem.ProductVersion = isNil(optionComponent) ? get(p, 'Version') : get(optionComponent, 'ComponentProduct.Version');
                            set(cartItem, 'ProductOption.Id', get(optionComponent, 'Id'));
                            cartItem.ProductOption = optionComponent;
                            set(cartItem, 'PriceList.Id', defaultTo(get(cart, 'PriceList.Id'), priceListId));
                            set(cartItem, 'PriceListItem.Id', get(priceListItem, 'Id'));
                            set(cartItem, 'ShipToAccount.Id', defaultTo(get(cart, 'ShipToAccount.Id'), get(account, 'Id')));
                            set(cartItem, 'BillToAccount.Id', defaultTo(get(cart, 'BillToAccount.Id'), get(account, 'Id')));
                            cartItem.IsTaxable = priceListItem.Taxable;
                            // set(cartItem, 'TaxCode.Id', priceListItem.TaxCodeId);
                            cartItem.HasOptions = bundleProduct.HasOptions;
                            cartItem.HasAttributes = isNil(optionComponent) ? bundleProduct.HasAttributes : optionComponent.ComponentProduct.HasAttributes;
                            cartItem.ItemSequence = itemSequence;
                            cartItem.LineStatus = defaultTo(lineStatus, LineStatus.New);
                            cartItem.LineNumber = lineNo;
                            cartItem.PrimaryLineNumber = primaryNo;
                            cartItem.ParentBundleNumber = parentNo;
                            cartItem.PricingTerm = 1;
                            cartItem.StartDate = _moment(startDate).format('YYYY-MM-DD');
                            cartItem.EndDate = _moment(endDate).format('YYYY-MM-DD');
                            set(cartItem, 'Configuration.Id', get(cart, 'Id'));
                            cartItem.Quantity = defaultTo(get(optionComponent, 'DefaultQuantity', quantity), 1);
                            if (cartItem.HasAttributes)
                                cartItem.AttributeValue = this.productAttributeValueService.getInstanceWithDefaults(bundleProduct, metadata);
                            set(cartItem, 'Option.Id', get(optionComponent, 'ComponentProduct.Id'));
                            cartItem.Option = get(optionComponent, 'ComponentProduct');
                            cartItemList.push(cartItem);
                            const generateOptions = (bundleProd: Product): void => {
                                flatten(
                                    _map(get(bundleProd, 'OptionGroups', []), productOptionGroup => {
                                        return get(productOptionGroup, 'IsHidden')
                                            ? filter(get(productOptionGroup, 'Options', []), { 'Default': true })
                                            : filter(get(productOptionGroup, 'Options', []), (opt) => opt.Default || opt.Required);
                                    })
                                ).forEach((option, index) => {
                                    primaryLineNumber += 1;
                                    generateLinesForProduct(option.ComponentProduct, lineNo, primaryLineNumber, cartItem.PrimaryLineNumber, option, itemSequence + 1);
                                });
                            };
                            if (optionComponent)
                                generateOptions(optionComponent.ComponentProduct);
                            generateOptions(bundleProduct);
                        }
                    };

                    // Get the category information for the products
                    generateLinesForProduct(p as Product, defaultTo(lineNumber, primaryLineNumber), primaryLineNumber, parentBundleNumber, productOptionComponent);
                    return cartItemList;
                })
            );
    }

    /**
     * @ignore
     */
    getNextPrimaryLineNumber(cartItems: Array<CartItem>, cart: Cart) {
        this.lineItemOffset += 1;
        if (isNil(this.debounceReset))
            this.debounceReset = debounce(this.resetOffset, this.configurationService.get('debounceTime', 500));
        this.debounceReset();
        if (cartItems) {
            let max = Math.max(...compact(cartItems).map(o => o.PrimaryLineNumber), 0);
            if (find(get(cart, 'LineItems'), item => item.PrimaryLineNumber === (max + this.lineItemOffset))) {
                max = Math.max(...compact(get(cart, 'LineItems')).map(o => o.PrimaryLineNumber), 0);
            }
            return max + this.lineItemOffset;
        } else
            return this.lineItemOffset;
    }

    /**
     * @ignore
     */
    addCartItems(cartItems: Array<CartItem>): Observable<Array<CartItem>> {
        forEach(cartItems, (cartItem: CartItem) => {
            set(cartItem, 'Configuration.Id', CartService.getCurrentCartId());
        });

        return <Observable<Array<CartItem>>>this.upsert(cartItems).pipe(tap(() => this.cartService.refreshCart()));
    }

    /**
     * @ignore
    * TO Do:
     */
    getCartItem(cartItemId: string): Observable<any> {
        // return this.query({
        //     conditions: [new ACondition(this.type, 'Id', 'In', [cartItemId])],
        //     skipCache: true
        // })
        // .pipe(
        //     map(([item]) => {
        //         if(item){
        //             item.Quantity = item.Quantity ? item.Quantity : item.TotalQuantity;
        //             return [item];
        //         } else {
        //             return null;
        //         }
        //     })
        // );
        return null;
    }

    private resetOffset() {
        this.lineItemOffset = 0;
    }
}
