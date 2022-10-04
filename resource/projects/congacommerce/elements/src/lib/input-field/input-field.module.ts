import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { AddressModule } from '../address/address.module';
import { IconModule } from '../icon/icon.module';
import { InputFieldComponent } from './input-field.component';
export * from './input-field.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    TranslateModule.forChild(),
    NgOptionHighlightModule,
    AddressModule,
    IconModule
  ],
  declarations: [InputFieldComponent],
  exports: [InputFieldComponent, FormsModule]
})
export class InputFieldModule { }
