import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { OutputFieldModule } from '../../output-field/output-field.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IconModule } from '../../icon/icon.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ConfigurationSummaryModule } from '../../product-configuration-summary/configuration-summary.module';

export * from './table.component';
export * from './table.interface';

/**
 * @ignore
 */
@NgModule({
  declarations: [TableComponent],
  exports: [TableComponent],
  imports: [
    CommonModule,
    OutputFieldModule,
    TranslateModule,
    FormsModule,
    ConfigurationSummaryModule,
    NgScrollbarModule,
    PopoverModule,
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule,
    IconModule
  ]
})
export class TableModule { }
