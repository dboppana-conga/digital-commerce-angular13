import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { get } from 'lodash';
import { CartService, AssetLineItem } from '@congacommerce/ecommerce';
import { AssetSelectionService } from '../../../shared/services/index';
import { ProductConfigurationSummaryComponent } from '../../product-configuration-summary/configuration-summary.module';
import { AccordionRows } from '../accordion-rows.interface';
import { AssetModalService } from '../../../shared/services/asset-modal.service';
/**
 * Asset accordion item component is used to display each asset line item within each group in the asset accordion.
 * @ignore
 */
@Component({
  selector: 'apt-asset-accordion-item',
  templateUrl: './asset-accordion-item.component.html',
  styleUrls: ['./asset-accordion-item.component.scss']
})
export class AssetAccordionItemComponent implements OnInit, OnDestroy {
  /**
   * Model value of the checkbox state.
   */
  @Input() checkState: boolean = false;
  /**
   * Asset line item to represent the data displayed on this component.
   */
  @Input() item: AccordionRows;
  /**
   * Value of the operation type.
   */
  @Input() operation: string;
  /**
   * Event emitter for when the checkbox value changes.
   */
  @Output() checkChange: EventEmitter<boolean> = new EventEmitter();
  /**
   * Flag to set the asset action button disabled.
   */
  buttonDisabled: boolean = false;
  /**
   * Display text for the tooltip on the asset action button when it is disabled.
   */
  buttonTooltip: string;
  /**
   * Bootstrap modal reference.
   */
  modalRef: BsModalRef;
  selectedAsset: AssetLineItem;

  @ViewChild('configurationSummary') configurationSummary: ProductConfigurationSummaryComponent;

  /**
   * Current subscriptions in this class.
   * @ignore
   */
  private subs: Array<any> = [];

  constructor(private assetSelectionService: AssetSelectionService, private modalService: BsModalService, private cartService: CartService, private assetModalService: AssetModalService, private translateService: TranslateService) { }

  ngOnInit() {
    this.buttonDisabled = get(this.item, 'parent.AssetStatus') !== 'Activated';
    this.subs.push(
      this.assetSelectionService.getSelectedAssets().subscribe(assets => {
        this.checkState = this.assetSelectionService.isAssetSelected(this.item.parent);
      })
    );
    this.subs.push(
      this.cartService.getMyCart().subscribe(cart => {
        this.buttonDisabled = get(this.item, 'parent.AssetStatus') !== 'Activated';
        this.buttonTooltip = 'Asset status is not Activated.';
        if (get(cart, 'LineItems')) {
          cart.LineItems.forEach(lineItem => {
            if (get(lineItem, 'AssetLineItem.Id') === get(this.item, 'parent.Id')) {
              this.buttonDisabled = true;
              this.translateService.stream('ASSET_LIST.ASSET_ALREADY_EXIST_IN_CART_TOOLTIP').subscribe((val: string) => {
                this.buttonTooltip = val;
              });
            }
          });
        }
      })
    );
  }
  /**
   * Checks if the asset dropdown button should be displayed.
   * @returns True if the criteria to show asset dropdown button is met.
   */
  showAssetDropdownButton(): boolean {
    const bool = this.operation !== 'Renew' && this.operation !== 'Terminate' && (get(this.item, 'parent.Product.ConfigurationType') === 'Standalone' || get(this.item, 'parent.Product.ConfigurationType') === 'Bundle') && (get(this.item, 'parent.PriceType') === 'Recurring' || get(this.item, 'parent.PriceType') === 'Usage');
    if (!bool) return this.showBuyMoreButton();
    return bool;
  }

  /**
   * @ignore
   */
  showBuyMoreButton(): boolean {
    return (get(this.item, 'parent.Product.ConfigurationType') === 'Standalone' && get(this.item, 'parent.PriceType') === 'One Time');
  }
  /**
   * Event handler for when the checkbox value changes.
   * @param event Event object that was fired.
   */
  handleCheckbox(event: any) {
    if (this.checkState) this.assetSelectionService.addAssetToSelection(this.item.parent);
    else this.assetSelectionService.removeAssetFromSelection(this.item.parent);
    this.checkChange.emit(this.checkState);
  }
  /**
   * Event handler for when the asset dropdown is clicked.
   * @param event The event that was fired.
   */
  handleAssetDropdownButton(event: any) {
    switch (event) {
      case 'Renew':
        this.assetModalService.openRenewModal(this.item.parent, [this.item.parent]);
        break;
      case 'Terminate':
        this.assetModalService.openTerminateModal(this.item.parent, [this.item.parent]);
        break;
      case 'Buy More':
        this.assetModalService.openBuyMoreModal(this.item.parent, [this.item.parent]);
        break;
      case 'Change Configuration':
        this.assetModalService.openChangeConfigurationModal(this.item.parent, [this.item.parent]);
        break;
    }
  }

  /**
   * @ignore
   */
  openModal(item: AssetLineItem) {
    this.selectedAsset = item;
    setTimeout(() => this.configurationSummary.show());
  }

  /** @ignore */
  showAssetCheckBox(operation: any): boolean {
    return (operation !== 'Buy More' && operation !== 'Change Configuration');
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}