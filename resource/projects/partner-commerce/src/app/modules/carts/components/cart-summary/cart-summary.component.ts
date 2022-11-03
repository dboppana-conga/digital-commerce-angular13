import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges } from '@angular/core';
import { Cart, StorefrontService, Storefront, UserService, CartService, ConstraintRuleService } from '@congacommerce/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
// import { SummaryState } from '../../../checkout/component/summary.component';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})

/**
 * Cart Summary Component shows the sub total of the cart also allows to apply promotions if promotion is enabled in the storefront.
 */

export class CartSummaryComponent implements OnInit, OnChanges {
  @Input() cart: Cart;
  @ViewChild('discardChangesTemplate') discardChangesTemplate: TemplateRef<any>;
  loading:boolean = false;
  discardChangesModal: BsModalRef;
  _cart: Cart;
  // state: SummaryState;
 /**
  * @ignore
  */
  // generatedQuote: Quote;
  isLoggedIn$: Observable<boolean>;
  hasErrors: boolean = true;
  /**
   * Gives the total amount of promotion applied to the cart
   */
  totalPromotions: number = 0;
  storefront$: Observable<Storefront>;
  /** @ignore */
  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;
  /** tax related local properties */
  showTaxPopUp: boolean = false;
  totalEstimatedTax: number = 0;
  taxPopHoverModal:BsModalRef;

  constructor(private modalService: BsModalService, private crService: ConstraintRuleService,
    private storefrontService: StorefrontService, private userService: UserService, private cartService: CartService) {
    // TO DO:
      // this.state = {
    //   configurationMessage: null,
    //   downloadLoading: false,
    //   requestQuoteMessage: null,
    //   requestQuoteLoading: false
    // };
  }

  ngOnInit() {
    this.isLoggedIn$ = of(true);
    this.crService.hasPendingErrors().subscribe(val => this.hasErrors = val);
    this.storefront$ = this.storefrontService.getStorefront();
  }

  ngOnChanges() {
    this.totalPromotions = ((this.cart && _.get(this.cart, 'LineItems.length') > 0)) ? _.sum(this.cart.LineItems.map(res => res.IncentiveAdjustmentAmount)) : 0;
  }
  /**
   * Method opens the discard changes confirmation modal dialog.
   */

  openDiscardChageModals() {
    this.discardChangesModal = this.modalService.show(this.discardChangesTemplate);
  }

}
