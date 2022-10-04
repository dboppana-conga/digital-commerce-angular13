import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { GatewayCommunication } from '../../classes/gateway-communication.model';

/**
 * @ignore
 * The gateway communication object stores payment request/response payload for each transaction.
 */
@Injectable({
  providedIn: 'root'
})

export class GatewayCommunicationService extends AObjectService {
  type = GatewayCommunication;

  /**
    * Retrieves the gateway communication if response has been received from the
    * payment gateway (CyberSource) based on the gateway transaction's ID
    * and also updating payment method cache
    * ### Example:
```typescript
import { GatewayCommunicationService} from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    gatewayCommunication: GatewayCommunication;
    constructor(private gatewayCommunicationService: GatewayCommunicationService){}
    ngOnInit(){
        this.gatewayCommunicationService.getResponseUpdate(this.gatewayCommunication.GatewayTransactiontId).subscribe(response => {
        });
    }
}
```
  /**
   * This method retrieves the gateway communication record for a given transaction id.
   * @param string representing the gateway transaction identifier.
   * @returns an observable containing the gateway communication response.
   */
  public getResponseUpdate(gatewayTransactionId: string): Observable<GatewayCommunication> {
    let conditionList = [];
    // TODO: Replace with RLP API
    // conditionList.push(new ACondition(this.type, 'GatewayTransactiontId', 'Equal', gatewayTransactionId));
    // conditionList.push(new ACondition(this.type, 'PayloadType', 'Equal', 'Response'));

    // return this.query({ skipCache: true, conditions: conditionList })
    //   .pipe(map(res => first(res)));
    return null;
  }
}