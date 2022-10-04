import { Component, OnInit, Input } from '@angular/core';
import { AssetSelectionService } from '../../../shared/services/index';
import { AccordionRows } from '../accordion-rows.interface';
import * as _ from 'lodash';
/**
 * Asset accordion group is used to create each group in the asset accordion component.
 * @ignore
 */
@Component({
  selector: 'apt-asset-accordion-group',
  templateUrl: './asset-accordion-group.component.html',
  styleUrls: ['./asset-accordion-group.component.scss']
})
export class AssetAccordionGroupComponent implements OnInit {
  /**
   * The index of this group within the entire list of groups.
   */
  @Input() index: number;
  /**
   * Array of asset line items to display for this group.
   */
  @Input() group: Array<AccordionRows>;
  /**
   * Value of the operation type.
   */
  @Input() operation: string;
  /**
   * Model value for the checkbox for the entire group.
   */
  checkState: boolean = false;
  /**
   * Flag to indicate that all children in this group have been checked. If true will check the main checkbox.
   */
  checkAll: boolean = false;

  constructor(private assetSelectionService: AssetSelectionService) {}

  ngOnInit() {
    this.checkState = this.checkIfAllSelected();
  }
  /**
   * Event handler for when the main checkbox is changed.
   * @param event Event object that was fired.
   */
  handleCheckbox(event: any) {
    if (this.checkAll === this.checkState) this.checkAll = !this.checkState;
    setTimeout(() => {
      this.checkAll = this.checkState;
      this.group.forEach(asset => {
        if (this.checkState) {
          this.assetSelectionService.addAssetToSelection(asset.parent);
        }
        else {
          this.assetSelectionService.removeAssetFromSelection(asset.parent);
        }
      });
    });
  }
  /**
   * Event handler for when a checkbox on an item within the group is changed.
   * @param event Event object that was fired.
   */
  handleCheckChange(event: any) {
    if (!event) this.checkState = false;
    else {
      this.checkState = this.checkIfAllSelected();
    }
  }
  /**
   * Checks if all the asset line items within this group are selected.
   * @returns Will return true if all asset line items are selected.
   * @ignore
   */
  private checkIfAllSelected(): boolean {
    let allSelected = true;
    this.group.forEach(asset => {
      if (!this.assetSelectionService.isAssetSelected(asset.parent)) allSelected = false;
    });
    return allSelected;
  }

  /** @ignore */
  showAssetCheckBox(operation: any): boolean {
    return (operation !== 'Buy More' && operation !== 'Change Configuration');
  }
}
