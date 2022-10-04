import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCarouselComponent } from './product-carousel.component';
import { ProductCardModule } from '../product-card/product-card.module';
import { LineitemCardModule } from '../lineitem-card/lineitem-card.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';

export * from './product-carousel.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    ProductCardModule,
    LineitemCardModule,
    CarouselModule.forRoot()
  ],
  declarations: [ProductCarouselComponent],
  exports : [ProductCarouselComponent]
})
export class ProductCarouselModule { }
