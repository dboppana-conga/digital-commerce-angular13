
import { AObject, ATable } from '@congacommerce/core';
import { Incentive } from './incentive.model';
import { Expose, Type } from 'class-transformer';
import { CartItem } from '../../cart/classes/cart-item.model';

@ATable({
    sobjectName: 'AdjustmentLineItem'
})
export class AdjustmentItem extends AObject {


    @Expose({ name: 'IncentiveAdjustmentAmount' })
    IncentiveAdjustmentAmount: string = null;


    @Expose({ name: 'AdjustmentAmount' })
    AdjustmentAmount: number = null;


    @Expose({ name: 'Incentive' })
    @Type(() => Incentive)
    Incentive: Incentive = null;

    @Expose({ name: 'IncentiveCode' })
    IncentiveCode: string = null;


    @Expose({ name: 'LineItem' })
    @Type(() => CartItem)
    LineItem: CartItem = null;

    @Expose({ name: 'Type' })
    Type: string = null;

    @Expose({ name: 'LineType' })
    LineType: string = null;
}
