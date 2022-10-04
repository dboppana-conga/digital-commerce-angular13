import { Type, Expose } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
import { ProductAttributeRuleAction } from './product-attribute-rule-action.model';
@ATable({
    sobjectName: 'ProductAttributeRule'
})
export class ProductAttributeRule extends AObject {

    @Expose({ name: 'ProductAttributeRuleActions' })
    @Type(() => ProductAttributeRuleAction)
    ProductAttributeRuleAction: Array<ProductAttributeRuleAction> = [];

    @Expose({ name: 'AccountScope' })
    AccountScope: string = null;

    @Expose({ name: 'AccountScopeOper' })
    AccountScopeOper: string = null;

    @Expose({ name: 'Active' })
    Active: boolean = null;

    @Expose({ name: 'ConditionCriteria' })
    ConditionCriteria: string = null;

    @Expose({ name: 'ConditionCriteriaExpression' })
    ConditionCriteriaExpression: string = null;

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
}

@ATable({
    sobjectName: 'ProductAttributeRuleView'
})
export class ProductAttributeRuleView extends AObject {

    @Expose({ name: 'Active' })
    Active: boolean = null;

    @Expose({ name: 'ProductId' })
    ProductId: string = null;

    @Expose({ name: 'ProductAttributeRuleId' })
    ProductAttributeRuleId: string = null;
}