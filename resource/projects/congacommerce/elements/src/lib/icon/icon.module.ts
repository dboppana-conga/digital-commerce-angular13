import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { DotsComponent } from './dots/dots.component';

export * from './dots/dots.component';
export * from './spinner/spinner.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SpinnerComponent, DotsComponent],
  exports: [SpinnerComponent, DotsComponent]
})
export class IconModule { }
