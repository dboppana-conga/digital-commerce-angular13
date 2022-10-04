import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImagesComponent } from './product-images.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ApttusModule } from '@congacommerce/core';

export * from '../product-images/product-images.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    NgxGalleryModule,
    ApttusModule
  ],
  declarations: [ProductImagesComponent],
  exports: [ProductImagesComponent]
})
export class ProductImagesModule { }
