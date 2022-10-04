import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, zip, of } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { get, forEach, keyBy, remove, compact, values, merge, isNil } from 'lodash';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { plainToClass } from 'class-transformer';
import { AObjectService, ApiService } from '@congacommerce/core';
import { CartItem, CartService, StorefrontService } from '@congacommerce/ecommerce';
import { RevalidateCartModalComponent } from '../revalidate-cart-modal.component';

/**
 * Service that is used by the revalidate cart modal & alert components.
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
export class RevalidateCartService extends AObjectService {

  apiService: ApiService = this.injector.get(ApiService);
  protected cartService: CartService = this.injector.get(CartService);
  protected modalService: BsModalService = this.injector.get(BsModalService);
  protected storefrontService: StorefrontService = this.injector.get(StorefrontService);
  private state: BehaviorSubject<any> = new BehaviorSubject(null);
  modalRef: BsModalRef;

  onInit(){
    this.setRevalidateLines();
  }

  /**
   * Used to determine validation of cart line item based on the storefront flag is enable for revalidation 
   * and differentiate whether it is optional or required 
   */
  setRevalidateLines() {
      const storefront$ = this.storefrontService.getStorefront();
      const validate$ = this.apiService.get(`/carts/${CartService.getCurrentCartId()}/items/validate`);
      storefront$.pipe(
          switchMap(storefront => (get(storefront, 'EnableCartRevalidation') ? this.cartService.getMyCart() : of(null))),
          switchMap(res => !isNil(res) ? validate$ : of(null)),
          take(1)
      ).subscribe(validateRes => {
          if(validateRes){
            validateRes.optional = plainToClass(this.metadataService.getTypeByApiName('Apttus_Config2__LineItem__c'), get(validateRes,'optional'));
            validateRes.required = plainToClass(this.metadataService.getTypeByApiName('Apttus_Config2__LineItem__c'), get(validateRes, 'required'));
          }
          if(validateRes && validateRes.required.length > 0){
            const modalOptions: ModalOptions = {
              backdrop: 'static',
              keyboard: false,
              class: 'modal-lg'
            };
            this.openRevalidateModal(modalOptions);
          }
          this.state.next(validateRes as RevalidateLineItem);
      });
  }

  /**
   * get Revalidate lines
   */
  getRevalidateLines(): Observable<RevalidateLineItem> {
    return this.state;
  }

  /**
   * Apply Cart Revalidation
   */
  applyRevalidation(lineItemIds: Array<string>): Observable<boolean> {
    return zip(
      this.apiService.post(`/carts/${CartService.getCurrentCartId()}/items/validate`, lineItemIds),
      this.cartService.getMyCart()
    ).pipe(
      map(res => {
        if(!get(res[0], 'hasErrors')) {
          const updateLineItems = plainToClass(this.metadataService.getTypeByApiName('Apttus_Config2__LineItem__c'), get(res[0], 'updatedLines'));
          const deletedPrimaryLineNumber = get(res[0], 'deletedLineItems');

          // update cart status
          forEach(deletedPrimaryLineNumber, lineNumber => {
            remove(res[1].LineItems, { 'PrimaryLineNumber': lineNumber})
          })
          res[1].LineItems = compact(values(merge(keyBy(res[1].LineItems, 'Id'), keyBy(updateLineItems, 'Id'))));
          this.cartService.publish(res[1]);

          // to update status of revalidate lineitems
          const cart = this.state.value;
          forEach(deletedPrimaryLineNumber, lineNumber => {
            remove(cart.optional, { 'PrimaryLineNumber': lineNumber});
            remove(cart.required, { 'PrimaryLineNumber': lineNumber});
          })

          forEach(updateLineItems, li => {
            remove(cart.optional, { 'Id': get(li, 'Id') });
            remove(cart.required, { 'Id': get(li, 'Id') });
          })
          this.state.next(cart);
          return true;
        } else {
          return false;
        }
      }),
      tap(() => this.cartService.priceCart())
    );
  }

  /**
   * Open Revalidation Modal popup
   */
  public openRevalidateModal(modalOptions: ModalOptions): void {
    this.modalService.show(RevalidateCartModalComponent, modalOptions);
  }

}

/**@ignore  */
export interface RevalidateLineItem {
  optional: Array<CartItem>;
  required: Array<CartItem>;
}