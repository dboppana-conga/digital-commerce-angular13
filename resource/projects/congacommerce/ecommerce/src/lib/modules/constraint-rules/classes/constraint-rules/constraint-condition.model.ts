import { Expose, Type } from 'class-transformer';
import { AObject, ATable, AField } from '@congacommerce/core';
import { Product } from '../../../catalog/classes/product.model';
import { ConstraintRule } from '../constraint-rules/constraint-rule.model';
import { ProductGroup, ProductOptionGroup } from '../../../catalog';
@ATable({
    sobjectName: 'ConstraintRuleCondition'
})
export class ConstraintRuleCondition extends AObject {

    @Expose({ name: 'ConditionCriteria' })
    ConditionCriteria: string = null;

    @Expose({ name: 'ConstraintRule' })
    @Type(() => ConstraintRule)
    ConstraintRule: ConstraintRule = null;

    @Expose({ name: 'EditCriteria' })
    EditCriteria: string = null;

    @Expose({ name: 'MatchInAsset' })
    MatchInAsset: boolean = null;

    @Expose({ name: 'MatchInCartOptions' })
    MatchInCartOptions: boolean = null;

    @Expose({ name: 'MatchInLocation' })
    MatchInLocation: boolean = null;

    @Expose({ name: 'MatchInOptions' })
    MatchInOptions: boolean = null;

    @Expose({ name: 'MatchInPrimaryLines' })
    MatchInPrimaryLines: boolean = null;

    @Expose({ name: 'MatchMaxProducts' })
    MatchMaxProducts: number = null;

    @Expose({ name: 'MatchMinProducts' })
    MatchMinProducts: number = null;

    @Expose({ name: 'MatchRule' })
    MatchRule: string = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;

    @Expose({ name: 'ProductCategory' })
    ProductCategory: string = null;

    @Expose({ name: 'ProductFamily' })
    ProductFamily: string = null;

    @Expose({ name: 'ProductGroup' })
    @Type(() => ProductGroup)
    ProductGroup: ProductGroup = new ProductGroup();

    @Expose({ name: 'ProductOptionGroup' })
    @Type(() => ProductOptionGroup)
    ProductOptionGroup: ProductOptionGroup = new ProductOptionGroup();

    @Expose({ name: 'ProductScope' })
    ProductScope: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;
}