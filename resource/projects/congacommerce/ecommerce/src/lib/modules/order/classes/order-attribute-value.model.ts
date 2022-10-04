import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'OrderProductAttributeValue',
    dynamic: true
})
export class OrderAttributeValue extends AObject {
    @Expose({
        name: 'LineItemId'
    })
    LineItemId: string = null;
}