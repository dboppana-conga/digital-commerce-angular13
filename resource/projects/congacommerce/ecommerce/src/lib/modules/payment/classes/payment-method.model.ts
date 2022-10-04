import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';


@ATable({
    sobjectName: 'PaymentMethod'
})
export class PaymentMethod  extends AObject {
    
    @Expose({
        name: 'AccountId'
    })
    AccountId: string=null;


    @Expose({
        name: 'CardExpirationMonth'
    })
    CardExpirationMonth: number = null;

    @Expose({
        name: 'CardExpirationYear'
    })
    CardExpirationYear: number = null;

    @Expose({
        name: 'CardNumber'
    })
    CardNumber: string = null;

    @Expose({
        name: 'CardType'
    })
    CardType: string = null;
    
    @Expose({
        name: 'ECheckAccountNumber'
    })
    ECheckAccountNumber: string = null;

    @Expose({
        name: 'ECheckAccountType'
    })
    ECheckAccountType: string = null;

    @Expose({
        name: 'ECheckRoutingNumber'
    })
    ECheckRoutingNumber: string = null;

    @Expose({
        name: 'IsDefault'
    })
    IsDefault: boolean = null;

    @Expose({
        name: 'PaymentMethodName'
    })
    PaymentMethodName: string = null

    @Expose({
        name: 'PaymentMethodType'
    })
    PaymentMethodType: string = null;

    @Expose({
        name: 'ProfileId'
    })
    ProfileId: string = null;

    @Expose({
        name: 'Status'
    })
    Status: string = null;

    @Expose({
        name: 'TokenId'
    })
    TokenId: string = null;

    @Expose({
        name: 'Name'
    })
    public Name: string = null;   
}
