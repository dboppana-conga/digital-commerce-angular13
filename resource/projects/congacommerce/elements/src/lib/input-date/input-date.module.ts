import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { OutputFieldModule } from '../output-field/output-field.module';
import { InputDateComponent } from './input-date.component';

export * from './input-date.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TranslateModule.forChild(),
    OutputFieldModule
  ],
  declarations: [InputDateComponent],
  exports: [InputDateComponent]
})
export class InputDateModule { }

