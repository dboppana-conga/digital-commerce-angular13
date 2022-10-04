import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MiniCartComponent } from './mini-cart.component';
import { PriceModule } from '../price/price.module';
import { ApttusModule } from '@congacommerce/core';
import { InputFieldModule } from '../input-field/input-field.module';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
export * from './mini-cart.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LaddaModule,
    PriceModule,
    ApttusModule,
    RouterModule,
    InputFieldModule,
    TranslateModule.forChild(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({ onActivateTick: true })
  ],
  declarations: [MiniCartComponent],
  exports: [MiniCartComponent]
})
export class MiniCartModule { }
