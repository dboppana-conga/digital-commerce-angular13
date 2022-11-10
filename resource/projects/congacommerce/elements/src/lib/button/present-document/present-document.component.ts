import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { get, set, isNil, first, orderBy } from 'lodash';
import { Order, Quote, QuoteService, OrderService, EmailService } from '@congacommerce/ecommerce';
import { ExceptionService } from '../../../shared/services/exception.service';
/**
 * <strong>This component is a work in progress.</strong>
 * 
 * The Present-document component is used to send out an email notification of the Orders to the customers.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/presentOrderButton.png" style="max-width: 100%">
 *  <h3>Usage</h3>
 *
 *```typescript
import { ButtonModule } from '@congacommerce/elements';

@NgModule({
  imports: [ButtonModule, ...]
})
export class AppModule {}
```
*
* @example
* // Basic Usage
```typescript
* <apt-present-document
*              [record]="order"
* ></apt-present-document>
```
*/

@Component({
    selector: 'apt-present-document',
    templateUrl: './present-document.component.html',
    styleUrls: ['./present-document.component.scss']
})
export class PresentDocumentComponent implements OnInit {

    /** @ignore */
    @ViewChild('presentDocTemplate') presentDocTemplate: TemplateRef<any>;
    /** @ignore */
    @Input() record: Order | Quote;

    /** flag to disable button */
    disablePresentAction: boolean = false;
    /** @ignore */
    disablePresentBtn: boolean = false;
    /** CC email for email notification */
    ccEmail: string = null;
    /** refrence for modal dialog */
    modalRef: BsModalRef;

    constructor(private quoteService: QuoteService, private modalService: BsModalService,
        private exceptionService: ExceptionService,
        private orderService: OrderService,
        private emailService: EmailService) { }

    /** @ignore */
    ngOnInit() {
        this.disablePresentBtn = isNil(get(this, 'record.PrimaryContactId'));
    }

    /** @ignore */
    onChange() {
        this.disablePresentBtn = isNil(get(this, 'record.PrimaryContactId'));
    }

    /**
    * To open the modal dialog
    */
    openModal() {
        this.modalRef = this.modalService.show(this.presentDocTemplate);
    }

    /**
     * Present document to primary contact of the record and email notification sent out.
     * Sets status of record to Presented.
     */
    presentDocument() {
        this.disablePresentAction = true;
        set(this.record, 'Status', 'Presented');
        if (this.record instanceof Order) {
            const primaryContactId = get(this.record, 'PrimaryContactId');
            this.orderService.update([this.record]).pipe(take(1)).subscribe((order) => {
                const attachmentId = get(first(orderBy(this.record.Attachments, ['LastModifiedDate'], ['desc'])), 'Id');
                this.exceptionService.showSuccess('SUCCESS.PRESENTED', 'SUCCESS.DOCUMENT_PRESENTED_TITLE', { primary_contact: get(order[0], 'PrimaryContact.Name') });
                this.emailService.orderStatusChangeNotification('CustomerOrderEmailNotificationsTemplate', this.record.Id, primaryContactId, null, get(this, 'ccEmail', null), (attachmentId ? [attachmentId] : null)).pipe(take(1)).subscribe();
            });
        } else {
            this.quoteService.update([this.record]).pipe(take(1)).subscribe((quote) => {
                this.exceptionService.showSuccess('SUCCESS.PRESENTED', 'SUCCESS.DOCUMENT_PRESENTED_TITLE', { primary_contact: get(quote[0], 'PrimaryContact.Name') });
            });
        }
        this.modalRef.hide();
    }
}
