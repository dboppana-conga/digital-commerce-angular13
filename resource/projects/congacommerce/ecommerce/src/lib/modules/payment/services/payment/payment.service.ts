import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap, take } from 'rxjs/operators';
import * as _ from 'lodash';
import { AObjectService } from '@congacommerce/core';
import { PaymentMethod } from '../../classes/payment-method.model';
import { GatewayTransaction, GatewayCommunication, PaymentTransaction } from '../../classes/index';
import { GatewayTransactionService } from '../../services/gateway-transaction/gateway-transaction.service';
import { GatewayCommunicationService } from '../../services/gateway-communication/gateway-communication.service';

/**
 * @ignore
 * Responsible to do CRUD operation on payment service
 */
@Injectable({
  providedIn: 'root'
})

export class PaymentService extends AObjectService {
  type = PaymentMethod;
  protected gatewayTransactionService = this.injector.get(GatewayTransactionService);
  protected gatewayCommunicationService = this.injector.get(GatewayCommunicationService);

  /**
 * This is a silent method I-FRAME for payment
  * @param transactionDetails payment related transaction details
  * @param gatewayTransaction gateway transaction details to store
  * @param gatewayCommunication gateway communication details to store
 * @returns observable of array including object and gateway transaction string to trace payment response
 * TO DO:
 */
  saleCaptureMethod(transactionDetails: PaymentTransaction, gatewayTransaction: GatewayTransaction = new GatewayTransaction(), gatewayCommunication: GatewayCommunication = new GatewayCommunication()): Observable<Array<any>> {
    return this.apiService.post('GetPaymentRequestDetails', transactionDetails,).pipe(take(1), flatMap(response => {

      if (response === null) return of(null);
      gatewayTransaction.AccountId = transactionDetails.CustomerBillingAccountID;
      gatewayTransaction.OrderId = transactionDetails.OrderGeneratedID;
      gatewayTransaction.TransactionId = _.get(response, 'transaction_uuid');
      gatewayTransaction.ProfileId = _.get(response, 'profile_id');
      gatewayTransaction.TransactionType = _.defaultTo(_.get(gatewayTransaction, 'TransactionType'), 'Capture');
      gatewayTransaction.RequestDate = _.get(response, 'signed_date_time');
      gatewayTransaction.Status = _.defaultTo(_.get(gatewayTransaction, 'Status'), 'Pending');
      return this.gatewayTransactionService.create([gatewayTransaction], true).pipe(take(1), flatMap(gtResponse => {
        gatewayCommunication.GatewayTransactionId = _.get(gtResponse, '[0].Id');
        gatewayCommunication.Payload = JSON.stringify(response);
        gatewayCommunication.PayloadType = _.defaultTo(_.get(gatewayTransaction, 'PayloadType'), 'Request');
        gatewayCommunication.CommunicationDate = response['signed_date_time'];
        gatewayCommunication.Type = _.defaultTo(_.get(gatewayTransaction, 'Type'), 'Payment Method Request');
        return this.gatewayCommunicationService.create([gatewayCommunication], true).pipe(flatMap(() => {
          return of([response, gatewayCommunication.GatewayTransactionId]);
        }));
      }));

    }));
  }
  /**
   * This method is responsible for fetching active cards for payment based on the account id.
   * @param accountId the account Id value.
   * @returns List of details of pyment Method for the associated account Id.
   */
  getActiveCardsForAccount(accountId: string): Observable<Array<PaymentMethod>> {
    return this.apiService.get(`/Apttus_Billing__PaymentMethod__c?condition[0]=AccountId,Equal,${accountId}&condition[1]=Status,Equal,Active`, this.type);
  }

  /**
   * This is a silent method I-FRAME for payment
    * @param transactionDetails payment related transaction details
    * @param gatewayTransaction gateway transaction details to store
    * @param gatewayCommunication gateway communication details to store
   * @returns observable of array including object and gateway transaction string to trace payment response
   * To Do:
   */
  silentOrderPayment(transactionDetails: PaymentTransaction, gatewayTransaction: GatewayTransaction = new GatewayTransaction(), gatewayCommunication: GatewayCommunication = new GatewayCommunication()): Observable<Array<any>> {
    return this.getDefaultPaymentMethod(transactionDetails.CustomerBillingAccountID).pipe(take(1), flatMap(result => {
      transactionDetails.PaymentToken = result.TokenId;
      return this.apiService.post('GetSilentPaymentRequestDetails', transactionDetails).pipe(take(1), flatMap(response => {
        if (response === null) return of(null);

        gatewayTransaction.AccountId = transactionDetails.CustomerBillingAccountID;
        gatewayTransaction.OrderId = transactionDetails.OrderGeneratedID;
        gatewayTransaction.TransactionId = _.get(response, 'transaction_uuid');
        gatewayTransaction.ProfileId = _.get(response, 'profile_id');
        gatewayTransaction.TransactionType = _.defaultTo(_.get(gatewayTransaction, 'TransactionType'), 'Sale');
        gatewayTransaction.RequestDate = _.get(response, 'signed_date_time');
        gatewayTransaction.Status = _.defaultTo(_.get(gatewayTransaction, 'Status'), 'Pending');
        return this.gatewayTransactionService.create([gatewayTransaction], true).pipe(take(1), flatMap(gtResponse => {

          gatewayCommunication.GatewayTransactionId = _.get(gtResponse, '[0].Id');
          gatewayCommunication.Payload = JSON.stringify(response);
          gatewayCommunication.PayloadType = _.defaultTo(_.get(gatewayTransaction, 'PayloadType'), 'Request');
          gatewayCommunication.CommunicationDate = response['signed_date_time'];
          gatewayCommunication.Type = _.defaultTo(_.get(gatewayTransaction, 'Type'), 'Payment Against Order');
          return this.gatewayCommunicationService.create([gatewayCommunication], true).pipe(flatMap(() => {
            return of([response, gatewayCommunication.GatewayTransactionId]);
          }));

        }));
      }));
    }));


  }

  /**
   * @ignore
   *To Do:
  */
  private getDefaultPaymentMethod(accountID): Observable<PaymentMethod> {
    // TODO: Replace with RLP API
    // let conditionList = [];
    // conditionList.push(new ACondition(this.type, 'AccountId', 'Equal', accountID));
    // conditionList.push(new ACondition(this.type, 'Status', 'Equal', 'Active'));
    // conditionList.push(new ACondition(this.type, 'IsDefault', 'Equal', true));
    // return this.where(conditionList, 'AND', null, null, null, null).pipe(take(1), flatMap((result) => {
    //   return result;
    // }));
    return null;

  }

}