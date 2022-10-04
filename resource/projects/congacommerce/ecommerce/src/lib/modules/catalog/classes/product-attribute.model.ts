import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { ProductAttributeGroup } from './product-attribute-group.model';
@ATable({
    sobjectName: 'Attribute'
})
export class ProductAttribute extends AObject {

    @Expose({ name: 'AttributeGroup' })
    @Type(() => ProductAttributeGroup)
    AttributeGroup: ProductAttributeGroup = null;

    @Expose({ name: 'IsRequired' })
    IsRequired: boolean = null;

    @Expose({ name: 'Name' })
    Field: string = null;
   

    @Expose({ name: 'LookupObjectName' })
    LookupObjectName: string = null;

    @Expose({ name: 'PickListValue' })
    PickListValue: string = null;


    @Expose({ name: 'DefaultValue' })
    DefaultValue: string = null;

    @Expose({ name: 'Type' })
    Type: string = null;

    @Expose({ name: 'DisplayName' })
    DisplayName: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;
}