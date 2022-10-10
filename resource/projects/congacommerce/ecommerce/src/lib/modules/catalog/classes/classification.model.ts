import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Category } from './category.model';
@ATable({
    sobjectName: 'ClassificationName'
})
export class Classification extends AObject {

    @Expose({ name: 'HierarchyLabel' })
    HierarchyLabel: string | null= null;

    @Expose({ name: 'Type' })
    Type: string | null= null;

    @Type(() => Category)
    @Expose({ name: 'CategoryHierarchies' })
    CategoryHierarchies: Array<Category> = [new Category()];

    @Expose({ name: 'Name' })
    Name: string | null= null;
}