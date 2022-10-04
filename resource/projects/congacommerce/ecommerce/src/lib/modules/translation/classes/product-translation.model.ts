import { AObject, ATable } from '@congacommerce/core';
import { Expose, Type } from 'class-transformer';
import { Product } from '../../catalog/classes/product.model';

@ATable({
    sobjectName: 'ProductTranslation'
})
export class ProductTranslation extends AObject {
    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'Family' })
    Family: string = null;

    @Expose({ name: 'Language' })
    Language: string = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;

    @Expose({ name: 'ProductCode' })
    ProductCode: string = null;
}