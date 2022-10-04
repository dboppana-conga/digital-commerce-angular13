import { Product } from '@congacommerce/ecommerce';
/**
 * Holds information of applied rule action infos
 * and grouped them based on mesaagetype and actionIntent.
 */
export interface ConstraintRuleGroups {
  /**
   * list of Constraint rule of messageType 'error' 
   * and appliedruleaction info pending flag is true
  */
  errors: Array<ConstraintRuleDetail>;
  /**
   * list of Constraint rule of messageType 'warning' 
   * and appliedruleaction info pending flag is true
  */
  warnings: Array<ConstraintRuleDetail>;
  /**
   * list of Constraint rule of messageType 'info' 
   * and appliedruleaction info pending flag is true.
  */
  info: Array<ConstraintRuleInfoDetail>;
  /**
   * list of Constraint rule of action intent 'autoInclue'| 'disableSelection' 
   * and appliedruleaction info pending flag is true.
  */
  success: Array<ConstraintRuleSuccessDetail>;
  /**
   * Total count of the rules.
   */
  totalRules: number;
}
/**
 * Holds information of constraint rule
 *
 */
export interface ConstraintRuleDetail {
  /**
   * list of constraint rule condition products
   */
  triggeringProducts: Array<Product>;
  /**
   * list of constraint rule action items
   */
  actionItems: Array<ActionItem>;
  /**
   * stores the action type of the rule.
   */
  actionType: 'Inclusion' | 'Exclusion' | 'Validation' | 'Recommendation' | 'Replacement';
  /**
   * stores the message of the rule.
   */
  message: string;
  /**
   * stores the formatted message of the rule its optional.
   */
  messageHtml?: string;
   /**
   * Boolean value if the target isOption or not
   */
  isOption: boolean;
   /**
   * stores the target bundle number.
   */
  targetBundleNumber: number;
}
/** 
 * Holds the formatted message of messagetype 'Info'.
 *
 */
export interface ConstraintRuleInfoDetail {
  /**
   * stores the action type of the rule.
   */
  actionType: 'Inclusion' | 'Exclusion' | 'Validation' | 'Recommendation' | 'Replacement';
  /**
   *  Fomatted info message of type string.
   */
  message: string;
}
/** 
 * Holds the formatted message of action intent 'autoInclue'| 'disableSelection'.
 *
 */
export interface ConstraintRuleSuccessDetail {
  /**
   * Formatted success message of type string.
   */
  message: string;
}
/**
 * Holds the constraint rule action details.
 */
export interface ActionItem {
  /**
   * constraint rule action product
   */
  product: Product;
   /**
   * constraint rule action product chargettype
   */
  chargeType: string;
}
