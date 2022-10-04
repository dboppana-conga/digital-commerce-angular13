import { Product, CartItem, AppliedRuleActionInfo } from '@congacommerce/ecommerce';

/** This interface gives info about the current configuration state in product detail page. */
export interface ConfigurationState {

    /** Instance of product. */
    product?: Product;

    /** Instance of cart item list representing an array of line items. */
    itemList?: Array<CartItem>;

    /** The flag represents any unsaved bundle configurations in product detail page.*/
    configurationChanged?: boolean;

    /** The flag which says Configuration is Pending when storefront is set to embedded mode */
    hasErrors?: boolean;

    /** Applied rule action info of the secondary cart. */
    ruleActions?: Array<AppliedRuleActionInfo>;

    /** NetPrice of the  Bundle Product */
    netPrice?: number;
}