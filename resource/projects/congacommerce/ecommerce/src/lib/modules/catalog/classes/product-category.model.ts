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
    Classification: Category = null;

    @Expose({ name: 'Default' })
    Default: boolean = null;

    @Expose({ name: 'DefaultQuantity' })
    DefaultQuantity: number = null;

    @Expose({ name: 'MaxQuantity' })
    MaxQuantity: number = null;

    @Expose({ name: 'MinQuantity' })
    MinQuantity: number = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;
}