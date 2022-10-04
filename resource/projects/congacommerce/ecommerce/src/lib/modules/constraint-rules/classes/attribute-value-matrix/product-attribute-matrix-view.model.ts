import { Expose, Type } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
import { AttributeValueMatrix } from '../attribute-value-matrix/attribute-value-matrix.model';
@ATable({
    sobjectName: 'ProductAttributeMatrixView'
})
export class ProductAttributeMatrixView extends AObject {

    @Expose({ name: 'Active' })
    Active: boolean = null;

    @Expose({ name: 'AttributeValueMatrixId' })
    AttributeValueMatrixId: string = null;

    @Expose({ name: 'AttributeValueMatrix' })
    @Type(() => AttributeValueMatrix)
    AttributeValueMatrix: AttributeValueMatrix = null;

    @Expose({ name: 'Columns' })
    Columns: string = null;

    @Expose({ name: 'Hash' })
    Hash: string = null;

    @Expose({ name: 'Keys' })
    Keys: string = null;

    @Expose({ name: 'ProductId' })
    ProductId: string = null;

    @Expose({ name: 'ProductAttributeScope' })
    ProductAttributeScopeId: string = null;
}