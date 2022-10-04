import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LaddaModule } from 'angular2-ladda';
import { ApttusModule } from '@congacommerce/core';
import { RevalidateCartModalComponent } from './revalidate-cart-modal.component';

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
  declarations: [
    RevalidateCartModalComponent
  ],
  entryComponents: [RevalidateCartModalComponent]
})
export class RevalidateCartModalModule { }
