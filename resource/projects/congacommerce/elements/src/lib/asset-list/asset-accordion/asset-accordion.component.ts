import { Component, OnChanges, Input } from '@angular/core';
import * as _ from 'lodash';
import { AccordionRows } from '../accordion-rows.interface';
/**
 * Asset accordion is used to create the accordion list of assets grouped by product for the asset list component.
 * @ignore
 */
@Component({
  selector: 'apt-asset-accordion',
  templateUrl: './asset-accordion.component.html',
  styleUrls: ['./asset-accordion.component.scss']
})
export class AssetAccordionComponent implements OnChanges {
  /**
   * Two dimensional array of asset line items where the columns are grouped by product.
   */
  assetGroups: Array<Array<AccordionRows>>;
  /**
   * Array of assets to display.
   */
  @Input() assets: Array<AccordionRows>;
  /**
   * Value of the operation type.
   */
  @Input() operation: string;

  ngOnChanges() {
    this.assetGroups = _.values(_.groupBy(this.assets, 'parent.Product.Name'));
  }

}
