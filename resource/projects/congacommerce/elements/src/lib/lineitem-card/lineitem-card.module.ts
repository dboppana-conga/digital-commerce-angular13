import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ApttusModule } from '@congacommerce/core';
import { ButtonModule } from '../button/button.module';
import { PriceModule } from '../price/price.module';
import { LineitemCardComponent } from './lineitem-card.component';

export * from './lineitem-card.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    PriceModule,
    TooltipModule,
    RouterModule,
    ApttusModule,
    TranslateModule.forChild()
  ],
  declarations: [LineitemCardComponent],
  exports: [LineitemCardComponent]
})
export class LineitemCardModule { }
