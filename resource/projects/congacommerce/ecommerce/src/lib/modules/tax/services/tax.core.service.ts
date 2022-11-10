import { Injectable } from '@angular/core';
import { AObjectService, ACondition, ApiService, ConfigurationService } from '@congacommerce/core';
import { of, Observable } from 'rxjs';
import { take, mergeMap, flatMap, tap } from 'rxjs/operators';
import { TaxBreakup } from '../classes/tax-breakup.model';
import { ProposalTaxBreakup } from '../classes/proposal-tax-breakup.model';
import { OrderTaxBreakup } from '../classes/order-tax-breakup.model';
import { Cart } from '../../cart/classes/cart.model';
import { CartService } from '../../cart/services/cart.service';

/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})

export class TaxServiceCore extends AObjectService {
    type = TaxBreakup;
    protected cartService: CartService = this.injector.get(CartService);
    protected apiService: ApiService = this.injector.get(ApiService);
    private configService: ConfigurationService = this.injector.get(ConfigurationService);

    computeTaxForCart(): Observable<any> {
        /* TO DO : */
        return of(null);
        // return this.cartService.getMyCart().pipe(take(1), mergeMap(
        //     (cart: Cart) => {
        //         if (cart.Id) {
        //             return this.apiService.post(`/carts/${cart.Id}/tax?mode=${this.configService.get('pricingMode')}`).pipe(
        //                 tap(() => this.cartService.priceCart())
        //             );
        //         } else {
        //             return of(null);
        //         }
        //     }));
    }

    getTaxBreakupForLineItem(lineItemId: string): Observable<Array<TaxBreakup>> {
        /* TO DO : */
        return of(null);
        // return this.where([new ACondition(this.type, 'LineItemId', 'Equal', lineItemId)], 'AND', null, null, null);
    }

    getTaxBreakUpsForConfiguration(...args): Observable<Array<TaxBreakup>> {
        /* TO DO : */
        return of(null);
        // return this.cartService.getMyCart().pipe(
        //     flatMap((cartData: Cart) => {
        //         return this.query({
        //             conditions: [
        //                 new ACondition(this.type, 'LineItem.LineType', 'Equal', 'Misc'),
        //                 new ACondition(this.type, 'LineItem.ConfigurationId', 'Equal', cartData.Id),
        //                 new ACondition(this.type, 'BreakupType', 'NotEqual', 'Total')
        //             ], skipCache: true
        //         });
        //     })
        // );
    }
}

/**
 * @ignore
 */
@Injectable()
export class ProposalTaxBreakupService extends AObjectService {
    type = ProposalTaxBreakup;
    getTaxBreakupForQuote(quoteId: string): Observable<Array<ProposalTaxBreakup>> {
        /* TO DO : */
        return of(null);
        // return this.query({
        //     conditions: [
        //         new ACondition(this.type, 'LineItem.Proposal', 'Equal', quoteId),
        //         new ACondition(this.type, 'LineItem.LineType', 'Equal', 'Misc')
        //     ]
        // });
    }
}

/**
 * @ignore
 */
@Injectable()
export class OrderTaxBreakupService extends AObjectService {
    type = OrderTaxBreakup;
    getTaxBreakupForOrder(orderId: string): Observable<Array<OrderTaxBreakup>> {
        /* TO DO : */
        return of(null);
        // return this.query({
        //     conditions: [
        //         new ACondition(this.type, 'OrderLineItem.OrderId', 'Equal', orderId),
        //         new ACondition(this.type, 'OrderLineItem.LineType', 'Equal', 'Misc')
        //     ]
        // });
    }
}