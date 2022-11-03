import { CartService, Cart, AccountService, OrderService, PriceListService, CategoryService } from '@congacommerce/ecommerce';
import { ExceptionService } from '@congacommerce/elements';
import { OutputFieldComponent } from '@congacommerce/elements';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { get } from 'lodash';
import { createDate } from 'ngx-bootstrap/chronos/create/date-from-array';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActionBarComponent implements OnInit {

  cart$: Observable<Cart>;
  loading: boolean = false;
  

  @ViewChild('accountField', { static: false }) accountField: OutputFieldComponent;

  constructor(
    private cartService: CartService,
    private accountService: AccountService,
    private exceptionService: ExceptionService,
    private orderService: OrderService,
    private priclistService: PriceListService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef)
    { }

  ngOnInit() {  
    this.cart$ = this.cartService.getMyCart()
    .pipe(
      switchMap(cart => combineLatest([of(cart), get(cart,'OrderId') ? this.orderService.getOrder(get(cart, 'OrderId')) : of(null), this.accountService.getCurrentAccount()])),
      map(([cart, order, account]) => {
       // cart.Order = order;
        cart.Account = account;
        return cart;
      })
    );
  }

  changeAccount(x){
    this.accountService.setAccount(x, true).pipe(take(1))
    .subscribe(
      () => {
        this.cdr.markForCheck();
        this.exceptionService.showSuccess('ACTION_BAR.CHANGE_ACCOUNT_MESSAGE', 'ACTION_BAR.CHANGE_ACCOUNT_TITLE');
        this.accountField.handleHidePop();
      }
    );
  }

  createNewCart() {
    this.loading = true;
    this.cartService.createNewCart()
    .pipe(
      take(1),
      switchMap(cart => this.cartService.setCartActive(cart))
    )
    .subscribe(cart => {
      this.loading = false;
      this.exceptionService.showSuccess('ACTION_BAR.CART_CREATION_TOASTR_MESSAGE');
    },
    error => {
      this.loading = false;
      this.exceptionService.showError(error);
    });
  }

}
