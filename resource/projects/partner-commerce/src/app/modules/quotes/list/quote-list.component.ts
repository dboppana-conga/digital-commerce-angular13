import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map as _map, switchMap, take, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { get, sumBy, includes } from 'lodash';

import { TableOptions, CustomFilterView, FilterOptions, ExceptionService } from '@congacommerce/elements';
import { Quote, QuoteService, LocalCurrencyPipe, AccountService, FieldFilter, QuoteResult } from '@congacommerce/ecommerce';
import { Operator, ApiService, FilterOperator } from '@congacommerce/core';

/** @ignore */
const _moment = moment;
@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  type = Quote;

  totalAmount$: Observable<number>;
  amountsByStatus$: Observable<number>;
  totalRecords$: Observable<number>;
  quotesByStatus$: Observable<number>;
  quotesByDueDate$: Observable<number>;
  colorPalette: Array<String> = [];
  minDaysFromDueDate: number = 7;
  maxDaysFromDueDate: number = 14;
  view$: Observable<QuoteListView>;

  filterList$: BehaviorSubject<Array<FieldFilter>> = new BehaviorSubject<Array<FieldFilter>>([]);

  filterOptions: FilterOptions = {
    visibleFields: [
      'ApprovalStage',
      'CreatedDate',
      'RFPResponseDueDate',
      'GrandTotal',
      'BillToAccount',
      'ShipToAccount',
    ],
    visibleOperators: [
      Operator.EQUAL,
      Operator.NOT_EQUAL,
      Operator.IN,
      Operator.NOT_IN,
      Operator.LESS_THAN,
      Operator.LESS_EQUAL,
      Operator.GREATER_THAN,
      Operator.GREATER_EQUAL,
      Operator.LIKE
    ]
  };
  customfilter: Array<CustomFilterView> = [
    {
      label: 'Pending Duration',
      mapApiField: 'RFPResponseDueDate',
      type: 'double',
      minVal: -99,
      execute: (val: number, condition: any): Date => {
        return this.handlePendingDuration(val, condition);
      }
    }
  ];

  constructor(private quoteService: QuoteService, private currencyPipe: LocalCurrencyPipe, private accountService: AccountService, private apiService: ApiService, private exceptionService: ExceptionService) { }

  ngOnInit() {
    this.loadView();
  }

  loadView() {
    let tableOptions= {
      tableOptions: {
      columns: [
        {
          prop: 'Name',
          label: 'CUSTOM_LABELS.PROPOSAL_ID'
        },
        {
          prop: 'ProposalName'
        },
        {
          prop: 'ApprovalStage'
        },
        {
          prop: 'RFPResponseDueDate'
        },
        {
          prop: 'PriceList.Name',
          label: 'CUSTOM_LABELS.PRICELIST'
        },
        {
          prop: 'GrandTotal',
          label: 'CUSTOM_LABELS.TOTAL_AMOUNT',
          value: (record) => {
            return this.currencyPipe.transform(get(get(record, 'GrandTotal'), 'DisplayValue'));
          }
        },
        {
          prop: 'Account.Name',
          label: 'CUSTOM_LABELS.ACCOUNT'
        },
        {
          prop: 'ModifiedDate',
          label: 'CUSTOM_LABELS.LAST_MODIFIED_DATE'
        }
      ],
      children: ['ProposalSummaryGroups'],
      lookups: [
        {
          field: 'Account'
        },
        {
          field: 'PriceList'
        },
        {
          field: 'Opportunity'
        },
        {
          field: 'PrimaryContact'
        },
        {
          field: 'BillToAccount'
        },
        {
          field: 'ShipToAccount'
        },
        {
          field: 'Owner'
        }
      ],
      filters: this.filterList$.value.concat(this.getFilters()),
      routingLabel: 'proposals'
    }
    } as QuoteListView;
    this.view$ = this.accountService.getCurrentAccount()
      .pipe(
        switchMap(() => this.quoteService.getQuoteList(this.filterList$.value.concat(this.getFilters()))),
        _map((data) => {
          this.totalRecords$ = of(get(data, 'TotalRecord'));
          this.totalAmount$ = of(sumBy(get(data, 'QuoteList'), (quote) => get(quote, 'GrandTotal.Value')));
          /* TO DO : When Chart functionality implement.
          this.amountsByStatus$ = of(
            isArray(data)
              ? omit(mapValues(groupBy(data, 'Stage'), s => sumBy(s, 'NetPrice')), 'null')
              : zipObject([get(data, 'Stage')], map([get(data, 'Stage')], key => get(data, 'NetPrice'))),
          );
    
          this.quotesByStatus$ = of(
            isArray(data)
              ? omit(mapValues(groupBy(data, 'Apttus_Proposal__Approval_Stage__c'), s => sumBy(s, 'total_records')), 'null')
              : zipObject([get(data, 'Apttus_Proposal__Approval_Stage__c')], map([get(data, 'Apttus_Proposal__Approval_Stage__c')], key => get(data, 'total_records')))
          );
    
          const quotesDuedate = {};
          if (isArray(data)) {
            forOwn(omit(mapValues(groupBy(data, 'Apttus_Proposal__RFP_Response_Due_Date__c'), s => sumBy(s, 'total_records')), 'null'), (value, key) => {
              const label = this.generateLabel(key);
              if (has(quotesDuedate, label))
                value = quotesDuedate[label] + value;
              quotesDuedate[label] = value;
            });
          }
    
          this.quotesByDueDate$ = of(
            isArray(data)
              ? quotesDuedate
              : zipObject([get(data, 'Apttus_Proposal__RFP_Response_Due_Date__c')], map([get(data, 'Apttus_Proposal__RFP_Response_Due_Date__c')], key => get(data, 'total_records')))
          )
           */
          return tableOptions;
        }, take(1)),
        catchError(error => {
          this.totalRecords$ = of(0);
          this.totalAmount$ = of(0);
          this.exceptionService.showError(error,'ERROR.INVALID_REQUEST_ERROR_TOASTR_TITLE');
          this.view$= of(tableOptions);
          return of(error)
        })
      );
  }

  generateLabel(date): string {
    const today = moment(new Date());
    const dueDate = (date) ? moment(date) : null;
    if (dueDate && dueDate.diff(today, 'days') < this.minDaysFromDueDate) {
      if (!includes(this.colorPalette, 'rgba(208, 2, 27, 1)')) this.colorPalette.push('rgba(208, 2, 27, 1)');
      return '< ' + this.minDaysFromDueDate + ' Days';
    }
    else if (dueDate && dueDate.diff(today, 'days') > this.minDaysFromDueDate && dueDate.diff(today, 'days') < this.maxDaysFromDueDate) {
      if (!includes(this.colorPalette, 'rgba(245, 166, 35, 1)')) this.colorPalette.push('rgba(245, 166, 35, 1)');
      return '< ' + this.maxDaysFromDueDate + ' Days';
    }
    else {
      if (!includes(this.colorPalette, 'rgba(43, 180, 39, 1)')) this.colorPalette.push('rgba(43, 180, 39, 1)');
      return '> ' + this.maxDaysFromDueDate + ' Days';
    }
  }

  handleFilterListChange(event: any) {
    this.filterList$.next(event);
    this.loadView();
  }

  handlePendingDuration(val: number, condition: any): Date {
    const date = _moment(new Date()).format('YYYY-MM-DD');
    let momentdate;
    if (condition.filterOperator === 'GreaterThan')
      momentdate = _moment(date).add(val, 'd').format('YYYY-MM-DD');
    else if (condition.filterOperator === 'LessThan')
      momentdate = _moment(date).subtract(val, 'd').format('YYYY-MM-DD');
    return momentdate;
  }


  /**@ignore */
  getFilters(): Array<FieldFilter> {
    return [{
      field: 'Account.Id',
      value: localStorage.getItem('account'),
      filterOperator: FilterOperator.EQUAL
    }] as Array<FieldFilter>;
  }
}

/** @ignore */
interface QuoteListView {
  tableOptions: TableOptions;
}