import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule as BSPopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from '../icon/icon.module';
import { PopoverComponent } from './popover.component';
import { PopoverService } from './services/popover.service';

export * from './popover.component';
export * from './services/popover.service';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    IconModule,
    RouterModule,
    FormsModule,
    BSPopoverModule.forRoot(),
    TranslateModule.forChild()
  ],
  providers: [PopoverService],
  declarations: [PopoverComponent],
  exports: [PopoverComponent]
})
export class PopoverModule { }
