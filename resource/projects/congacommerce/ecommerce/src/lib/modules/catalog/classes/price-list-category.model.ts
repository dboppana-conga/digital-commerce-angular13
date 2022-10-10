import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { PriceList } from '../../pricing/classes/price-list.model';
import { Category } from '../classes/category.model';
@ATable({
    sobjectName: 'PriceListCategory'
})
export class PriceListCategory extends AObject {

    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList  | null = null;

    @Expose({ name: 'Hierarchy' })
    @Type(() => Category)
    Hierarchy: Category  | null = null;
}