import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'Incentive'
})
export class Incentive extends AObject {


    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: Date = null;


    @Expose({ name: 'IncentiveCode' })
    IncentiveCode: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'AutoApply' })
    AutoApply: string = null;
}
