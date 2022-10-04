import { Component, OnInit, OnDestroy } from '@angular/core';
import { forEach, filter, map, get, set, includes, remove, every, concat, isNil } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { AObject } from '@congacommerce/core';
import { Cart, CartItem, CartService } from '@congacommerce/ecommerce';
import { RevalidateCartService } from '../revalidate-cart-modal/services/revalidate-cart.service';

/** 
 * @ignore
 * Revalidate cart modal component is used for showing a modal window with all the cart items which need to be revalidated.
 * 
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/cartRevalidation.png" style="max-width: 100%">
 * 
 */
@Component({
  selector: 'apt-revalidate-cart-modal',
  templateUrl: './revalidate-cart-modal.component.html',
  styleUrls: ['./revalidate-cart-modal.component.scss']
})
export class RevalidateCartModalComponent implements OnInit, OnDestroy {

  /** List of oprtional cart items */
  optionalLines: Array<CartItem>;
  /** List of required cart items */
  requiredLines: Array<CartItem>;
  /** Flag defines whether validation is hard or soft */
  isHardRevalidation: boolean = false;
  /** To show message on card creation failure */
  message: string;
  /** Flag to show loader
   * @ignore 
   */
  loading: boolean = false;
  /**
   * Used to hold information for rendering the view.
   * @ignore
   */
  view$: BehaviorSubject<RevalidateTableView> = new BehaviorSubject<RevalidateTableView>(null);
  /** List of selected cart items */
  selectedRecords: Array<CartItem> = [];
  /** Flag to determine cart revalidated or not */
  hasError: boolean = false;
  /** Flag to disable hard validation cart line items */
  isDisabled: boolean = false;
  /** @ignore */
  subscription: Subscription;

  constructor(private cartService: CartService,
    private revalidateCartService: RevalidateCartService,
    private translateService: TranslateService,
    public modalRef: BsModalRef) { }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.subscription = this.revalidateCartService.getRevalidateLines().subscribe((res) => {
      if (res) {
        this.optionalLines = res.optional;
        this.requiredLines = res.required;

        // if any line item need to be revalidate then open revalidate modal popup
        if (this.requiredLines && this.requiredLines.length > 0) {
          this.isHardRevalidation = true;
          forEach(this.requiredLines, li => {
            li.set('state', CheckStatus.CHECKED);
            li.set('type', 'hard');
            this.selectedRecords.push(li);
          });
        }
        const totalLines = concat(this.requiredLines, this.optionalLines);
        this.isDisabled = this.selectedRecords.length === totalLines.length;

        this.view$.next({
          data: totalLines
        });

        this.updateView();
      }
    });
  }

  /*
   * @ignore
   */
  getProductName(li: CartItem): String {
    return (li.LineType === 'Product/Service') ? li.Product.Name : li.Option.Name;
  }

  /*
   * @ignore
   */
  updateRevalidateitemList(state: CheckStatus, record: CartItem) {
    if (state === CheckStatus.CHECKED && !includes(map(this.selectedRecords, 'Id'), get(record, 'Id')))
      this.selectedRecords.push(record);
    else if (state === CheckStatus.UNCHECKED)
      remove(this.selectedRecords, r => get(r, 'Id') === get(record, 'Id'));
  }

  /*
   * @ignore
   */
  updateView(): void {
    const view = this.view$.value;

    // Add any checked record to the selectedRecords array. This handles programmatically checked records.
    forEach(filter(view.data, d => d.get('state') === CheckStatus.CHECKED), checkedRecord => {
      if (!includes(map(this.selectedRecords, 'Id'), get(checkedRecord, 'Id')))
        this.selectedRecords.push(checkedRecord);
    });

    // Select records that are in the selected records list
    forEach(view.data, r => {
      if (includes(map(this.selectedRecords, 'Id'), get(r, 'Id')))
        r.set('state', CheckStatus.CHECKED);
    });

    // Check the main checkbox based on the state of the selected records.
    if (this.selectedRecords.length === 0)
      view.checkStatus = CheckStatus.UNCHECKED;
    else if (this.selectedRecords.length < get(view.data, 'length'))
      view.checkStatus = CheckStatus.INDETERMINATE;
    else if (this.selectedRecords.length === get(view.data, 'length'))
      view.checkStatus = CheckStatus.CHECKED;

  }

  /*
   * @ignore
   */
  trackById(index, record) {
    return get(record, 'Id');
  }

  /*
   * @ignore
   */
  toggleAllRecords(event: any) {
    event.target.checked = false;
    const view = this.view$.value;
    let newState;

    // If main checkbox is unchecked or indeterminate with not every record on the current page with actions selected.
    if (view.checkStatus === CheckStatus.UNCHECKED || view.checkStatus === CheckStatus.INDETERMINATE)
      newState = CheckStatus.CHECKED;
    // Else if main checkbox is checked or indeterminated with every record on the current page with actions selected.
    else if (view.checkStatus === CheckStatus.CHECKED)
      newState = CheckStatus.UNCHECKED;

    forEach(get(view, 'data'), d => {
      if (d.get('type') !== 'hard') {
        const state = (get(d, '_metadata.state', '') !== CheckStatus.CHECKED) ? newState : CheckStatus.UNCHECKED;
        d.set('state', state);
        this.updateRevalidateitemList(newState, d);
      }
    });

    // If selected records are less than the total in the table set main checkbox to indeterminate.
    if (this.selectedRecords.length < get(view, 'data', []).length)
      event.target.indeterminate = this.selectedRecords.length === 0 ? false : true;
    // Else if all records in the table are selected set the main checkbox to checked.
    else if (this.selectedRecords.length === get(view, 'data', []).length)
      event.target.checked = true;

    this.updateView();
  }

  /*
   * @ignore
   */
  toggleItem(item: CartItem) {
    const state = item.get('state') === CheckStatus.CHECKED ? CheckStatus.UNCHECKED : CheckStatus.CHECKED;
    item.set('state', state);
    this.updateRevalidateitemList(state, item);
    this.updateView();
  }

  /**
   * Apply Cart Revalidation.
   */
  applyRevalidation(): void {
    this.loading = true;
    const cartIds = map(this.selectedRecords, 'Id');
    this.revalidateCartService.applyRevalidation(cartIds).pipe(
      take(1)
    ).subscribe(res => {
      this.loading = false;
      if (res)
        this.modalRef.hide();
      else
        this.hasError = true;
    });
  }

  /**
   * Create Cart or Switch to Previous Cart.
   */
  switchCart(): void {
    const newCart: Cart = new Cart();
    this.cartService.createNewCart(newCart).pipe(
      take(1),
      tap(() => this.revalidateCartService.setRevalidateLines())
    ).subscribe(
      res => {
        this.closeModal();
      },
      err => {
        this.translateService.stream('MY_ACCOUNT.CART_LIST.CART_CREATION_FAILED').subscribe((val: string) => {
          this.message = val;
        });
      }
    );
  }

  /**
   * Close Revalidate cart modal.
   */
  closeModal() {
    this.modalRef.hide();
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    if (!isNil(this.subscription))
      this.subscription.unsubscribe();
  }

}

/** @ignore */
export enum CheckStatus {
  CHECKED = 'checked',
  INDETERMINATE = 'indeterminate',
  UNCHECKED = 'unchecked'
}

/**@ignore */
export interface RevalidateTableView {
  checkStatus?: CheckStatus;
  data: Array<CartItem>;
}

