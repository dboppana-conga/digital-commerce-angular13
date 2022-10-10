import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { AttributeGroup } from './attribute-group.model';
import { Product } from './product.model';
@ATable({
    sobjectName: 'ProductAttributeGroup'
})
export class ProductAttributeGroup extends AObject {

    @Expose({ name: 'Name' })
    Name: string | null= null;

    @Expose({ name: 'AttributeGroup' })
    @Type(() => AttributeGroup)
    AttributeGroup: Array<AttributeGroup> | null= null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Array<Product> | null= null;

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;
    
    @Expose({ name: 'FieldUpdateCriteriaIds' })
    FieldUpdateCriteriaIds: number | null= null;
}