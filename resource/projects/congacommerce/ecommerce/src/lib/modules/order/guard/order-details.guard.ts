import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ApiService } from '@congacommerce/core';

/**
 * @ignore
 */
@Injectable()
export class OrderDetailsGuard implements CanActivate {

    constructor(private router: Router, private orderService: OrderService, private apiService: ApiService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const orderId = _.split(_.get(state, 'url'), '/').pop();
        return this.apiService.get(`/orders?condition[0]=Id,Equal,${orderId}`)
            .pipe(
                map(orderList => {
                    return !_.isEmpty(orderList);
                }),
                tap(canActivate => {
                    if (!canActivate)
                        this.router.navigate(['/login', orderId]);
                })
            );
    }
}