import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputQuantityComponent } from './input-quantity.component';

export * from './input-quantity.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [InputQuantityComponent],
  exports: [InputQuantityComponent]
})
export class InputQuantityModule { }
