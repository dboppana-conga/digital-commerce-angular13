import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable, zip, of, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { get } from 'lodash';
import { AccountService, ContactService, UserService, Quote, QuoteService, PriceListService , Cart, Note, Account, Contact, PriceList } from '@congacommerce/ecommerce';
import { LookupOptions } from '@congacommerce/elements';

import * as moment from 'moment';
@Component({
  selector: 'app-request-quote-form',
  templateUrl: './request-quote-form.component.html',
  styleUrls: ['./request-quote-form.component.scss']
})
export class RequestQuoteFormComponent implements OnInit {
  @Input() cart: Cart;
  @Output() onQuoteUpdate = new EventEmitter<Quote>();

  quote = new Quote();
  bsConfig: Partial<BsDatepickerConfig>;
  startDate: Date = new Date();
  rfpDueDate: Date = new Date();
  _moment = moment;
  note: Note = new Note();
  comments: any = [];

  shipToAccount$: Observable<Account>;
  billToAccount$: Observable<Account>;
  priceList$:Observable<PriceList>;
  lookupOptions: LookupOptions = {
    primaryTextField: 'Name',
    secondaryTextField: 'Email',
    fieldList: ['Id', 'Name', 'Email']
  };
  contact: string;

  constructor(public quoteService: QuoteService,
    private accountService: AccountService,
    private userService: UserService,
    private plservice:PriceListService,
    private contactService: ContactService) { }

  ngOnInit() {
    this.quote.Name = 'Test';
    combineLatest(this.accountService.getCurrentAccount(), this.userService.me(),(this.cart.Proposald? this.quoteService.getQuoteById(get(this.cart, 'Proposald.Id')) : of(null)))
    .pipe(take(1)).subscribe(([account, user, quote]) => {
        this.quote.ShipToAccount = account;
        this.quote.BillToAccount = account;
        this.quote.Account= get(this.cart,'Account');
        this.quote.PrimaryContact = get(user, 'Contact');
        this.contact = this.cart.Proposald?  get(quote[0],'PrimaryContact.Id') : get(user, 'Contact.Id');
        if(get(this.cart, 'Proposald.Id')) {
          this.quote = get(this.cart, 'Proposal');
          this.comments = get(quote, '[0].Notes', []);
        }
        this.quoteChange();
        this.getpriceList();
      });
  }

  /**
   * This method adds comments to requesting quote.
   */
  addComment() {
    if (this.quote) {
      this.quote.Description = this.note.Description;
      this.onQuoteUpdate.emit(this.quote);
    }
  }

  /**
   * @ignore
   */
  quoteChange() {
    this.onQuoteUpdate.emit(this.quote);
  }

  shipToChange() {
    this.shipToAccount$ = this.accountService.getAccount(this.quote.ShipToAccount.Id);
    this.shipToAccount$.pipe(take(1)).subscribe((newShippingAccount) => {
      this.quote.ShipToAccount = newShippingAccount;
      this.onQuoteUpdate.emit(this.quote);
    });
  }

  billToChange() {
    this.billToAccount$ = this.accountService.getAccount(this.quote.BillToAccount.Id);
    this.billToAccount$.pipe(take(1)).subscribe((newBillingAccount) => {
      this.quote.BillToAccount = newBillingAccount;
      this.onQuoteUpdate.emit(this.quote);
    });

  }
  getpriceList(){
    this.priceList$=this.plservice.getPriceList();
    this.priceList$.pipe(take(1)).subscribe((newPricelList) => {
      this.quote.PriceList = newPricelList;
      this.onQuoteUpdate.emit(this.quote);
    });
  }
 /**
   * Event handler for when the primary contact input changes.
   * @param event The event that was fired.
   */
  primaryContactChange() {    
    this.contactService.fetch(get(this.contact,'Id'))
      .pipe(take(1))
      .subscribe((newPrimaryContact: Contact) => {
        this.quote.PrimaryContact = newPrimaryContact;
        this.onQuoteUpdate.emit(this.quote);
      });
  }

}