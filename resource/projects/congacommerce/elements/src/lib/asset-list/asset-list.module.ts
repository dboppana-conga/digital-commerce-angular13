import { NgModule } from '@angular/core';
import { ConfigurationSummaryModule } from '../product-configuration-summary/configuration-summary.module';
import { AssetListComponent } from './asset-list.component';
import { AssetListHeaderComponent } from './asset-list-header/asset-list-header.component';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon/icon.module';
import { AssetAccordionComponent } from './asset-accordion/asset-accordion.component';
import { AssetAccordionGroupComponent } from './asset-accordion-group/asset-accordion-group.component';
import { FormsModule } from '@angular/forms';
import { AssetAccordionItemComponent } from './asset-accordion-item/asset-accordion-item.component';
import { PricingModule } from '@congacommerce/ecommerce';
import { ButtonModule } from '../button/button.module';
import { ApttusModalModule } from '../modal/modal.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { OutputFieldModule } from '../output-field/output-field.module';

export * from './asset-list.component';
export * from './accordion-rows.interface';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ApttusModalModule,
    IconModule,
    TooltipModule,
    PricingModule,
    ConfigurationSummaryModule,
    TranslateModule.forChild(),
    OutputFieldModule
  ],
  declarations: [AssetListComponent, AssetListHeaderComponent, AssetAccordionComponent, AssetAccordionGroupComponent, AssetAccordionItemComponent],
  exports: [AssetListComponent]
})
export class AssetListModule {}
