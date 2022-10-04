import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AObjectService } from '@congacommerce/core';
import { PriceRule } from '../classes/index';
import { PriceListService } from './price-list.service';

/**
 * Stubbed service for Apttus price rules. Currently has no supporting methods.
 * @ignore
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class PriceRuleService extends AObjectService {
    type = PriceRule;

    private priceListService: PriceListService = this.injector.get(PriceListService);

    getPriceRules(): Observable<Array<PriceRule>> {
        // return this.priceListService.getPriceListId().pipe(
        //     mergeMap(priceListId => this.where(
        //         [
        //             new ACondition(this.type, 'Ruleset.PriceListId', 'Equal', priceListId)
        //         ],
        //         'AND',
        //         [
        //             new AFilter(this.type, [
        //                 new ACondition(this.type, 'Ruleset.EffectiveDate', 'Null', null),
        //                 new ACondition(this.type, 'Ruleset.EffectiveDate', 'LessEqual', 'Today')
        //             ], null, 'OR'),
        //             new AFilter(this.type, [
        //                 new ACondition(this.type, 'Ruleset.ExpirationDate', 'Null', null),
        //                 new ACondition(this.type, 'Ruleset.ExpirationDate', 'GreaterThan', 'Today')
        //             ], null, 'OR')
        //         ],
        //         [
        //             new ASort(this.type, 'Ruleset.Sequence', 'ASC'),
        //             new ASort(this.type, 'Sequence', 'ASC')
        //         ]
        //     )));
        return null;
    }
}