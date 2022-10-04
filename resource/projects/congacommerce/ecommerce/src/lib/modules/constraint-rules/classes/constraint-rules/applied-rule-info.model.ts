import { Expose, Type } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
import { Cart } from '../../../cart/classes/cart.model';
import { ConstraintRule } from './constraint-rule.model';
@ATable({
    sobjectName: 'AppliedRuleInfo'
})
export class AppliedRuleInfo extends AObject {

    @Expose({ name: 'Configuration' })
    @Type(() => Cart)
    Configuration: Cart = new Cart();

    @Expose({ name: 'ConstraintRule' })
    @Type(() => ConstraintRule)
    ConstraintRule: ConstraintRule = new ConstraintRule();

    @Expose({ name: 'CriteriaFields' })
    CriteriaFields: string = null;

    @Expose({ name: 'HasCriteriaInCondition' })
    HasCriteriaInCondition: boolean = null;

    @Expose({ name: 'Invalid' })
    Invalid: boolean = null;

    @Expose({ name: 'IsSourceLineRequired' })
    IsSourceLineRequired: boolean = null;

    @Expose({ name: 'MatchInLocation' })
    MatchInLocation: boolean = null;

    @Expose({ name: 'NeedProcessing' })
    NeedProcessing: boolean = null;

    @Expose({ name: 'PrimaryLineNumber' })
    PrimaryLineNumber: number = null;

    @Expose({ name: 'SourceLineNumber' })
    SourceLineNumber: number = null;

    @Expose({ name: 'WasFinalized' })
    WasFinalized: boolean = null;
}