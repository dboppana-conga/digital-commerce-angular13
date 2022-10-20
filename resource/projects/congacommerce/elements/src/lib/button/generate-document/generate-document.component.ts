import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take, switchMap } from 'rxjs/operators';
import { forEach, defaultTo, get, cloneDeep, set } from 'lodash';
import { ApiService } from '@congacommerce/core';
import { Template, TemplateService, Order, Quote, QuoteService, GenerateDocument, AccessLevel, OrderService, EmailService } from '@congacommerce/ecommerce';
import { ExceptionService } from '../../../shared/services/exception.service';
/**
 * <strong>This component is a work in progress.</strong>
 * 
 * The Generate-document component is used to generate the document for a custom Order.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/generateDocumentButton.png" style="max-width: 100%">
 * <h3>Usage</h3>
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
* <apt-generate-document
*              [record]="order"
* ></apt-generate-document>
```
*/
@Component({
  selector: 'apt-generate-document',
  templateUrl: './generate-document.component.html',
  styles: []
})
export class GenerateDocumentComponent implements OnInit {

  /**
   * Reference to the generate document template in the view.
   * @ignore
   */
  @ViewChild('docGenTemplate') docGenTemplate: TemplateRef<any>;
  /** 
   * The input record is used for details of order or quote, doc need to generate for 
   */
  @Input() record: Order | Quote;
  /**
   * Event emitter for update of generated document.
   */
  @Output() onStatusUpdate: EventEmitter<any> = new EventEmitter<any>();

  /** refrence for modal dialog */
  modalRef: BsModalRef;

  /** two-way data binding object. */
  generateDocObj = {
    templateId: null,
    format: null
  };

  /** picklist values for templates */
  templateList = [];

  /** picklist values for formats */
  formatList = ['PDF', 'DOC'];

  /** @igore */
  disableGenFormBtn: boolean = false;
  disableGenModalBtn: boolean = true;
  type: string;

  constructor(private quoteService: QuoteService, private modalService: BsModalService,
    private templateService: TemplateService,
    private exceptionService: ExceptionService,
    private apiService: ApiService,
    private orderService: OrderService,
    private emailService: EmailService) { }

  ngOnInit() {
    if (this.record) {
      this.type = (this.record instanceof Order) ? 'Order' : 'Quote'
      // TO DO:
      // this.templateService.getActiveTemplates(this.record.getApiName()).subscribe((temp: Array<Template>) => {
      //   forEach(temp, item => {
      //     this.templateList.push({
      //       name: item.Name,
      //       id: item.Id
      //     });
      //   });
      // });
    }
  }

  /**
   * @ignore
   */
  onChange() {
    this.disableGenModalBtn = true;
    if (defaultTo(this.generateDocObj.templateId, null) && defaultTo(this.generateDocObj.format, null)) {
      this.disableGenModalBtn = false;
    }
  }

  /**
  * To open the modal dialog
  *
  */
  openModal() {
    this.modalRef = this.modalService.show(this.docGenTemplate);
  }

  /**
   * Method gets invoked on click of Generate button
   * which calls generateDocument method to create custom document for order/quote
   */
  generateDocument() {
    this.disableGenFormBtn = true;
    const req: GenerateDocument = {
      templateId: get(this.generateDocObj, 'templateId.id'),
      recordId: this.record.Id,
      sObjectType: null, // TO DO: this.record.getApiName(),
      format: this.generateDocObj.format,
      accessLevel: AccessLevel.FULL_ACCESS,
      sessionId: get(this.apiService, 'connection.accessToken'),
      isDraft: false
    };
    this.modalRef.hide();
    this.exceptionService.showInfo('INFO.GENERATE_INFO');
    this.quoteService.generateDocument(req)
      .pipe(
        switchMap(() => {
          const orderRecord = cloneDeep(this.record);
          set(orderRecord, 'Status', 'Generated');
          if (this.record instanceof Order) {
            return this.orderService.update([orderRecord]);
          } else {
            return this.quoteService.update([orderRecord]);
          }
        }),
        take(1)
      ).subscribe(() => {
        this.exceptionService.showSuccess('SUCCESS.GENERATED', 'SUCCESS.DOCUMENT_GENERATED_TITLE');
        this.disableGenFormBtn = false;
        const primaryContactId = get(this.record, 'PrimaryContactId');
        this.emailService.orderStatusChangeNotification('CustomerOrderEmailNotificationsTemplate', this.record.Id, primaryContactId).pipe(take(1)).subscribe();
        this.onStatusUpdate.emit();
      });
  }
}
