import { Expose, Type } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
import { ConstraintRuleAction } from './constraint-action.model';
import { AppliedRuleInfo } from './applied-rule-info.model';
import { Cart } from '../../../cart/classes/cart.model';
@ATable({
    sobjectName: 'AppliedRuleActionInfo'
})
export class AppliedRuleActionInfo extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ActionProductIds' })
    ActionProductIds: string = null;

    @Expose({ name: 'AffectedPrimaryNumbers' })
    AffectedPrimaryNumbers: string = null;

    @Expose({ name: 'AffectedProductIds' })
    AffectedProductIds: string = null;

    @Expose({ name: 'AllowedMax' })
    AllowedMax: number = null;

    @Expose({ name: 'AppliedRuleInfo' })
    @Type(() => AppliedRuleInfo)
    AppliedRuleInfo: AppliedRuleInfo = new AppliedRuleInfo();

    @Expose({ name: 'AutoExecuted' })
    AutoExecuted: boolean = null;

    @Expose({ name: 'Configuration' })
    @Type(() => Cart)
    Configuration: Cart = new Cart();

    @Type(() => ConstraintRuleAction)
    @Expose({ name: 'ConstraintRuleAction' })
    ConstraintRuleAction: ConstraintRuleAction = null;

    @Expose({ name: 'CriteriaFields' })
    CriteriaFields: string = null;

    @Expose({ name: 'HideMessage' })
    HideMessage: boolean = null;

    @Expose({ name: 'Ignored' })
    Ignored: boolean = null;

    @Expose({ name: 'IsPrompt' })
    IsPrompt: boolean = null;

    @Expose({ name: 'IsTargetOption' })
    IsTargetOption: boolean = null;

    @Expose({ name: 'IsTargetPrimaryLine' })
    IsTargetPrimaryLine: boolean = null;

    @Expose({ name: 'Message' })
    Message: string = null;

    @Expose({ name: 'MessageType' })
    MessageType: 'Error' | 'Warning' | 'Info' = null;

    @Expose({ name: 'Pending' })
    Pending: boolean = null;

    @Expose({ name: 'RequiredMin' })
    RequiredMin: number = null;

    @Expose({ name: 'SuggestedProductIds' })
    SuggestedProductIds: string = null;

    @Expose({ name: 'TargetBundleNumber' })
    TargetBundleNumber: number = null;

    @Expose({ name: 'TriggeringPrimaryNumbers' })
    TriggeringPrimaryNumbers: string = null;

    @Expose({ name: 'TriggeringProductIds' })
    TriggeringProductIds: string = null;
}