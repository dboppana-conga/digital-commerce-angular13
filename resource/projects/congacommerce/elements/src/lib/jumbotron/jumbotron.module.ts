import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JumbotronComponent } from './jumbotron.component';
import { ApttusModule } from '@congacommerce/core';

export * from './jumbotron.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    ApttusModule
  ],
  declarations: [JumbotronComponent],
  exports : [JumbotronComponent]
})
export class JumbotronModule { }
