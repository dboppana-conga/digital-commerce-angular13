import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MiniProfileComponent } from './mini-profile.component';
import { TranslateModule } from '@ngx-translate/core';

export * from './mini-profile.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LaddaModule,
    ModalModule.forRoot(),
    TranslateModule.forChild()
  ],
  declarations: [MiniProfileComponent],
  exports : [MiniProfileComponent]
})
export class MiniProfileModule { }
