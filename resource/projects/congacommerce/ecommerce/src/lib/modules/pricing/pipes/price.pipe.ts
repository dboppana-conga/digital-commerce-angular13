
import {filter} from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { PriceService } from '../services/price.service';
import { Cart } from '../../cart/classes/cart.model';
import { Product } from '../../catalog/classes/product.model';
import { Observable } from 'rxjs';
import { Price } from '../classes/price.model';
import { CartItem } from '../../cart/classes/cart-item.model';
import { ProductAttribute, ProductOptionComponent } from '../../catalog/classes/index';
import { Order } from '../../order/classes/order.model';
import { OrderLineItem } from '../../order/classes/order-line-item.model';
import { Quote } from '../../order/classes/quote.model';
import { AssetLineItem } from '../../abo/classes/asset-item.model';
import * as _ from 'lodash';
import { QuoteLineItem } from '../../order/classes';

/**
 * Provides pricing for a given product. Used as a pipe wrapper around PriceService.getProductPrice(...)
 * NOTE: It is recommend you use the {@link PriceComponent} component when rendering price as it has been optimized for change detection.
 * ### Example:
 ```html
 <!-- The totalPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(product | ProductPricePipe:1:productAttributeValueList:productOptionList | async)?.totalPrice}}<span>

 <!-- To get the formatted price (i.e. $9.99), use netPrice$ instead of totalPrice property and pass it through the async pipe again -->
 <span>{{(product | ProductPricePipe:1:productAttributeValueList:productOptionList | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name: 'ProductPricePipe' })
export class ProductPricePipe implements PipeTransform {
    constructor(private priceService: PriceService){}

    /**
     * @param value the product record to retrieve the price for
     * @param quantity the total number of products
     * @param attributes any associated attribute values to roll into the price
     * @param options any associated options to roll into the price
     */
    transform(value: Product, quantity: number = 1): Observable<Price> {
        return this.priceService.getProductPrice(value, quantity).pipe(filter(r => r != null));
    }
}

/**
 * Provides pricing for a given product option
 * NOTE: It is recommend you use the {@link PriceComponent} component when rendering price as it has been optimized for change detection.
 * ### Example:
 ```html
 <!-- The totalPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(productOption | OptionPricePipe:1 | async)?.totalPrice}}<span>

 <!-- To get the formatted price (i.e. $9.99), use netPrice$ instead of totalPrice property and pass it through the async pipe again -->
 <span>{{(productOption | OptionPricePipe:1 | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name : 'OptionPricePipe'})
export class OptionPricePipe implements PipeTransform{
    constructor(private priceService: PriceService){}

    transform(option: ProductOptionComponent, quantity: number): Observable<Price>{
        return this.priceService.getOptionAdjustmentPrice(option, quantity).pipe(filter(r => r != null));
    }
}

/**
 * Provides pricing for a given cart record
 * NOTE: It is recommend you use the {@link PriceComponent} component when rendering price as it has been optimized for change detection.
 * ### Example:
 ```html
 <!-- The totalPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(cart | CartPricePipe | async)?.totalPrice}}<span>

 <!-- To get the formatted price (i.e. $9.99), use netPrice$ instead of totalPrice property and pass it through the async pipe again -->
 <span>{{(cart | CartPricePipe | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name: 'CartPricePipe' })
export class CartPricePipe implements PipeTransform {
    constructor(private priceService: PriceService) { }

    transform(value: Cart): Observable<Price> {
        return this.priceService.getCartPrice(<Cart>value).pipe(filter(r => r != null));
    }
}

/**
 * Provides pricing for a given cart item record
 * NOTE: It is recommend you use the {@link PriceComponent} component when rendering price as it has been optimized for change detection.
 * ### Example:
 ```html
 <!-- The totalPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(cartItem | CartItemPricePipe | async)?.totalPrice}}<span>

 <!-- To get the formatted price (i.e. $9.99), use netPrice$ instead of totalPrice property and pass it through the async pipe again -->
 <span>{{(cartItem | CartItemPricePipe | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name: 'CartItemPricePipe' })
export class CartItemPricePipe implements PipeTransform {
    constructor(private priceService: PriceService) { }

    transform(value: CartItem | Array<CartItem>): Observable<Price> {
        return this.priceService.getLineItemPrice(value).pipe(filter(r => r != null));
    }
}

/**
 * Provides pricing for a given attribute value
 * ### Example:
 ```html
 <!-- The totalPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(attributeValue | AttributeValuePricePipe:product:productAttribute | async)?.totalPrice}}<span>

 <!-- To get the formatted price (i.e. $9.99), use netPrice$ instead of totalPrice property and pass it through the async pipe again -->
 <span>{{(attributeValue | AttributeValuePricePipe:product:productAttribute | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name: 'AttributeValuePricePipe' })
export class AttributeValuePricePipe implements PipeTransform {
    constructor(private priceService: PriceService) { }

    transform(value: any, product: Product, attribute: ProductAttribute): Observable<Price> {
        return this.priceService.getAttributePriceForProduct(product, attribute, value).pipe(filter(r => r != null));
    }
}

/**
 * Provides pricing for a given cart order record
 * NOTE: It is recommend you use the {@link PriceComponent} component when rendering price as it has been optimized for change detection.
 * ### Example:
 ```html
 <!-- The totalPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(order | OrderPricePipe | async)?.totalPrice}}<span>

 <!-- To get the formatted price (i.e. $9.99), use netPrice$ instead of totalPrice property and pass it through the async pipe again -->
 <span>{{(order | OrderPricePipe | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name : 'OrderPricePipe' })
export class OrderPricePipe implements PipeTransform{
    constructor(private priceService: PriceService){}

    transform(value: Order): Observable<Price>{
        return this.priceService.getOrderPrice(value).pipe(filter(r => r != null));
    }
}

/**
 * Provides pricing for a given order line item record
 * NOTE: It is recommend you use the {@link PriceComponent} component when rendering price as it has been optimized for change detection.
 * ### Example:
 ```html
 <!-- The NetPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(lineItem | OrderLineItemPricePipe | async)?.NetPrice}}<span>

 <!-- To get the formatted NetPrice (i.e. $9.99), use netPrice$ instead of netPrice property and pass it through the async pipe again -->
 <span>{{(lineItem | OrderLineItemPricePipe | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name : 'OrderLineItemPricePipe' })
export class OrderLineItemPricePipe implements PipeTransform{
    constructor(private priceService: PriceService){}

    transform(value: OrderLineItem): Observable<Price>{
        return this.priceService.getOrderLineItemPrice(value).pipe(filter(r => r != null));
    }
}

@Pipe({ name: 'LineItemPricePipe' })
export class LineItemPricePipe implements PipeTransform {
    constructor(private priceService: PriceService) { }

    transform(value: Array<CartItem | AssetLineItem | OrderLineItem | QuoteLineItem> | CartItem | AssetLineItem | QuoteLineItem | OrderLineItem): Observable<Price> {
        return this.priceService.getLineItemPrice(value).pipe(filter(r => r != null));
    }
}

/**
 * Provides pricing for a given Quote record
 * NOTE: It is recommend you use the {@link PriceComponent} component when rendering price as it has been optimized for change detection.
 * ### Example:
 ```html
 <!-- The totalPrice attribute on the returned price instance will be the number value of the price (i.e. 9.99) -->
 <span>{{(quote | QuotePricePipe | async)?.totalPrice}}<span>

 <!-- To get the formatted price (i.e. $9.99), use netPrice$ instead of totalPrice property and pass it through the async pipe again -->
 <span>{{(quote | QuotePricePipe | async)?.netPrice$ | async}}<span>
 ```
 */
@Pipe({ name : 'QuotePricePipe' })
export class QuotePricePipe implements PipeTransform{
    constructor(private priceService: PriceService) { }

    transform(value: Quote): Observable<Price>{
        return this.priceService.getQuotePrice(value).pipe(filter(r => r != null));
    }
}