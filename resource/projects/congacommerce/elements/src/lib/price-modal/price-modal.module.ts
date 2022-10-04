import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';

import { ApttusModule } from '@congacommerce/core';
import { PriceModalComponent } from './price-modal.component';

export * from './price-modal.component';
/**
 * @ignore
 */

@NgModule({
  imports: [
    CommonModule,
    ApttusModule,
    TranslateModule.forChild(),
    LaddaModule
  ],
  declarations: [PriceModalComponent],
  exports: [PriceModalComponent]
})

export class PriceModalModule { }
