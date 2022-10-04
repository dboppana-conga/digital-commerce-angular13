import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AObject } from '@congacommerce/core';
import { StorefrontService, FileService, AttachmentService, File, Attachment, ProductInformationService } from '@congacommerce/ecommerce';

/**
 * <strong>This component is a work in progress.</strong>
 * 
 *  The files component is used for showing a list of attachments associated with an order in a table view.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/files.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { FilesModule } from '@congacommerce/elements';

@NgModule({
  imports: [FilesModule, ...]
})
export class AppModule {}
 ```
*
* @example
 ```typescript
* <apt-files 
*           [recordId]="recordId"
* ></apt-files>
 ```
*
*/
@Component({
    selector: 'apt-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesComponent implements OnChanges {
    /** 
     * Id of the product to render the files for
     */
    @Input('recordId')
    recordId: string;
    /** 
     * Flag to determine whether order is generated or not
     */
    @Input('orderGenerated')
    orderGenerated: boolean;
    /** 
     * Used to hold information for rendering the files
     * @ignore
     */
    fileList$: Observable<Array<IFile>>;

    constructor(private storefrontService: StorefrontService, private attachmentService: AttachmentService, private fileService: FileService, private productInformationService: ProductInformationService) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.fileList$ = this.storefrontService.getSetting('EnableFiles')
            .pipe(
                switchMap((filesEnabled: boolean) => {
                    if (filesEnabled)
                        return this.fileService.getFiles(this.recordId)
                            .pipe(
                                map((fileList: Array<AObject>) => fileList.map(this.mapFile))
                            );
                    else
                        return this.attachmentService.getAttachments(this.recordId)
                            .pipe(
                                map((attachmentList: Array<Attachment>) => attachmentList.map(this.mapAttachment))
                            )
                })
            );

    }

    download(file: IFile) {
        if (file.is_file) {
            this.fileService.downloadFile(file.record as File);
        } else {
            window.open(this.productInformationService.getAttachmentUrl(file.record.Id, this.recordId), '_blank');
        }
    }

    private mapFile(file: File, index: number): IFile {
        return {
            record: file,
            id: file.Id,
            index: index + 1,
            title: file.Title,
            type: file.FileExtension,
            size: (file.ContentSize / 1024).toFixed(2) + ' KB',
            created_date: file.CreatedDate,
            is_file: true
        };
    }

    private mapAttachment(attachment: Attachment, index: number): IFile {
        return {
            record: attachment,
            id: attachment.Id,
            index: index + 1,
            title: attachment.Name,
            type: attachment.ContentType,
            size: (attachment.BodyLength / 1024).toFixed(2) + ' KB',
            created_date: attachment.CreatedDate,
            is_file: false
        };
    }
}

interface IFile {
    record: Attachment | File;
    id: string;
    index: number;
    title: string;
    type: string;
    size: string;
    created_date: Date;
    is_file: boolean;
}