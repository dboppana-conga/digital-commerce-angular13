import { Expose } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
@ATable({
    sobjectName: 'ProductAttributeRuleAction'
})
export class ProductAttributeRuleAction extends AObject {

    @Expose({ name: 'AccountScope' })
    AccountScope: string = null;

    @Expose({ name: 'AccountScopeOper' })
    AccountScopeOper: string = null;

    @Expose({ name: 'Action' })
    Action: string = null;

    @Expose({ name: 'ActionCriteria' })
    ActionCriteria: string = null;

    @Expose({ name: 'ActionCriteriaExpression' })
    ActionCriteriaExpression: string = null;

    @Expose({ name: 'Message' })
    Message: string = null;

    @Expose({ name: 'ProductAttributeRuleId' })
    ProductAttributeRuleId: string = null;

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

    @Expose({ name: 'Field' })
    Field: string = null;

    @Expose({ name: 'ValueExpression' })
    ValueExpression: string = null;
}