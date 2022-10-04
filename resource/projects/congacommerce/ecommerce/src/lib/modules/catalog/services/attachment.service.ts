
import {throwError as observableThrowError,  Observable, Subscriber } from 'rxjs';
import { Attachment } from '../classes/attachment.model';
import { AObjectService } from '@congacommerce/core';
import { Injectable } from '@angular/core';
import { Quote } from '../../order/classes';

/**
 * The attachment represents a file that can be associated with an order, quote, etc as an attachment.
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class AttachmentService extends AObjectService {
    type = Attachment;

    /**
     * Method to upload the attachment for quote, order, etc and associate with given parent id
     * ### Example:
     ```typescript
      import { AttachmentService, Attachment } from '@congacommerce/ecommerce';
      import { Observable } from 'rxjs/Observable';

      export class MyComponent implements OnInit{

           constructor(private attachmentService: AttachmentService){}

           ngOnInit(){
                this.attachmentService.uploadAttachment(file: File, parentId: string).subscribe((res) => {
                });
           }
      }
     ```
     * @param file file to upload as an attachment for given parent id
     * @param parentId id of associted parent of an attachment
     * @returns an observable of the uploaded attached with id, errors and status
     */
    uploadAttachment(file: File, parentId: string): Observable<any> {
        if (!file) {
            return observableThrowError('Invalid file');
        }

        if (!parentId) {
            return observableThrowError('Invalid parent id');
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);

        return Observable.create((observer: Subscriber<any[]>): void => {
            reader.onload = () => {
                let base64data = reader.result.toString().split(',')[1];
                //TO DO:
                // this.apiService.getConnection().sobject('Attachment').create({
                //     ParentId: parentId,
                //     Name: file.name,
                //     Body: (base64data) ? base64data : '',
                //     ContentType: file.type
                // }).then((res) => {
                //     observer.next(res);
                //     observer.complete();
                //     this.cacheService.refresh(Quote);
                // });
            };

            reader.onerror = (error: ProgressEvent): void => {
                observer.error(error);
            };
        });
    }

    /** Method to get attachments */
    getAttachments(parentId: string): Observable<Array<Attachment>> {
        return this.apiService.get(`/attachment?condition[0]=ParentId,Equal,${parentId}&lookups=CreatedById&sort[field]=CreatedDate&sort[direction]=DESC`, Attachment);
      }
}