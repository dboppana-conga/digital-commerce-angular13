import { Type, Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { User } from '../../crm/classes';
@ATable({
    sobjectName: 'Note'
})
export class Note extends AObject {

    @Expose({ name: 'Description' })
    Description: string | null = null;

    @Expose({ name: 'Name' })
    Name: string  | null = null;

    @Expose({ name: 'Parent' })
    @Type(() => Note)
    Parent: Note  | null = null;

    @Expose({ name: 'CreatedBy' })
    @Type(() => User)
    CreatedBy: User  | null = null;
}