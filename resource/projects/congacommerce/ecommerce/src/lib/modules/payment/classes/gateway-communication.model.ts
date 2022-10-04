
import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';
import { GatewayTransaction } from './gateway-transaction.model';

@ATable({
    sobjectName: 'GatewayCommunication'
})
export class GatewayCommunication  extends AObject {
    
    @Expose({
        name: 'CommunicationDate'
    })
    CommunicationDate: string=null;

    @Expose({
        name: 'GatewayTransactiontId'
    })
    GatewayTransactionId: string = null;

    @Expose({
        name: 'GatewayTransactiontId'
    })
    GatewayTransaction: GatewayTransaction = new GatewayTransaction();

    @Expose({
        name: 'Payload'
    })
    Payload: string = null;

    @Expose({
        name: 'PayloadType'
    })
    PayloadType: string = null;

    @Expose({
        name: 'Status'
    })
    Status: string = null;
    
    @Expose({
        name: 'Type'
    })
    Type: string = null;

}
