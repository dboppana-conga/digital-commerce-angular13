import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Category } from './category.model';
import { Product } from './product.model';
@ATable({
    sobjectName: 'ProductCategory'
})
export class ProductCategory extends AObject {

    @Expose({ name: 'Category', })
    @Type(() => Category)
    Classification: Category | null= null;

    @Expose({ name: 'Default' })
    Default: boolean = false;

    @Expose({ name: 'DefaultQuantity' })
    DefaultQuantity: number | null= null;

    @Expose({ name: 'MaxQuantity' })
    MaxQuantity: number | null= null;

    @Expose({ name: 'MinQuantity' })
    MinQuantity: number | null= null;

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product | null= null;
}