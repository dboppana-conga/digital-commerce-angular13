import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { ClassType } from 'class-transformer/ClassTransformer';
import { first, get } from 'lodash';
import { AObject, ApiService, FilterOperator } from '@congacommerce/core';
import { CartService, Cart, Price, PriceService, CartResult, FieldFilter } from '@congacommerce/ecommerce';
import { TableOptions, TableAction } from '@congacommerce/elements';

/**
 * Cart list Component loads and shows all the carts for logged in user.
 */
@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  modalRef: BsModalRef;
  message: string;
  loading: boolean = false;
  cart: Cart;
  view$: Observable<CartListView>;
  cartAggregate$: Observable<any>;
  /** @ignore */
  type = Cart;

  /**
   * @ignore
   */
  constructor(private cartService: CartService, public priceService: PriceService,
    private modalService: BsModalService, private translateService: TranslateService, private apiService: ApiService) { }
  /**
   * @ignore
   */
  ngOnInit() {
    this.loadView();
  }
  /** @ignore */
  loadView() {
    this.getCartAggregate();
    this.view$ = this.cartService.getMyCart()
      .pipe(
        map((currentCart) => {
          return {
            tableOptions: {
              columns: [
                {
                  prop: 'Name'
                },
                {
                  prop: 'CreatedDate'
                },
                {
                  prop: 'NumberOfItems'
                },
                {
                  prop: 'IsActive',
                  label: 'CUSTOM_LABELS.IS_ACTIVE',
                  sortable: false,
                  value: (record: Cart) => CartService.getCurrentCartId() === record.Id ? of('Yes') : of('No')
                },
                {
                  prop: 'TotalAmount',
                  label: 'CUSTOM_LABELS.TOTAL_AMOUNT',
                  sortable: false,
                  value: (record: Cart) => this.getCartTotal(record)
                },
                {
                  prop: 'Status'
                }
              ],
              lookups: [],
              actions: [
                {
                  enabled: true,
                  icon: 'fa-check',
                  massAction: false,
                  label: 'Set Active',
                  theme: 'primary',
                  validate: (record: Cart) => this.canActivate(record),
                  action: (recordList: Array<Cart>) => this.cartService.setCartActive(first(recordList), true),
                  disableReload: true
                } as TableAction,
                {
                  enabled: true,
                  icon: 'fa-trash',
                  massAction: true,
                  label: 'Delete',
                  theme: 'danger',
                  validate: (record: Cart) => this.canDelete(record),
                  action: (recordList: Array<Cart>) => this.cartService.deleteCart(recordList).pipe(map(res => this.getCartAggregate())),
                  disableReload: true
                } as TableAction
              ],
              highlightRow: (record: Cart) => of(CartService.getCurrentCartId() === record.Id),
              children: ['SummaryGroups'],
              filters: this.getFilters()
            },
            type: Cart
          } as CartListView;
        })
      );
  }

  /** @ignore */
  private getCartAggregate(): Observable<CartResult> {
    return this.cartAggregate$ = this.cartService.getCartList(this.getFilters()).pipe(map(res => res));
  }

  /**
   * Creates new cart for logged in user based on input.
   * @param template Modal input for taking user inputs for new cart.
   */
  newCart(template: TemplateRef<any>) {
    this.cart = new Cart();
    this.message = null;
    this.modalRef = this.modalService.show(template);
  }

  /**
   * @ignore
   */
  createCart() {
    this.loading = true;
    this.cartService.createNewCart(this.cart).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        this.modalRef.hide();
        this.loadView();
      },
      err => {
        this.loading = false;
        this.translateService.stream('MY_ACCOUNT.CART_LIST.CART_CREATION_FAILED').subscribe((val: string) => {
          this.message = val;
        });
      }
    );
  }

  /**
   * This function returns Observable of NetPrice
   * @param currentCart Current cart object from where we need to fetch cart total.
   */
  getCartTotal(currentCart: Cart) {
    return this.priceService.getCartPrice(currentCart).pipe(mergeMap((price: Price) => price.netPrice$));
  }

  /**@ignore */
  canDelete(cartToDelete: Cart) {
    return (cartToDelete.Status !== 'Finalized');
  }

  /**@ignore */
  canActivate(cartToActivate: Cart) {
    return (CartService.getCurrentCartId() !== cartToActivate.Id && cartToActivate.Status !== 'Finalized');
  }

  /**@ignore */
  getFilters(): Array<FieldFilter> {
    return [{
      field: 'Account.Id',
      value: localStorage.getItem('account'),
      filterOperator: FilterOperator.EQUAL
    },
    {
      field: 'Status',
      value: 'Saved',
      filterOperator: FilterOperator.NOT_EQUAL
    }] as Array<FieldFilter>;
  }
}
/** @ignore */
interface CartListView {
  tableOptions: TableOptions;
  type: ClassType<AObject>;
}