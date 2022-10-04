import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ApttusModule } from '@congacommerce/core';
import { PricingModule } from '@congacommerce/ecommerce';
import { ConfigurationSummaryModule } from '../product-configuration-summary/configuration-summary.module';
import { InputDateModule } from '../input-date/input-date.module';
import { PriceModule } from '../price/price.module';
import { OutputFieldModule } from '../output-field/output-field.module';
import { InputFieldModule } from '../input-field/input-field.module';
import { PromotionModalModule } from '../promotion-modal/promotion-modal.module';
import { LineItemTableRowComponent } from './line-item-table-row.component';
import { TableRowSubItemComponent } from './table-row-sub-item/table-row-sub-item.component';
import { LineItemMenuComponent } from './line-item-menu/line-item-menu.component';
import { AdditionalInformationComponent } from './additional-information/additional-information.component';

export * from './line-item-table-row.component';
export * from './line-item-menu/line-item-menu.component';
export * from './services/user-view-mapping.service';

/**
 * @ignore
 */

@NgModule({
  imports: [
    CommonModule,
    ApttusModule,
    RouterModule,
    InputDateModule,
    PriceModule,
    PricingModule,
    FormsModule,
    LaddaModule,
    OutputFieldModule,
    InputFieldModule,
    PromotionModalModule,
    PopoverModule.forRoot(),
    ConfigurationSummaryModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [LineItemTableRowComponent, TableRowSubItemComponent, LineItemMenuComponent, AdditionalInformationComponent],
  exports: [LineItemTableRowComponent, LineItemMenuComponent]
})
export class LineItemTableRowModule { }
