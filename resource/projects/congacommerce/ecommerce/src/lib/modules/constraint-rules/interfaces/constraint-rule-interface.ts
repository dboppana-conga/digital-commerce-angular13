import { Product, ProductOptionComponent } from '../../catalog/classes/index';
/**
 * Holds the details of the constraint rule action 
 * to perfrom the action on the configuration component.
 */
export interface PerformAction {
  /**
   * Detail of action product
   */
  prod: Product;
  /**
   * quantity of the action product.
   */
  quantity?: number;
  /**
   * action intent of action product.
   */
  type: 'Inclusion' | 'Exclusion';
}
/**
 * The type of action to be performed 
 * based on the rule in the configuration component.
 */
export interface ActionToPerform {
  /**
   * List of option product needs to be added to the configuration.
   */
  addOption: Array<Product>;
  /**
   * List of option product needs to be removed from the configuration.
   */
  removeOption: Array<Product>;
  /**
   * List of option product needs to be disabled or hidden in the configuration.
   */
  disableOrHideOption: Array<ProductOptionComponent>;
}
/** @ignore */
export enum ConstraintActionsMode {
  INCLUDEALL = 'Include All',
  INCLUDEANY = 'Include Any',
  INCLUDEMINMAX = 'Include Min/Max',
  EXCLUDEALL = 'Exclude All',
  EXCLUDEAFTERONE = 'Exclude After One',
  EXCLUDEAFTERMAX = 'Exclude After Max'
}
/** @ignore */
export enum ConstraintActionsType {
  INCLUSION = 'Inclusion',
  EXCLUSION = 'Exclusion'
}
/** @ignore */
export enum ConstraintActionsIntent {
  AUTO_INCLUDE = 'Auto Include',
  DISABLE_SELECTION = 'Disable Selection',
  PROMPT = 'Prompt',
  SHOW_MESSAGE = 'Show Message',
  HIDE = 'Hide'
}