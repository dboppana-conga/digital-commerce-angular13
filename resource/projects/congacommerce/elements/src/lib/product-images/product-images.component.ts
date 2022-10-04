import {
    Component,
    NgZone,
    Input,
    OnChanges
  } from '@angular/core';
  import { Product, ProductInformation, ProductInformationService } from '@congacommerce/ecommerce';
  import { ImagePipe, ConfigurationService } from '@congacommerce/core';
  import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
  import { DomSanitizer } from '@angular/platform-browser';
  import * as _ from 'lodash';
  import { Observable } from 'rxjs';
  /**
   * The Product Images component displays the image of the products.
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductImagesModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductImagesModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-product-images [product]="product"></apt-product-images>
```
*/
  @Component({
    selector: 'apt-product-images',
    template: `
      <ngx-gallery [options]="galleryOptions" [images]="galleryImages" *ngIf="!showBlank && galleryImages && galleryImages.length > 0"></ngx-gallery>
      <img [src]="null | image" *ngIf="showBlank" class="w-100 img-fluid"/>
    `,
    styles: [`
      :host{
        height: 28rem;
        display: block;
      }
    `]
  })
  export class ProductImagesComponent implements OnChanges {
    /**
     * The product associated with this component.
     */
    @Input() product: Product;
    /**
     * Flag to show the thumbnails.
     */
    @Input() thumbnails: boolean = true;
    /** @ignore */
    galleryOptions: NgxGalleryOptions[];
    /** @ignore */
    galleryImages: NgxGalleryImage[];
    /** @ignore */
    showBlank = false;
    /** @ignore */
    productInformation$: Observable<ProductInformation[]>;

    constructor( private dss: DomSanitizer, private config: ConfigurationService, private productInformationService: ProductInformationService) { }

    ngOnChanges() {
      if (this.product) {
        this.productInformationService.getProductInformation(this.product.Id).subscribe(result => {
          const Attachments = result.map(res => res.Attachments);
          if(Attachments) {
            this.galleryOptions = [
              {
                width: '100%',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                imageSize: 'contain',
                arrowPrevIcon: 'fa fa-arrow-circle-left text-dark',
                arrowNextIcon: 'fa fa-arrow-circle-right text-dark',
                thumbnailsArrows: false,
                imageInfinityMove: true,
                closeIcon: 'fa fa-times-circle-o text-dark',
                thumbnails: this.thumbnails && Attachments.length > 1,
                previewCloseOnClick: true,
                previewCloseOnEsc: true,
              },
              // max-width 400
              {
                breakpoint: 767,
                preview: false,
                width: '100%',
                imagePercent: 80,
                thumbnails: this.thumbnails && Attachments.length > 1,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
              }
            ];
            this.galleryImages = [];
            if(Attachments.length>0){
              result.forEach(productinfo => {
                if (_.get(productinfo, 'Attachments')) {
                  productinfo.Attachments.forEach(attachment => {
                    this.galleryImages.push({
                      small: new ImagePipe(this.config, this.dss).transform(attachment.Id, true, false, productinfo.ProductId),
                      medium: new ImagePipe(this.config, this.dss).transform(attachment.Id, true, false, productinfo.ProductId),
                      big: new ImagePipe(this.config, this.dss).transform(attachment.Id, true, false, productinfo.ProductId)
                    });
                  });
                }
              });
            }
            if(_.get(this.product,'IconId')){
              this.galleryImages.push({
                small: new ImagePipe(this.config, this.dss).transform(this.product.IconId, true, false, this.product.Id),
                medium: new ImagePipe(this.config, this.dss).transform(this.product.IconId, true, false, this.product.Id),
                big: new ImagePipe(this.config, this.dss).transform(this.product.IconId, true, false, this.product.Id)
              });
            }

            if (!this.galleryImages || this.galleryImages.length === 0)
              this.showBlank = true;
          }
        });
      }
    }
  }