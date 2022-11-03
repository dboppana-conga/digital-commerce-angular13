import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map as rmap, take } from 'rxjs/operators';
import { filter, get, isNil } from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Cart, CartItem, CartService, ConstraintRuleService, LineItemService, Product, Order, Quote, ItemGroup, QuoteService } from '@congacommerce/ecommerce';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
/**
 * Manage Cart component is used to show the list of cart line item(s)  and summary of the cart.
 */
export class CartDetailComponent implements OnInit {
  @ViewChild('discardChangesTemplate') discardChangesTemplate: TemplateRef<any>;

  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;

  discardChangesModal: BsModalRef;
  /**
   * Observable of the information for rendering this view.
   */
  view$: Observable<ManageCartState>;
  /**
   * Quote Response Object Model
   */
  quoteConfirmation: Quote;
  /**
   * Stores confirmation model
   */
  confirmationModal: BsModalRef;
  loading: boolean = false;
  primaryLI: Array<CartItem> = [];

  constructor(private crService: ConstraintRuleService,
    private cartService: CartService,
    private quoteService: QuoteService,
    private modalService: BsModalService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.view$ = combineLatest([
      this.cartService.getMyCart(),
      of(null)])
      .pipe(
        rmap(([cart, products]) => {
          this.cdr.detectChanges();
          this.primaryLI = filter(get(cart, 'LineItems'), (i) => i.IsPrimaryLine && i.LineType === 'Product/Service');
          return {
            cart: cart,
            lineItems: LineItemService.groupItems(get(cart, 'LineItems')),
            orderOrQuote: isNil(get(cart, 'Order')) ? get(cart, 'Proposald') : get(cart, 'Order'),
            productList: products
          } as ManageCartState;
        })
      );
  }

  trackById(index, record): string {
    return get(record, 'MainLine.Id');
  }

  convertCartToQuote(quote: Quote) {
    this.quoteService.convertCartToQuote(quote).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        this.quoteConfirmation = res;
        this.ngZone.run(() => {
          this.confirmationModal = this.modalService.show(this.confirmationTemplate, { class: 'modal-lg' });
        });
      },
      err => {
        this.loading = false;
      }
    );
  }
}

/** @ignore */
export interface ManageCartState {
  cart: Cart;
  lineItems: Array<ItemGroup>;
  orderOrQuote: Order | Quote;
  productList: Array<Product>;
}