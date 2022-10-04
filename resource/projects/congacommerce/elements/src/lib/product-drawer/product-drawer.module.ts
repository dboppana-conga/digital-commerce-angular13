import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ProductDrawerComponent } from './product-drawer.component';

import { ProductCardModule } from '../product-card/product-card.module';
import { SuperChevronComponent } from './super-chevron/super-chevron.component';
import { BatchActionComponent } from './batch-actions/batch-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCarouselModule } from '../product-carousel/product-carousel.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LineitemCardModule } from '../lineitem-card/lineitem-card.module';

export * from './product-drawer.component';
export * from './product-drawer.service';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LaddaModule,
    ProductCarouselModule,
    ProductCardModule,
    LineitemCardModule,
    TooltipModule.forRoot(),
    TranslateModule.forChild()
  ],
  declarations: [ProductDrawerComponent, SuperChevronComponent, BatchActionComponent],
  exports : [ProductDrawerComponent]
})
export class ProductDrawerModule { }
