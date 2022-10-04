import { Expose, Type } from 'class-transformer';
import { AObject, ATable, AField } from '@congacommerce/core';
import { ConstraintRuleCondition } from './constraint-condition.model';
import { ConstraintRuleAction } from './constraint-action.model';
@ATable({
    sobjectName: 'ConstraintRule'
})
export class ConstraintRule extends AObject {


    @Type(() => ConstraintRuleCondition)
    @Expose({ name: 'ConstraintRuleConditions' })
    ConstraintRuleConditions: Array<ConstraintRuleCondition> = [];

    @Type(() => ConstraintRuleAction)
    @Expose({ name: 'ConstraintRuleActions' })
    ConstraintRuleActions: Array<ConstraintRuleAction> = [];

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: Date = null;

    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: Date = null;

    @Expose({ name: 'ConditionAssociation' })
    ConditionAssociation: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'UpdateView' })
    UpdateView: string = null;

    @Expose({ name: 'IsBundleContext' })
    IsBundleContext: boolean = null;

    @Expose({ name: 'IsActive' })
    Active: boolean = null;
}