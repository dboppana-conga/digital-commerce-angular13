import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { CategoryTranslation } from '../../translation/classes/category-translation.model';

@ATable({
    sobjectName: 'ClassificationHierarchy',
    route: 'categories'
})
export class Category extends AObject {

    @Expose({ name: 'AncestorId' })
    AncestorId: string | null = null;

    @Expose({ name: 'PrimordialId' })
    PrimordialId: string  | null = null;

    @Expose({ name: 'Description' })
    Description: string  | null = null;

    @Expose({ name: 'HierarchyId' })
    HierarchyId: string | null  = null;

    @Expose({ name: 'IsLeaf' })
    IsLeaf: 'Yes' | 'No' = 'No';

    @Expose({ name: 'Label' })
    Label: string | null= null;

    @Expose({ name: 'ProductCount' })
    ProductCount: number | null= null;

    @Expose({ name: 'Name' })
    Name: string | null= null;

    @Expose({ name: 'Translation' })
    @Type(() => CategoryTranslation)
    Translation: Array<CategoryTranslation> | null= null;

    @Expose({ name: 'IsHidden' })
    IsHidden: boolean = false;

    @Expose({ name: 'IncludeInTotalsView' })
    IncludeInTotalsView: boolean = false;
}