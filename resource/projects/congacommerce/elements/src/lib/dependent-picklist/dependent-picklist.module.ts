import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DependentPicklistComponent } from './dependent-picklist.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
export * from './dependent-picklist.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [DependentPicklistComponent],
  exports: [DependentPicklistComponent]
})
export class DependentPicklistModule { }
