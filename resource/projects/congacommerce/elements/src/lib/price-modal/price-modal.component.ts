import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { CartService } from '@congacommerce/ecommerce';

/**
 * Price Modal component can be used when pricing on cart fails for any reason.
 * <strong>This component is a work in progress.</strong>
 * User can choose to clear the cart or reprice it, from the modal.
 * <h3>Usage</h3>
 *
```typescript
import { PriceModalModule } from '@congacommerce/elements';
@NgModule({
  imports: [PriceModalModule, ...]
})
export class AppModule {}
```
* @example
```typescript
* <apt-price-modal></apt-price-modal>
```
*/
@Component({
  selector: 'apt-price-modal',
  templateUrl: './price-modal.component.html',
  styleUrls: ['./price-modal.component.scss']
})
export class PriceModalComponent implements OnInit {

  /**
   * Reference to the price modal template in the view.
   * @ignore
   */
  @ViewChild('priceModal') priceModalTemplate: TemplateRef<any>;
  /** 
   * Flag to show loader
   * @ignore
   */
  btnLoader: boolean = false;
  /** refrence for modal dialog */
  modalRef: BsModalRef;

  constructor(public cartService: CartService, private modalService: BsModalService) { }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.cartService.getCartPriceStatus().pipe().subscribe((cartRes) => {
      if (cartRes)
        this.showPriceErrorModal();
      else
        this.closeModal();
    });
  }

  /**
   * Open price modal popup.
   */
  showPriceErrorModal() {
    this.modalRef = this.modalService.show(this.priceModalTemplate);
  }

  /**
   * Call price cart API of cart.service.
   */
  retryPrice(): void {
    this.cartService.priceCart();
    this.closeModal();
  }

  /**
   * Create new cart and set it active. After that close price error modal.
   */
  clearCart(): void {
    this.btnLoader = true;
    this.cartService.createNewCart().pipe(take(1))
      .subscribe(() => {
        this.btnLoader = false;
        this.closeModal();
      });
  }

  /**
   * Close price modal.
   */
  closeModal() {
    if (this.modalRef)
      this.modalRef.hide();
  }

}