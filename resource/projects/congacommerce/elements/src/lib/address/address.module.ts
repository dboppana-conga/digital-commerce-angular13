import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressComponent } from './address.component';
import { DependentPicklistModule } from '../dependent-picklist/dependent-picklist.module';
import { FormsModule } from '@angular/forms';
import { ApttusModule } from '@congacommerce/core';
import { TranslateModule } from '@ngx-translate/core';
export * from './address.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    DependentPicklistModule,
    FormsModule,
    ApttusModule,
    TranslateModule.forChild()
  ],
  declarations: [AddressComponent],
  exports : [AddressComponent]
})
export class AddressModule { }
