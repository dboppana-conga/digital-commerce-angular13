import { AObject, ATable } from '@congacommerce/core';
import { PriceList } from '../../pricing/classes/price-list.model';
import { Account } from '../../crm/classes/account.model';
import { StoreBanner } from './store-banner.model';
import { Expose, Type } from 'class-transformer';
import * as _ from 'lodash';

@ATable({
    sobjectName: 'Storefront',
    route: 'storefronts'
})
export class Storefront extends AObject {
    @Expose({
        name: 'Name'
    })
    Name: string = null;
    @Expose({
        name: 'DefaultPriceList'
    })
    @Type(() => PriceList)
    DefaultPriceList: PriceList = null;
    @Expose({
        name: 'ImageUrl'
    })
    Logo: string = null;
    @Expose({
        name: 'EnableABO'
    })
    EnableABO: boolean = null;
    @Expose({
        name: 'DefaultAccount'

    })
    @Type(() => Account)
    DefaultAccountforGuestUsers: Account = null;
    @Expose({
        name: 'Channel'
    })
    ChannelType: 'None' | 'E-Commerce' | 'Partner Quoting' | 'Partner Commerce' | 'Direct Sales' = null;
    @Expose({
        name: 'ConfigurationLayout'
    })
    ConfigurationLayout: 'None' | 'Native' | 'Embedded' = null;
}