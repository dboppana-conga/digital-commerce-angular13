import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Product } from '../../../catalog/classes/product.model';
import { ProductGroup } from '../../../catalog/classes/product-group.model';
import { ConstraintRule } from './constraint-rule.model';
@ATable({
    sobjectName: 'ConstraintRuleAction'
})
export class ConstraintRuleAction extends AObject {

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product;

    @Expose({ name: 'ActionType' })
    ActionType: 'Inclusion' | 'Exclusion' | 'Validation' | 'Recommendation' | 'Replacement' = null;

    @Expose({ name: 'AutoInclude' })
    AutoInclude: boolean = null;

    @Expose({ name: 'ConstraintRule' })
    @Type(() => ConstraintRule)
    ConstraintRule: ConstraintRule = new ConstraintRule();

    @Expose({ name: 'EditCriteria' })
    EditCriteria: string = null;

    @Expose({ name: 'AutoExclude' })
    AutoExclude: boolean = null;

    @Expose({ name: 'MatchInAsset' })
    MatchInAsset: boolean = null;

    @Expose({ name: 'MatchInCartOptions' })
    MatchInCartOptions: boolean = null;

    @Expose({ name: 'MatchInOptions' })
    MatchInOptions: boolean = null;

    @Expose({ name: 'MatchInPrimaryLines' })
    MatchInPrimaryLines: boolean = null;

    @Expose({ name: 'IncludeMaxProducts' })
    IncludeMaxProducts: number = null;

    @Expose({ name: 'Message' })
    Message: string = null;

    @Expose({ name: 'IncludeMatchRule' })
    IncludeMatchRule: string = null;

    @Expose({ name: 'IncludeMinProducts' })
    IncludeMinProducts: number = null;

    @Expose({ name: 'ProductCategory' })
    ProductCategory: string = null;

    @Expose({ name: 'ProductFamily' })
    ProductFamily: string = null;

    @Expose({ name: 'ProductGroup' })
    @Type(() => ProductGroup)
    ProductGroup: ProductGroup = new ProductGroup();

    @Expose({ name: 'ProductScope' })
    ProductScope: string = null;

    @Expose({ name: 'RepeatInclusion' })
    RepeatInclusion: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'ActionIntent' })
    ActionIntent: 'Auto Include' | 'Prompt' | 'Show Message' | 'Check on Finalization' | 'Disable Selection' | 'Hide' = null;

    @Expose({ name: 'ActionDisposition' })
    ActionDisposition: string = null;
}