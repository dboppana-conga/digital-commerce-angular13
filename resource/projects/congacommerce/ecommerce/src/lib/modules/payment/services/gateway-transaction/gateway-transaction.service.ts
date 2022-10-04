import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';

import { GatewayTransaction } from '../../classes/gateway-transaction.model';

/**
 * @ignore
 * The gateway transaction object store transaction type and unique ID for each transaction.
 */
@Injectable({
  providedIn: 'root'
})

export class GatewayTransactionService extends AObjectService {
  type = GatewayTransaction;

}