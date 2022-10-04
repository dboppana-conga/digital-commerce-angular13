import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { ConfigurationSummaryModule } from '../product-configuration-summary/configuration-summary.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InstalledProductsComponent } from './installed-products/installed-products.component';
import { PricingModule } from '@congacommerce/ecommerce';
import { ConstraintPopoverModule } from '../constraint-popover/constraint-popover.module';
import { AssetDropdownButtonComponent } from './asset-dropdown-button/asset-dropdown-button.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenerateDocumentComponent } from './generate-document/generate-document.component';
import { PresentDocumentComponent } from './present-document/present-document.component';
import { OutputFieldModule } from '../output-field/output-field.module';

export * from './add-to-cart/add-to-cart.component';
export * from './installed-products/installed-products.component';
export * from './generate-document/generate-document.component';
export * from './asset-dropdown-button/asset-dropdown-button.component';
export * from './present-document/present-document.component';


/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LaddaModule,
    PricingModule,
    ConfigurationSummaryModule,
    ConstraintPopoverModule,
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forChild(),
    NgSelectModule,
    OutputFieldModule
  ],
  declarations: [AddToCartComponent, AssetDropdownButtonComponent, InstalledProductsComponent, GenerateDocumentComponent, PresentDocumentComponent],
  exports: [AddToCartComponent, AssetDropdownButtonComponent, InstalledProductsComponent, GenerateDocumentComponent, PresentDocumentComponent]
})
export class ButtonModule { }
