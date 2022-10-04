import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ProductSearchComponent } from './product-search.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../icon/icon.module';
import { FormsModule } from '@angular/forms';
import { ApttusModule } from '@congacommerce/core';

export * from './product-search.component';

/**
 * @ignore
 */
@NgModule({
  declarations: [ProductSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TranslateModule.forChild(),
    IconModule,
    ApttusModule
  ],
  exports: [ProductSearchComponent]
})
export class ProductSearchModule { }
