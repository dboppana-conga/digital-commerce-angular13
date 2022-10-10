 import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { ProductAttributeMatrixView } from '../../constraint-rules/classes/attribute-value-matrix/product-attribute-matrix-view.model';
@ATable({
    sobjectName: 'AttributeGroup'
})
export class AttributeGroup extends AObject {

    @Expose({ name: 'Name' })
    Name: string| null = null;

    @Expose({ name: 'Description' })
    Description: string | null = null;

    @Expose({ name: 'TwoColumnAttributeDisplay' })
    TwoColumnAttributeDisplay: boolean = false;

    @Expose({ name: 'ThreeColumnAttributeDisplay' })
    ThreeColumnAttributeDisplay: boolean = false;

    @Expose({ name: 'AttributeMatrix' })
    @Type(() => ProductAttributeMatrixView)
    ProductAttributeMatrixes: Array<ProductAttributeMatrixView> | null = null;
}