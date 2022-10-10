import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'ProductAttributeRule'
})
export class ProductAttributeRule extends AObject {

    @Expose({ name: 'AccountScope' })
    AccountScope: string | null= null;

    @Expose({ name: 'AccountScopeOper' })
    AccountScopeOper: string | null= null;

    @Expose({ name: 'IsActive' })
    IsActive: boolean = false;

    @Expose({ name: 'ConditionCriteria' })
    ConditionCriteria: string | null= null;

    @Expose({ name: 'ConditionCriteriaExpression' })
    ConditionCriteriaExpression: string | null = null;

    @Expose({ name: 'Description' })
    Description: string | null= null;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: Date | null= null;

    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: Date | null= null;

    @Expose({ name: 'ProductFamilyScope' })
    ProductFamilyScope: string | null= null;

    @Expose({ name: 'ProductFamilyScopeOper' })
    ProductFamilyScopeOper: string | null= null;

    @Expose({ name: 'ProductGroupScope' })
    ProductGroupScope: string | null= null;

    @Expose({ name: 'ProductGroupScopeOper' })
    ProductGroupScopeOper: string | null= null;

    @Expose({ name: 'ProductScope' })
    ProductScope: string | null= null;

    @Expose({ name: 'ProductScopeOper' })
    ProductScopeOper: string | null= null;

    @Expose({ name: 'ProductAttributeRuleActions' })
    @Type(() => ProductAttributeRuleAction)
    ProductAttributeRuleActions: Array<ProductAttributeRuleAction> | null= null;
}

@ATable({
    sobjectName: 'ProductAttributeRuleView'
})
export class ProductAttributeRuleView extends AObject {

    @Expose({ name: 'ProductAttributeRuleId' })
    ProductAttributeRuleId: string | null= null;

    @Expose({ name: 'ProductAttributeRule' })
    @Type(() => ProductAttributeRule)
    ProductAttributeRule: ProductAttributeRule | null= null;
}

@ATable({
    sobjectName: 'ProductAttributeRuleAction'
})
export class ProductAttributeRuleAction extends AObject {

    @Expose({ name: 'AccountScope' })
    AccountScope: string | null= null;

    @Expose({ name: 'AccountScopeOper' })
    AccountScopeOper: string | null= null;

    @Expose({ name: 'Action' })
    Action: string | null= null;

    @Expose({ name: 'ActionCriteria' })
    ActionCriteria: string | null= null;

    @Expose({ name: 'ActionCriteriaExpression' })
    ActionCriteriaExpression: string | null= null;

    @Expose({ name: 'Message' })
    Message: string | null= null;

    @Expose({ name: 'ProductAttributeRuleId' })
    ProductAttributeRuleId: string | null= null;

    @Expose({ name: 'ProductFamilyScope' })
    ProductFamilyScope: string | null= null;

    @Expose({ name: 'ProductGroupScope' })
    ProductGroupScope: string | null= null;

    @Expose({ name: 'ProductGroupScopeOper' })
    ProductGroupScopeOper: string | null= null;

    @Expose({ name: 'ProductScope' })
    ProductScope: string | null= null;

    @Expose({ name: 'ProductScopeOper' })
    ProductScopeOper: string | null= null;

    @Expose({ name: 'Field' })
    Field: string | null= null;
    get FieldVal(): string {
        return (this.Field) ? this.Field.substring(this.Field.indexOf('.') + 1) : '';
    }

    @Expose({ name: 'ValueExpression' })
    ValueExpression: string | null= null;
    get Values(): Array<string> {
        return (this.ValueExpression && this.ValueExpression.length > 0) ? this.ValueExpression.replace(/'/g, '').split(';') : [];
    }
}