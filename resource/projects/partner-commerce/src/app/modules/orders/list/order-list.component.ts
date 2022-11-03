import { Component, OnInit, OnDestroy } from '@angular/core';
import { of, Observable, Subscription, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { switchMap, take, map as _map, catchError } from 'rxjs/operators';
import { clone, assign, get, isArray, groupBy, sumBy, omit, zipObject, mapValues, map, forEach, isEmpty } from 'lodash';
import { Operator, ApiService, FilterOperator } from '@congacommerce/core';
import { OrderService, Order, AccountService, FieldFilter } from '@congacommerce/ecommerce';
import { TableOptions, FilterOptions, ExceptionService } from '@congacommerce/elements';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  type = Order;

  totalRecords$: Observable<number>;
  totalAmount$: Observable<number>;
  ordersByStatus$: Observable<number>;
  orderAmountByStatus$: Observable<number>;
  subscription: Subscription;

  colorPalette = ['#D22233', '#F2A515', '#6610f2', '#008000', '#17a2b8', '#0079CC', '#CD853F', '#6f42c1', '#20c997', '#fd7e14'];


  view$: Observable<OrderListView>;

  filterList$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

  filterOptions: FilterOptions = {
    visibleFields: [
      'BillToAccount',
      'Status',
      'OrderAmount',
      'CreatedDate'
    ],
    visibleOperators: [
      Operator.EQUAL,
      Operator.LESS_THAN,
      Operator.GREATER_THAN,
      Operator.GREATER_EQUAL,
      Operator.LESS_EQUAL,
      Operator.IN
    ]
  };

  constructor(private orderService: OrderService, private accountService: AccountService, private apiService: ApiService, private exceptionService: ExceptionService) { }

  ngOnInit() {
    this.loadView();
  }

  loadView() {
    let tableOptions= {} as OrderListView;
    this.view$ = this.accountService.getCurrentAccount()
      .pipe(
        switchMap(res => {
          tableOptions= {
              tableOptions: {
              columns: [
                {
                  prop: 'Name',
                  label: 'CUSTOM_LABELS.ORDER_NUMBER'
                },
                {
                  prop: 'Description',
                  label: 'CUSTOM_LABELS.TITLE'
                },
                {
                  prop: 'Status'
                },
                {
                  prop: 'PriceList.Name',
                  label: 'CUSTOM_LABELS.PRICELIST'
                },
                {
                  prop: 'BillToAccount.Name',
                  label: 'CUSTOM_LABELS.BILL_TO'
                },
                {
                  prop: 'ShipToAccount.Name',
                  label: 'CUSTOM_LABELS.SHIP_TO'
                },
                {
                  prop: 'OrderAmount'
                },
                {
                  prop: 'CreatedDate'
                },
                {
                  prop: 'ActivatedDate'
                }
              ],
              fields: [
                'Description',
                'Status',
                'PriceList.Name',
                'BillToAccount.Name',
                'ShipToAccount.Name',
                'OrderAmount',
                'CreatedDate',
                'ActivatedDate'
              ],
              filters: this.filterList$.value.concat(this.getFilters()),
              routingLabel: 'orders'
            }
          }
        return  this.orderService.getAllOrders(this.filterList$.value.concat(this.getFilters()))
  }),
        _map(data => {
          this.totalRecords$ = of(get(data, 'TotalCount', sumBy(data, 'TotalCount')));
          this.totalAmount$ = of(get(data, 'OrderAmount.DisplayValue', sumBy(data, 'OrderAmount.DisplayValue')));
          this.ordersByStatus$ = of(
            isArray(data)
              ? omit(mapValues(groupBy(data, 'Apttus_Config2__Status__c'), s => sumBy(s, 'total_records')), 'null')
              : zipObject([get(data, 'Apttus_Config2__Status__c')], map([get(data, 'Apttus_Config2__Status__c')], key => get(data, 'total_records')))
          ) as unknown as Observable<number>;
          this.orderAmountByStatus$ = of(
            isArray(data)
              ? omit(mapValues(groupBy(data, 'Apttus_Config2__Status__c'), s => sumBy(s, 'SUM_OrderAmount')), 'null')
              : zipObject([get(data, 'Apttus_Config2__Status__c')], map([get(data, 'Apttus_Config2__Status__c')], key => get(data, 'SUM_OrderAmount')))
          ) as unknown as Observable<number>;
          return tableOptions;
        }, take(1)),
        catchError(error => {
          this.totalRecords$ = of(0);
          this.totalAmount$ = of(0);
          this.exceptionService.showError(error,'ERROR.INVALID_REQUEST_ERROR_TOASTR_TITLE');
          this.view$= of(tableOptions);
          return of(error)
        }));
  }

  handleFilterListChange(event: any) {
    this.filterList$.next(event);
    this.loadView();
  }

  getFilters(): Array<FieldFilter> {
    return [
      {
        field: 'SoldToAccount.Id',
        value: localStorage.getItem('account'),
        filterOperator: FilterOperator.EQUAL
      }] as Array<FieldFilter>;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}

/** @ignore */
interface OrderListView {
  tableOptions: TableOptions;
}