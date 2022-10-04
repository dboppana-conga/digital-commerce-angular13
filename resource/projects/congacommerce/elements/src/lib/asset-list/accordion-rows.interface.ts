import { AssetLineItemExtended } from '@congacommerce/ecommerce';

/**
 * Special type for passing parent child groupings to the AssetListComponent's 'pageAssets' input.
 */
export interface AccordionRows {
  /**
   * The parent asset will be the main line item shown in the table.
   */
  parent: AssetLineItemExtended;
  /**
   * Array of child asset line items that are related to the parent to be shown in a collapsable accordion beneath the parent asset.
   */
  children: Array<AssetLineItemExtended>;
}
