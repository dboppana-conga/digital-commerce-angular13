import { Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'Attachment'
})
export class QuoteAttachment extends AObject {

    @Expose({ name: 'Body' })
    Body: string | null = null;

    @Expose({ name: 'BodyLength' })
    BodyLength: number | null = null;

    @Expose({ name: 'Description' })
    Description: string | null = null;

    @Expose({ name: 'Name' })
    Name: string | null = null;

    @Expose({ name: 'ParentId' })
    ParentId: string | null = null;

    @Expose({ name: 'ContentType' })
    ContentType: string | null = null;
}