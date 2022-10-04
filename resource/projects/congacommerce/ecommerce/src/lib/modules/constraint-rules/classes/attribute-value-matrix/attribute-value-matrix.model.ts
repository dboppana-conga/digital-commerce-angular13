import { Expose } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
@ATable({
    sobjectName: 'AttributeValueMatrix'
})
export class AttributeValueMatrix extends AObject {

    @Expose({ name: 'AccountScope' })
    AccountScope: string = null;

    @Expose({ name: 'AccountScopeOper' })
    AccountScopeOper: string = null;

    @Expose({ name: 'Active' })
    Active: boolean = null;

    @Expose({ name: 'ApplicationType' })
    ApplicationType: string = null;

    @Expose({ name: 'DefaultProductAttributeScopeId' })
    DefaultProductAttributeScopeId: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: Date = null;

    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: Date = null;

    @Expose({ name: 'ProductFamilyScope' })
    ProductFamilyScope: string = null;

    @Expose({ name: 'ProductFamilyScopeOper' })
    ProductFamilyScopeOper: string = null;

    @Expose({ name: 'ProductGroupScope' })
    ProductGroupScope: string = null;

    @Expose({ name: 'ProductGroupScopeOper' })
    ProductGroupScopeOper: string = null;

    @Expose({ name: 'ProductScope' })
    ProductScope: string = null;

    @Expose({ name: 'ProductScopeOper' })
    ProductScopeOper: string = null;

    @Expose({ name: 'TreatNullAsWildcard' })
    TreatNullAsWildcard: boolean = null;
}

@ATable({
    sobjectName: 'AttributeValueMatrixEntry'
})
export class AttributeValueMatrixEntry extends AObject {

    @Expose({ name: 'AttributeValueMatrixId' })
    AttributeValueMatrixId: string = null;

    @Expose({ name: 'Color' })
    Color: string = null;

    @Expose({ name: 'Vendor' })
    Vendor: string = null;
}