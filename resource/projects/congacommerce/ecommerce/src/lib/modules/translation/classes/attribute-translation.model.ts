import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';
import { ProductAttributeGroup } from '../../catalog/classes/product-attribute-group.model';

@ATable({
    sobjectName: 'AttributeGroupTranslation'
})
export class AttributeGroupTranslation extends AObject {
    @Expose({ name: 'Language' })
    Language: string = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ProductAttributeGroup' })
    ProductAttributeGroup: ProductAttributeGroup = null;
}