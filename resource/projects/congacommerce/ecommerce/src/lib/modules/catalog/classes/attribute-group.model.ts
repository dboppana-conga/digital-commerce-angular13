 import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { ProductAttributeMatrixView } from '../../constraint-rules/classes/attribute-value-matrix/product-attribute-matrix-view.model';
@ATable({
    sobjectName: 'AttributeGroup'
})
export class AttributeGroup extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'TwoColumnAttributeDisplay' })
    TwoColumnAttributeDisplay: boolean = null;

    @Expose({ name: 'ThreeColumnAttributeDisplay' })
    ThreeColumnAttributeDisplay: boolean = null;

    @Expose({ name: 'AttributeMatrix' })
    @Type(() => ProductAttributeMatrixView)
    ProductAttributeMatrixes: Array<ProductAttributeMatrixView> = null;
}