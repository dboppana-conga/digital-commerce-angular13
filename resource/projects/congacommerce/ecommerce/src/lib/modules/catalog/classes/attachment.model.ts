import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { UserBase } from '../../crm/classes';
@ATable({
    sobjectName: 'Attachment'
})
export class Attachment extends AObject {

    @Expose({ name: 'BodyLength' })
    BodyLength: number | null = null;

    @Expose({ name: 'Description' })
    Description: string | null = null;

    @Expose({ name: 'Name' })
    Name: string  | null = null;

    @Expose({ name: 'ParentId' })
    ParentId: string | null = null;

    @Expose({ name: 'ContentType' })
    ContentType: string | null = null;

    @Expose({ name: 'CreatedById' })
    @Type(() => UserBase)
    CreatedById: any = null;
}