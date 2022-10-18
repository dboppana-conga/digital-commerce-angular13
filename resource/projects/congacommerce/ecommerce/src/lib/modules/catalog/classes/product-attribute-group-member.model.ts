import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { ProductAttribute } from './product-attribute.model';
import { AttributeGroup } from './attribute-group.model';
@ATable({
    sobjectName: 'AttributeGroupMember'
})
export class ProductAttributeGroupMember extends AObject {

    @Expose({ name: 'AttributeGroup' })
    @Type(() => AttributeGroup)
    AttributeGroup: AttributeGroup = new AttributeGroup();

    @Expose({ name: 'DisplayType' })
    DisplayType: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'Attribute' })
    @Type(() => ProductAttribute)
    Attribute: ProductAttribute = new ProductAttribute();

    @Expose({ name: 'IsHidden' })
    IsHidden: boolean = null;

    @Expose({ name: 'IsPrimary' })
    IsPrimary: boolean = null;

    @Expose({ name: 'IsReadOnly' })
    IsReadOnly: boolean = null;
}