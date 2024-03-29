import { KeyValue } from '@angular/common';
import { Expose, Type } from 'class-transformer';
import { get, filter, forEach, isEmpty, compact, isNil, concat, sumBy } from 'lodash';
import { AObject, ATable, AObjectError } from '@congacommerce/core';
import { Account, User, UserBase } from '../../crm/classes/index';
import { PriceList, SummaryGroup } from '../../pricing/classes/index';
import { CartItem } from './cart-item.model';
import { Quote } from '../../order/classes/quote.model';
import { AppliedRuleActionInfo, AppliedRuleInfo } from '../../constraint-rules/classes';
import { Order } from '../../order/classes/order.model';
@ATable({
    sobjectName: 'ProductConfiguration',
    route: 'cart/v1/carts'
})
export class Cart extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Account' })
    @Type(() => Account)
    Account: Account = null;

    @Expose({ name: 'Status' })
    Status: string = null;

    @Expose({ name: 'Order' })
    @Type(() => Order)
    Order: Order = null;

    @Expose({ name: 'NumberOfItems' })
    NumberOfItems: number = null;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: string = null;

    @Expose({ name: 'BillToAccount' })
    @Type(() => Account)
    BillToAccount: Account = null;

    @Expose({ name: 'ExpectedStartDate' })
    ExpectedStartDate: string = null;

    @Expose({ name: 'ExpectedEndDate' })
    ExpectedEndDate: string = null;

    @Expose({ name: 'Comments' })
    Comments: string = null;

    @Expose({ name: 'EffectivePriceList' })
    @Type(() => PriceList)
    EffectivePriceList: PriceList = null;

    @Expose({ name: 'PriceList' })
    @Type(() => PriceList)
    PriceList: PriceList = null;

    @Expose({ name: 'Proposald' })
    @Type(() => Quote)
    Proposald: Quote = null;

    @Expose({ name: 'BusinessObjectId' })
    BusinessObjectId: string = null;

    @Expose({ name: 'BusinessObjectRefId' })
    BusinessObjectRefId: string = null;

    @Expose({ name: 'CollaborationRequestId' })
    CollaborationRequestId: string = null;

    @Expose({ name: 'ParentConfiguration' })
    @Type(() => Cart)
    ParentConfiguration: Cart = null;

    @Expose({ name: 'BusinessObjectType' })
    BusinessObjectType: string = null;

    @Expose({ name: 'ShipToAccount' })
    @Type(() => Account)
    ShipToAccount: Account = null;

    @Expose({ name: 'CreatedBy' })
    @Type(() => User)
    CreatedBy: User = new User();

    @Expose({ name: 'IsTransient' })
    IsTransient: boolean = true;

    @Expose({ name: 'LineItems' })
    @Type(() => CartItem)
    LineItems: Array<CartItem> = null;

    @Expose({ name: 'SummaryGroups' })
    @Type(() => SummaryGroup)
    SummaryGroups: Array<SummaryGroup> = null;

    @Expose({ name: 'IsPricePending' })
    IsPricePending: boolean = false;

    @Expose({ name: 'CouponCodes' })
    CouponCodes: string = null;

    @Expose({ name: 'AppliedRuleActionInfo' })
    @Type(() => AppliedRuleActionInfo)
    AppliedRuleActionInfo: Array<AppliedRuleActionInfo> = null;

    @Expose({ name: 'AppliedRuleInfo' })
    @Type(() => AppliedRuleInfo)
    AppliedRuleInfo: Array<AppliedRuleInfo> = null;

    @Expose({ name: 'Owner' })
    @Type(() => UserBase)
    Owner: UserBase = null;


    validate(): void {

        let errors: Array<AObjectError> = new Array<AObjectError>();
        // Validate the option groups
        forEach(filter(this.LineItems, { HasOptions: true }), item => {
            const reference: KeyValue<string, string> = {
                key: get(item, 'Product.Name'),
                value: `/products/${get(item, 'ProductId')}/${get(item, 'Id')}`
            };
            const optionGroups = get(item, 'LineType') === 'Option' ? get(item, 'Option.OptionGroups') : get(item, 'Product.OptionGroups');
            forEach(filter(optionGroups, { IsHidden: false }), option => {
                const children = filter(get(this, 'LineItems'), child => get(child, 'ParentBundleNumber') === get(item, 'PrimaryLineNumber') && get(child, 'ProductOption.ProductOptionGroupId') === get(option, 'Id'));
                const total = sumBy(children, 'Quantity');
                // Validate Max quantity
                if (!isNil(get(option, 'MaxTotalQuantity')) && total > option.MaxTotalQuantity)
                    item.setError('ERROR.OPTION_GROUP.MAX_TOTAL_QUANTITY', { value: option.MaxTotalQuantity }, 'error', null, reference);
                else
                    item.clearError('ERROR.OPTION_GROUP.MAX_TOTAL_QUANTITY');
                // Validate Max Quantity
                if (!isNil(get(option, 'MinTotalQuantity')) && total < option.MinTotalQuantity)
                    item.setError('ERROR.OPTION_GROUP.MIN_TOTAL_QUANTITY', { value: option.MinTotalQuantity }, 'error', null, reference);
                else
                    item.clearError('ERROR.OPTION_GROUP.MIN_TOTAL_QUANTITY');
                // Validate min options
                if (!isNil(get(option, 'MinOptions')) && get(children, 'length', 0) < option.MinOptions)
                    item.setError('ERROR.OPTION_GROUP.MIN_OPTIONS', { value: option.MinOptions }, 'error', null, reference);
                else
                    item.clearError('ERROR.OPTION_GROUP.MIN_OPTIONS');
                // Validate max options
                if (!isNil(get(option, 'MaxOptions')) && get(children, 'length', 0) > option.MaxOptions)
                    item.setError('ERROR.OPTION_GROUP.MAX_OPTIONS', { value: option.MaxOptions }, 'error', null, reference);
                else
                    item.clearError('ERROR.OPTION_GROUP.MAX_OPTIONS');
                errors = compact(concat(errors, item.errors));
            });
        });
        const qtyErrors = filter(this.LineItems, r => r.Quantity === 0 || !r.Quantity);
        isEmpty(qtyErrors) ? this.clearError('INVALID_QUANTITY') : this.setError('INVALID_QUANTITY');
        isEmpty(errors) ? this.clearError() : this.setError(`ERROR.CART.VALIDATE`, null, 'error', errors);
    }
}