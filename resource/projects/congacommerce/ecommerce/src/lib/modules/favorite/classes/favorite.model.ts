import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { Cart } from '../../cart/classes/cart.model';
import { PriceList } from '../../pricing/classes/price-list.model';
import { User } from '../../crm/classes/user.model';
@ATable({
    sobjectName: 'FavoriteConfiguration'
})
export class Favorite extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'CreatedBy' })
    @Type(() => User)
    CreatedBy: User = new User();

    @Expose({ name: 'OwnerId' })
    OwnerId: string = null;

    @Expose({ name: 'Active' })
    Active: boolean;

    @Expose({ name: 'ConfigurationId' })
    ConfigurationId: string = null;

    @Expose({ name: 'Configuration' })
    @Type(() => Cart)
    Configuration: Cart = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'PriceListId' })
    PriceListId: string = null;

    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList = null;

    @Expose({ name: 'Scope' })
    Scope: string = null;
}