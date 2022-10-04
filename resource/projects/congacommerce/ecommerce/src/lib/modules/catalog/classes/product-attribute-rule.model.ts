import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'ProductAttributeRule'
})
export class ProductAttributeRule extends AObject {

    @Expose({ name: 'AccountScope' })
    AccountScope: string = null;

    @Expose({ name: 'AccountScopeOper' })
    AccountScopeOper: string = null;

    @Expose({ name: 'IsActive' })
    IsActive: boolean = null;

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

    @Expose({ name: 'ProductAttributeRuleActions' })
    @Type(() => ProductAttributeRuleAction)
    ProductAttributeRuleActions: Array<ProductAttributeRuleAction> = null;
}

@ATable({
    sobjectName: 'ProductAttributeRuleView'
})
export class ProductAttributeRuleView extends AObject {

    @Expose({ name: 'ProductAttributeRuleId' })
    ProductAttributeRuleId: string;

    @Expose({ name: 'ProductAttributeRule' })
    @Type(() => ProductAttributeRule)
    ProductAttributeRule: ProductAttributeRule = null;
}

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
    get FieldVal(): string {
        return (this.Field) ? this.Field.substring(this.Field.indexOf('.') + 1) : '';
    }

    @Expose({ name: 'ValueExpression' })
    ValueExpression: string = null;
    get Values(): Array<string> {
        return (this.ValueExpression && this.ValueExpression.length > 0) ? this.ValueExpression.replace(/'/g, '').split(';') : [];
    }
}