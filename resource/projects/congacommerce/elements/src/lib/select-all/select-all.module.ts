import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectAllComponent } from './select-all.component';

export * from './select-all.component';

/**
 * @ignore
 */
@NgModule({
  imports: [CommonModule],
  declarations: [SelectAllComponent],
  exports: [SelectAllComponent]
})
export class SelectAllModule { }
