import { Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'AssetAttributeValue'
})
export class AssetAttributeValue extends AObject {

    @Expose({ name: 'AssetLineItemId' })
    LineItemId: string | null = null;
}