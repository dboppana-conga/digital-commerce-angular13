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
    Name: string | null = null;

    @Expose({ name: 'CreatedBy' })
    @Type(() => User)
    CreatedBy: User = new User();

    @Expose({ name: 'OwnerId' })
    OwnerId: string | null = null;

    @Expose({ name: 'Active' })
    Active: boolean = false;

    @Expose({ name: 'ConfigurationId' })
    ConfigurationId: string | null = null;

    @Expose({ name: 'Configuration' })
    @Type(() => Cart)
    Configuration: Cart | null = null;

    @Expose({ name: 'Description' })
    Description: string | null = null;

    @Expose({ name: 'PriceListId' })
    PriceListId: string | null = null;

    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList | null = null;

    @Expose({ name: 'Scope' })
    Scope: string | null = null;
}