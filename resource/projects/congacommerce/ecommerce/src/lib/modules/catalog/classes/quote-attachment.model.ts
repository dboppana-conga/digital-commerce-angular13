import { Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'Attachment'
})
export class QuoteAttachment extends AObject {

    @Expose({ name: 'Body' })
    Body: string = null;

    @Expose({ name: 'BodyLength' })
    BodyLength: number = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ParentId' })
    ParentId: string = null;

    @Expose({ name: 'ContentType' })
    ContentType: string = null;
}