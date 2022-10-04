/** @ignore */
export interface AttributeRuleResult {
    field: string;
    isConstraintAction: boolean;
    isDefaultAction: boolean;
    isHiddenAction: boolean;
    isReadOnlyAction: boolean;
    isRequiredAction: boolean;
    isReset: boolean;
    values: Array<string>;
    sfDefaultValue: string;
    defaultValue: string;
    resetValues: Array<string>;
}