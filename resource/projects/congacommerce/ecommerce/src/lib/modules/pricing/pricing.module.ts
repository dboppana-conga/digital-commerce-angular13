import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPricePipe, AttributeValuePricePipe, CartItemPricePipe, CartPricePipe, LocalCurrencyPipe, FormatCurrencyPipe, OrderPricePipe, OptionPricePipe, OrderLineItemPricePipe, QuotePricePipe, LineItemPricePipe, ConvertCurrencyPipe } from './pipes/index';
import { CurrencyPipe } from '@angular/common';

export * from './services/index';
export * from './classes/index';
export * from './pipes/index';
export * from './enums/index';

/**
 * @ignore
 */
const pricingPipes = [ProductPricePipe, AttributeValuePricePipe, CartItemPricePipe, CartPricePipe, LocalCurrencyPipe, FormatCurrencyPipe, OrderPricePipe, OrderLineItemPricePipe, OptionPricePipe, QuotePricePipe, LineItemPricePipe, ConvertCurrencyPipe];
/**
 * @ignore
 */
@NgModule({
    imports: [CommonModule],
    declarations: [pricingPipes],
    providers: [pricingPipes, CurrencyPipe],
    exports: [pricingPipes]
})
export class PricingModule { }