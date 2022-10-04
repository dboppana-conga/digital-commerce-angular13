import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { CategoryTranslation } from '../../translation/classes/category-translation.model';

@ATable({
    sobjectName: 'ClassificationHierarchy',
    route: 'categories'
})
export class Category extends AObject {

    @Expose({ name: 'AncestorId' })
    AncestorId: string = null;

    @Expose({ name: 'PrimordialId' })
    PrimordialId: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'HierarchyId' })
    HierarchyId: string = null;

    @Expose({ name: 'IsLeaf' })
    IsLeaf: 'Yes' | 'No' = null;

    @Expose({ name: 'Label' })
    Label: string = null;

    @Expose({ name: 'ProductCount' })
    ProductCount: number = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Translation' })
    @Type(() => CategoryTranslation)
    Translation: Array<CategoryTranslation> = null;

    @Expose({ name: 'IsHidden' })
    IsHidden: boolean = null;

    @Expose({ name: 'IncludeInTotalsView' })
    IncludeInTotalsView: boolean = null;
}