import { Expose, Type } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
import { Product } from './product.model';
@ATable({
    sobjectName: 'ProductGroup'
})
export class ProductGroup extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'GroupType' })
    GroupType: string = null;

}

@ATable({
    sobjectName: 'ProductGroupMember'
})
export class ProductGroupMember extends AObject {

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;

    @Expose({ name: 'ProductGroup' })
    ProductGroup: ProductGroup = new ProductGroup();

    @Expose({ name: 'Ratio' })
    Ratio: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: string = null;
}