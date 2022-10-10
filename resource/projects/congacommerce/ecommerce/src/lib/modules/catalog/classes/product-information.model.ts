import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Attachment } from './attachment.model';
@ATable({
    sobjectName: 'ProductInformation'
})
export class ProductInformation extends AObject {

    @Expose({ name: 'Type' })
    Type: string | null= null;

    @Expose({ name: 'Name' })
    Name: string | null= null;

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;

    @Expose({ name: 'ProductId' })
    ProductId: string | null= null;

    @Expose({ name: 'InformationType' })
    InformationType: string | null= null;

    @Expose({ name: 'FileId' })
    FileId: string | null= null;

    @Expose({ name: 'EmbedCode' })
    EmbedCode: string | null= null;

    @Expose({ name: 'Description' })
    Description: string | null= null;

    @Expose({ name: 'ContentUrl' })
    ContentUrl: string | null= null;

    @Expose({ name: 'ClassificationId' })
    ClassificationId: string | null= null;

    @Expose({ name: 'Attachments' })
    @Type(() => Attachment)
    Attachments: Array<Attachment> = [new Attachment()];
}