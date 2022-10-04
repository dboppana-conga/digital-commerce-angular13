import { AObjectService, AObject } from '@congacommerce/core';
import { Observable } from 'rxjs';
import { MailContent, TemplateMailFactory } from '../classes/index';
import { User } from '../classes/index';
import { Injectable } from '@angular/core';

/**
 * @ignore
 * The email service provides methods for interacting with the emails of the current user has access to.
 */
@Injectable({
    providedIn: 'root'
})


export class EmailService extends AObjectService {

    /**
     *  send email with the list of email content.
     *
     * @param emailContentList is an array of mail content having toAddress,ccAddressesa,replyTo and more.
     *
     * @returns an observable
     */
    public sendEmail(emailContentList: MailContent[]): Observable<any> {
        return this.apiService.post('sendEmail', emailContentList);
    }

    /**
     *  send email template
     *
     * @param templateName name of the template to be used.
     * @param to  which contact from the account to be used and Address to be used to send email.
     * @param what which account to be used.
     *
     * @returns an observable
     */

    public sendEmailTemplate(templateName: string, to: User, what: AObject): Observable<any> {
        let content = TemplateMailFactory(templateName, what.Id, to.Id, [to.Email]);
        return this.apiService.post('sendEmail', [
            content
        ]);
    }


    /**
     *  send email to address 
     * 
     * @param templateName name of the template to be used.
     * @param from which contact from the account to be used.
     * @param to  which Address to be used to send email.
     * @param what which account to be used.
     * 
     * @returns an observable
     */

    public sendEmailToAddress(templateName: string, from: User, to: string, what: AObject): Observable<any> {
        let content = TemplateMailFactory(templateName, what.Id, from.Id, [to]);
        return this.apiService.post('sendEmail', [
            content
        ]);
    }

    /**
     * Send email notification for new order to the guest user
     * @param orderId generated order Id.
     * @param orderURL order URL.
     * @returns an observable
     */
    //To DO:
    public guestUserNewOrderNotification(orderId: string, orderURL: string): Observable<any> {
        return this.apiService.post('guestUserNewOrderNotification', { orderId: orderId, ecommerceURL: orderURL });
    }

    /**
     * Send email notification on change status of the order
     * @param templateName name of the template to be used.
     * @param orderId generated order Id
     * @param recipentId which contact from the account to be used.
     * @param toAddresses  which Addresses to be used to send email.
     * @param ccAddresses  optional which Addresses to be used in cc to send email.
     * @param attachmentIds list of attachment Id
     * @returns an observable
    */
    orderStatusChangeNotification(templateName: string, orderId: string, recipentId: string, toAddresses?: string[], ccAddresses?: string[], attachmentIds?: string[]): Observable<any> {
        let content = TemplateMailFactory(templateName, orderId, recipentId, toAddresses, ccAddresses, attachmentIds);
        return this.apiService.post('sendEmail', {emailData: [content]});
    }
}