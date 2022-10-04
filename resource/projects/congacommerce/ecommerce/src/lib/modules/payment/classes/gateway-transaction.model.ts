import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';


@ATable({
    sobjectName: 'GatewayTransaction'
})
export class GatewayTransaction  extends AObject {
    
    @Expose({
        name: 'AccountId'
    })
    AccountId: string=null;


    @Expose({
        name: 'AuthAmount'
    })
    AuthAmount: number = null;

    @Expose({
        name: 'AuthAVSCode'
    })
    AuthAVSCode: string = null;

    @Expose({
        name: 'AuthResponse'
    })
    AuthResponse: string = null;

    @Expose({
        name: 'CardExpirationMonth'
    })
    CardExpirationMonth: string = null;
    
    @Expose({
        name: 'CardExpirationYear'
    })
    CardExpirationYear: string = null;

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
    ECheckAccountNumber: boolean = null;

    @Expose({
        name: 'ECheckAccountType'
    })
    ECheckAccountType: string = null;

    @Expose({
        name: 'ECheckRoutingNumber'
    })
    ECheckRoutingNumber: string = null;

    @Expose({
        name: 'GatewayDecision'
    })
    GatewayDecision: string = null;

    @Expose({
        name: 'GatewayMessage'
    })
    GatewayMessage: string = null;

    @Expose({
        name: 'OrderId'
    })
    OrderId: string = null;

    @Expose({
        name: 'PaymentId'
    })
    PaymentId: string = null;

    @Expose({
        name: 'PaymentMethodId'
    })
    PaymentMethodId: string = null;

    @Expose({
        name: 'PaymentMethodType'
    })
    PaymentMethodTyp: string = null;

    @Expose({
        name: 'ProfileId'
    })
    ProfileId: string = null;

    @Expose({
        name: 'ReasonCode'
    })
    ReasonCode: string = null;

    @Expose({
        name: 'ReferenceId'
    })
    ReferenceId: string = null;

    @Expose({
        name: 'RefundId'
    })
    RefundId: string = null;

    @Expose({
        name: 'RelatedAuthRequestId'
    })
    RelatedAuthRequestId: string = null;

    @Expose({
        name: 'RequestAmount'
    })
    RequestAmount: number = null;

    @Expose({
        name: 'RequestCurrency'
    })
    RequestCurrency: string = null;

    @Expose({
        name: 'RequestDate'
    })
    RequestDate: string = null;

    @Expose({
        name: 'RequestTaxAmount'
    })
    RequestTaxAmount: number = null;

    @Expose({
        name: 'RequestTokenId'
    })
    RequestTokenId: string = null;

    @Expose({
        name: 'ResponseCode'
    })
    ResponseCode: string = null;

    @Expose({
        name: 'ResponseDate'
    })
    ResponseDate: string = null;

    @Expose({
        name: 'ResponseString'
    })
    ResponseString: string = null;

    @Expose({
        name: 'Status'
    })
    Status: string = null;

    @Expose({
        name: 'TransactionId'
    })
    TransactionId: string = null;

    @Expose({
        name: 'TransactionType'
    })
    TransactionType: string = null;

    @Expose({
        name: 'UpdatedTokenId'
    })
    UpdatedTokenId: string = null;
}
