import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as LocaleCurrency from 'locale-currency';

import { combineLatest } from 'rxjs';
import { get, first, find } from 'lodash';
import { map } from 'rxjs/operators';
import { UserService } from '../../crm/services/user.service';
import { ConversionService } from '../services/conversion.service';
/**
 * Core pipe to convert a number into the currency and format of the given user.
 * ### Example:
 ```html
    <!-- Renders $5.55 for USD users -->
    <span>{{5.55 | localCurrencyPipe | async}}</span>
 ```
 */
@Pipe({
    name: 'localCurrency'
})
export class LocalCurrencyPipe implements PipeTransform {

    constructor(private conversionService: ConversionService, private userService: UserService, private currencyPipe: CurrencyPipe) { }

    /**
     * @param value the number to convert
     */
    transform(value: number): any {

        return combineLatest([this.conversionService.getCurrencyTypeForPricelist(), this.userService.getLocale()])
            .pipe(
                map(res => this.currencyPipe.transform(value, get(first(res), 'IsoCode'), 'symbol-narrow', '1.' + get(first(res), 'DecimalPlaces', 2) + '-' + get(first(res), 'DecimalPlaces', 2), res[1]))
            );
    }
}
/**
 * @ignore
 */
@Pipe({
    name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
    constructor(private userService: UserService, private currencyPipe: CurrencyPipe, private conversionService: ConversionService) { }

    transform(value, args?: any): any {
        if (!value || value == null || value === undefined)
            value = 0;

        return combineLatest(this.conversionService.getMyCurrencyType(), this.userService.getLocale()).pipe(
            map(([rate, locale]) => {
                if (!value || value == null || value === undefined)
                    value = 0;

                return this.currencyPipe.transform(value, rate.IsoCode, 'symbol-narrow', '1.' + rate.DecimalPlaces + '-' + rate.DecimalPlaces, locale);
                // return new Intl.NumberFormat(this.userService.getDefaultLocale(false), { style: 'currency', currency: currencyCode }).format(value * conversionRate);
            }));
    }
}

/**
 * Core pipe to convert a number into the currency and format specified by the user.
 * By default conversion is done based on the currency ISO code defined in the price list.
 * However, user can also pass the currency ISO code that needs to be accounted for during the currency conversion.
 * Additionally user can pass the display currency symbol and decimal representation of the currency value.
 * ### Example:
 ```html
    <!-- Renders $5.55 -->
    <span>{{5.55 | convertCurrency | async}}</span>
    <!-- Renders €65.23 -->
    <span>{{65.23 | convertCurrency: 'EUR' | async}}</span>
    <!-- Renders CA$821.36 -->
    <span>{{821.36 | convertCurrency: 'CAD': 'symbol' | async}}</span>
 ```
 */
@Pipe({
    name: 'convertCurrency'
})
export class ConvertCurrencyPipe implements PipeTransform {

    constructor(private conversionService: ConversionService, private userService: UserService, private currencyPipe: CurrencyPipe) { }

    /**
     * @param value the number to convert.
     * @param currencyIsoCode a string value representing ISO 4217 currency code.
     * Defaulted to the currency code defined on price list.
     * @param display to display the currency symbol.
     * Can take values like 'code', 'symbol', 'symbol-narrow', a customized string or boolean. Defaulted to symbol-narrow
     * @param digitsInfo string representing decimal representation of currency value.
     */
    transform(
        value: number,
        currencyIsoCode: string = null,
        display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol-narrow',
        digitsInfo: string = '1.'
    ): any {

        const currencyType$ = (currencyIsoCode) ? this.conversionService.getConversionRates().pipe(map(rates => find(rates, r => r != null && r.IsoCode === currencyIsoCode))) : this.conversionService.getCurrencyTypeForPricelist();
        return combineLatest([currencyType$, this.userService.getLocale()])
            .pipe(
                map(([currency, locale]) => {
                    const currencyCode = (currency && currency.IsoCode) ? currency.IsoCode : LocaleCurrency.getCurrency(locale);
                    const conversionRate = (currency && currency.ConversionRate) ? currency.ConversionRate : 1;
                    const finalValue = value * conversionRate;
                    return this.currencyPipe.transform(finalValue, currencyCode, display, digitsInfo + get(currency, 'DecimalPlaces', 2) + '-' + get(currency, 'DecimalPlaces', 2), locale);
                })
            );
    }
}
