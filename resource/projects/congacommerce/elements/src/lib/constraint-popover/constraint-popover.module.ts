import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRPopoverComponent } from './constraint-popover.component';
import { PriceModule } from '../price/price.module';
import { IconModule } from '../icon/icon.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';
import { ConstraintPopoverService } from './services/constraint-popover.service';

export * from './constraint-popover.component';
export * from './services/constraint-popover.service';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    PriceModule,
    IconModule,
    RouterModule,
    FormsModule,
    PopoverModule.forRoot(),
    TranslateModule.forChild()
  ],
  providers: [ConstraintPopoverService],
  declarations: [CRPopoverComponent],
  exports: [CRPopoverComponent]
})
export class ConstraintPopoverModule { }
