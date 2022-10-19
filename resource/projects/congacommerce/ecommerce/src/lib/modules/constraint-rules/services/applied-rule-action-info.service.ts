import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, take, switchMap, filter } from 'rxjs/operators';
import { AObjectService, ConfigurationService } from '@congacommerce/core';
import { isNil, get, isEmpty, concat } from 'lodash';
import { Cart } from '../../cart/classes/cart.model';
import { AppliedRuleActionInfo, AppliedRuleInfo } from '../classes/index';
import { CartService } from '../../cart/services';
/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class AppliedRuleInfoService extends AObjectService {
    type = AppliedRuleInfo;
}

/**
 * @ignore
 * Constraint rules are a powerful feature when configuring products. They allow you to include, excludes, recommend, validate and replace products based on business logic.
 */
@Injectable({
    providedIn: 'root'
})
export class AppliedRuleActionInfoService extends AObjectService {
    type = AppliedRuleActionInfo;

    appliedRuleActionSubject: BehaviorSubject<Array<AppliedRuleActionInfo>> = new BehaviorSubject<Array<AppliedRuleActionInfo>>([]);
    private cartService: CartService = this.injector.get(CartService);
    private configService: ConfigurationService = this.injector.get(ConfigurationService);

    private state: BehaviorSubject<Array<AppliedRuleActionInfo>> = new BehaviorSubject<Array<AppliedRuleActionInfo>>(null);

    onInit() {
        /* TO DO : */
        // if (this.configService.get('skipRules')) {
        //     this.state.next(null);
        // }
        // else {
        //     this.cartService.getMyCart()
        //         .pipe(
        //             filter(cart => cart && !cart.IsPricePending),
        //             switchMap(cart => {
        //                 if (isNil(get(cart, 'LineItems')) || isEmpty(get(cart, 'LineItems')))
        //                     return of(null);
        //                 const cartId: string = !isNil(cart) && !isNil(get(cart, 'Id')) ? cart.Id : 'active';
        //                 return of(null);
        //             })
        //         ).subscribe(rules => {
        //             this.state.next(rules);
        //         });
        // }
    }

    /**
     * Method retrieves the actions that are taken on a cart when the constraint rules are applied
     * @param cart The cart to retrieve constraint rules for. If left blank, will use the current cart.
     * @returns An observable array of AppliedRuleActionInfo
     */
    getAppliedActionsForCart(cart?: Cart): Observable<Array<AppliedRuleActionInfo>> {
        /* TO DO : */
        return of(null);
        // return this.state;
    }
    /**
     * Deletes constraint rules for the given cart.
     * @param cart The cart on which to delete constraint rules. If left blank, will use the current cart.
     */
    deleteRulesForCart(cart?: Cart): Observable<any> {
        /* TO DO : */
        return of(null);
        // const obsv = (cart) ? of(cart) : this.cartService.getMyCart();
        // return obsv.pipe(take(1), switchMap(c =>
        //     this.delete(concat(get(c, 'AppliedRuleActionInfo'), get(c, 'AppliedRuleInfo')), false)
        // ),
        //     catchError(e => {
        //         console.log(e);
        //         return e;
        //     }));
    }
}