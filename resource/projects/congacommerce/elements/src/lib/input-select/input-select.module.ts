import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputSelectComponent } from './input-select.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


export * from './input-select.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TranslateModule.forChild()
  ],
  declarations: [InputSelectComponent],
  exports: [InputSelectComponent]
})
export class InputSelectModule {}
