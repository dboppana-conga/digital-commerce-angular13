import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';
import { Observable, of } from 'rxjs';
import { Incentive } from '../classes';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * Promotion Service defines a way to add/remove promotions to/from the cart.
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})

export class IncentiveService extends AObjectService {
  type = Incentive;

  getIncentiveById(Incentives: Array<String>): Observable<Array<Incentive>> {
    // TODO: Replace with RLP API
    // return this.query({
    //   conditions: [new ACondition(Incentive, 'Id', 'In', this.type)]
    // });
    return of(null);
  }
}