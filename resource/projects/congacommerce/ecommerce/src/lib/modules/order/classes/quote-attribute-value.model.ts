import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'ProposalProductAttributeValue',
    dynamic: true
})
export class QuoteAttributeValue extends AObject {
    @Expose({
        name: 'LineItemId'
    })
    LineItemId: string = null;
}