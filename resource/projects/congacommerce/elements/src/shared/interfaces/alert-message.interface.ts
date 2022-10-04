import { AppliedRuleActionInfo, ConstraintRuleCondition } from '@congacommerce/ecommerce';

/** @ignore */
export interface AlertMessage {
  type: 'primary' | 'warning' | 'danger' | 'success';
  actions: Array<AppliedRuleActionInfo>;
  conditions?: Array<ConstraintRuleCondition>;
  icon: 'oi-info' | 'text-danger' | 'text-warning';
  hideStatus?: 'hiding' | 'hidden';
  open?: boolean;
  title: string;
}