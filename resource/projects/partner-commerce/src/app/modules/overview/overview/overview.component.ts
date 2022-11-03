import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription, combineLatest } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { clone, assign, sumBy, get, map as rmap } from 'lodash';
import { map } from 'rxjs/operators';
import { ApiService, FilterOperator } from '@congacommerce/core';
import { OrderService, Order, UserService, User, FieldFilter, AccountService } from '@congacommerce/ecommerce';
import { TableOptions } from '@congacommerce/elements';

import * as moment from 'moment';
const _moment = moment;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverViewComponent implements OnInit {

  type = Order;

  user$: Observable<User>;
  subscription: Subscription;
  totalOrderAmount$: Observable<number>;
  totalRecords$: Observable<number>;
  orderAmountByStatus$: Observable<number>;

  colorPalette = ['#D22233', '#F2A515', '#6610f2', '#008000', '#17a2b8', '#0079CC', '#CD853F', '#6f42c1', '#20c997', '#fd7e14'];

  view$: Observable<TableOptions>;


  /**
  * @ignore
  */
  constructor(private orderService: OrderService, private userService: UserService, private apiService: ApiService, private accountService: AccountService) { }

  /**
  * @ignore
  */
  ngOnInit() {
    this.loadView();
  }

  loadView() {
    this.view$ = this.accountService.getCurrentAccount().pipe(
      switchMap((account) => {
        return combineLatest([
          of(account),
          this.userService.getCurrentUser(),
          this.orderService.getAllOrders(this.getFilters()),
          this.orderService.getAllOrders(this.getFilterForAmount())
        ]);
      }),
      map(([account, user, data, totaldata]) => {
        this.user$ = of(user)
        this.totalRecords$ = data? of(get(data, 'TotalCount')): of(0);
        this.totalOrderAmount$ = of(get(totaldata, 'OrderAmount.DisplayValue', sumBy(totaldata, 'OrderAmount.DisplayValue')));
        // this.orderAmountByStatus$ = of(
        //   isArray(recentOrders)
        //   ? omit(mapValues(groupBy(recentOrders, 'Apttus_Config2__Status__c'), s => sumBy(s, 'SUM_OrderAmount')), 'null')
        //   : zipObject([get(recentOrders, 'Apttus_Config2__Status__c')], rmap([get(recentOrders, 'Apttus_Config2__Status__c')], key => get(recentOrders, 'SUM_OrderAmount')))
        // )// TODO: Add this when charts are supported
        //})
        //.subscribe(); // TODO When charts are supported
        return {
          tableOptions: {
            columns: [
              {
                prop: 'Name',
                label: 'CUSTOM_LABELS.ORDER_NUMBER'
              },
              {
                prop: 'OrderAmount'
              },
              {
                prop: 'CreatedDate'
              }
            ],
            filters: this.getFilters(),
            routingLabel: 'orders'
          },
        } as TableOptions;
      }, take(1))
    );
  }

  /**@ignore */
  getFilters(): Array<FieldFilter> {
    return [{
      field: 'CreatedDate',
      value: _moment().format("YYYY-MM-DD"),
      filterOperator: FilterOperator.LESS_EQUAL
    },
    {
      field: 'CreatedDate',
      value: _moment().subtract(6, 'days').format("YYYY-MM-DD"),
      filterOperator: FilterOperator.GREATER_EQUAL
    },
    {
      field: 'SoldToAccount.Id',
      value: localStorage.getItem('account'),
      filterOperator: FilterOperator.EQUAL
    }
    ] as Array<FieldFilter>;
  }

  /**@ignore */
  getFilterForAmount(): Array<FieldFilter> {
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
