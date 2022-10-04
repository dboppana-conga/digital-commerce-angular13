import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Attachment } from './attachment.model';
@ATable({
    sobjectName: 'ProductInformation'
})
export class ProductInformation extends AObject {

    @Expose({ name: 'Type' })
    Type: string = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'ProductId' })
    ProductId: string = null;

    @Expose({ name: 'InformationType' })
    InformationType: string = null;

    @Expose({ name: 'FileId' })
    FileId: string = null;

    @Expose({ name: 'EmbedCode' })
    EmbedCode: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'ContentUrl' })
    ContentUrl: string = null;

    @Expose({ name: 'ClassificationId' })
    ClassificationId: string = null;

    @Expose({ name: 'Attachments' })
    @Type(() => Attachment)
    Attachments: Array<Attachment> = [new Attachment()];
}