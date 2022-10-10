import { AObjectService } from '@congacommerce/core';
import { ProductInformation } from '../classes/product-information.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { get, set, each, map as _map } from 'lodash';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * The Product Information service is a way to find the attachments associated with a product
 *  <h3>Usage</h3>

 ```typescript
 import { ProductInformationService, AObjectService } from '@congacommerce/ecommerce';
 constructor(private productInformationService: ProductInformationService) {
 // or
 export class MyService extends AObjectService {
      private productInformationService: ProductInformationService = this.injector.get(ProductInformationService);
  }

 ```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductInformationService extends AObjectService {
    type = ProductInformation;

    /**
     * Method is used to retrieve the list of production information items with attachments for a given product.
     * ### Example:
```typescript
import { ProductInformationService, ProductInformation } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    productInformationValue$: Observable<ProductInformation>;
    productInformationValue: ProductInformation;

    constructor(private productInformationValueService ProductInformationValueService){}

    getProductInformation(productId: string){
       this.productInformationService.getProductInformation(productId).subscribe(a => this.productInformationValue = a);
        // or
        this.productInformationValue$ = this.productInformationService.getProductInformation(productId);
    }
}
```
     * @param productId the id of the product to return the product inoformation items for
     * @returns an observable containing the product information details for the given product
     */
    public getProductInformation(productId: string): Observable<ProductInformation[]> {
        if (productId) {
            return this.apiService.get(`common/v1/documents/object/Product/${productId}`).pipe(map(data => {
                each(data, (res, i) => {
                    set(data[i].DocumentMetadata, '_metadata.blobData', res.BlobData)
                })
                return plainToClass(ProductInformation, _map(data, r => r.DocumentMetadata)) as unknown as Array<ProductInformation>;
            }))
        }
        return of([]);

    }

    /**
     * Method is used to retrieve the string URL for product attachments.
     * ### Example:
```typescript
import { ProductInformationService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    getUrl: string;

    constructor(private productInformationService ProductInformationService){}

    getAttachmentUrl(attachmentId: string, productId: string){
       this.fetUrl = this.productInformationService.getAttachmentUrl(attachmentId, productId);
    }
}
```
     *
     * @param productId the id of the product to generate the attachment url for
     * @param attachmentId the id of the product attachment file
     * @returns a string url for the given product attachment
     */
    public getAttachmentUrl(attachmentId: string, productId: string): string {
        const endpoint = `${this.configurationService.get('endpoint')}/servlet/servlet.FileDownload?file=`;
        return endpoint + attachmentId;
    }

    private base64ToArrayBuffer(base64: string) {
        let binaryString = window.atob(base64);
        let binaryLen = binaryString.length;
        let bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    /**
     * Method is used to download the attachement of product.
     * ### Example:
```typescript
import { ProductInformationService, ProductInformation } from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{

    constructor(private productInformationService: ProductInformationService){}

    donwloadProductAttachment(attachment: ProductInformation){
        this.productInformationService.donwloadProductAttachment(attachment);
    }
}
```
     * @param attachment is an object of Product Information instance.
     * 
     */
    public donwloadProductAttachment(attachment: ProductInformation) {
        const blobData = attachment.get('blobData');
        let bytes = this.base64ToArrayBuffer(blobData);
        let blob = new Blob([bytes], { type: `${get(attachment, 'Type')}` });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = get(attachment, 'Name') as string;
        link.click();
        link.remove();
    }
}