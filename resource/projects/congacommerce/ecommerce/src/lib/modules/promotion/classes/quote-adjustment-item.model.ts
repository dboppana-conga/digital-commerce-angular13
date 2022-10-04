
import { AObject, ATable } from '@congacommerce/core';
import { Incentive } from './incentive.model';
import { Expose, Type } from 'class-transformer';
import { QuoteLineItem } from '../../order/classes/quote-line-item.model';

@ATable({
    sobjectName: 'ProposalAdjustmentLineItem'
})
export class QuoteAdjustmentItem extends AObject {

    @Expose({
        name: 'IncentiveAdjustmentAmount'
    })
    IncentiveAdjustmentAmount: string = null;

    @Expose({
        name: 'AdjustmentAmount'
    })
    AdjustmentAmount: number = null;
    @Expose({
        name: 'IncentiveId'
    })
    IncentiveId: string = null;
    @Expose({
        name: 'IncentiveId'
    })
    @Type(() => Incentive)
    Incentive: Incentive = new Incentive();
    @Expose({
        name: 'IncentiveCode'
    })
    IncentiveCode: string = null;
    @Expose({
        name: 'LineItemId'
    })
    LineItemId: string = null;
    @Expose({
        name: 'Type'
    })
    Type: string = null;
}
