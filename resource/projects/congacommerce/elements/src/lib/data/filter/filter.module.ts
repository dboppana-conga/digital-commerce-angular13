import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterComponent } from './filter.component';
import { InputFieldModule } from '../../input-field/input-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { OutputFieldModule } from '../../output-field/output-field.module';
import { PipesModule } from '../../../shared/pipes/pipes.module';

export * from './filter.component';

/**
 * @ignore
 */
@NgModule({
  declarations: [DataFilterComponent],
  imports: [
    CommonModule,
    InputFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    BsDropdownModule.forRoot(),
    OutputFieldModule,
    PipesModule
  ],
  exports: [DataFilterComponent]
})
export class DataFilterModule { }
