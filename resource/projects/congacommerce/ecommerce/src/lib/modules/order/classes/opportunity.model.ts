import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'Opportunity'
})
export class Opportunity extends AObject {

    @Expose({
        name : 'Name'
    })
    Name: string = null;

}