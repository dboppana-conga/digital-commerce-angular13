import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { ClassType } from 'class-transformer/ClassTransformer';
import { BehaviorSubject, Subscription, combineLatest, of, Observable } from 'rxjs';
import { isNil, get, filter, slice, assign, defaultTo, forEach, isEmpty, every, some, keys, groupBy, remove, includes, isArray, map as rmap, set, find } from 'lodash';
import { debounce } from 'lodash-decorators';
import { map, take, catchError } from 'rxjs/operators';
import { AObject, MetadataService, AObjectService, ApiService } from '@congacommerce/core';
import { Product, AssetLineItem, CartItem, Cart, Order } from '@congacommerce/ecommerce';
import { ProductConfigurationSummaryComponent } from '../../product-configuration-summary/configuration-summary.module';
import { TableView, CheckState, TableGroup, TableOptions, TableAction, SortInfo } from './table.interface';
import { plainToClass } from 'class-transformer';

/**
 * Table component allows users to show list of AObject records in a grid view.
 * User can pass table options with list of fields to be displayed as table columns.
 * The table also provides more advanced features like data search, pagination, sortable columns, row selections with mass actions etc.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/table.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
```typescript
import { TableModule } from '@congacommerce/elements';
@NgModule({
  imports: [TableModule, ...]
})
export class AppModule {}
```
* @example
* // Basic usage.
 ```typescript
* <apt-table
*             [type]="aObjectType"
*             [options]="TableOptions"></apt-table>
 ```
*/
@Component({
  selector: 'apt-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnChanges, OnDestroy {

  @Input() type: ClassType<AObject>;
  /**
   *  Configuration options for the table component of type TableOptions 
   */
  @Input() options: TableOptions;
  /**
   * Reference to the product configuration summary component.
   * @ignore
   */
  @ViewChild('productConfigurationSummary', { static: false }) productConfigurationSummary: ProductConfigurationSummaryComponent;
  /**
   * Used to hold information for rendering the view.
   * @ignore
   */
  view$: BehaviorSubject<TableView> = new BehaviorSubject<TableView>(null);
  /**
   * Use for pagination.
   */
  page: number = 1;
  /**
   * Use for search data in table.
   */
  searchString: string;
  /** @ignore  */
  subscription: Subscription;
  /** Flag to determines Whether the AccordionItem is expanded for table data. */
  expanded: boolean = true;
  /** Use for sort the columns in table. */
  sortColumn: string;
  /** Use for sorting direction for the columns in table. */
  sortDirection: 'ASC' | 'DESC';
  /** Flag to check if data can grouped in the table . */
  disableGrouping: boolean = false;
  /** Array of selected data from table. */
  selectedRecords: Array<AObject> = [];
  /** Use to hold configuration data for a data in the table. */
  configProduct: Product;
  /** Use to hold configuration data for a data in the table. */
  relatedTo: CartItem | AssetLineItem;
  /** Use to to show popover after given number of character for data in the table. */
  maxCharacterLength = 20;
  /** Instance of service type of AobjectService
   * @ignore
   */
  private service: AObjectService;
  /** To hold previous searched string value while switiching window  */
  searchedStringValue: string = '';

  constructor(private metadataService: MetadataService, private cdr: ChangeDetectorRef, private apiService: ApiService) { }

  /**
   * @ignore
   */
  ngOnChanges() {
    if (isNil(this.type))
      throw new Error('An AObject type must be provided');

    const columnKeys = filter(slice(new this.type().getKeys(), 0, 10), o => o !== 'Name');
    columnKeys.unshift('Name');
    const columns = rmap(columnKeys, k => {
      return {
        prop: k
      };
    });
    this.service = this.metadataService.getAObjectServiceForType(this.type, true);
    this.options = assign({}, {
      columns: columns,
      stickyColumnCount: 1,
      limit: 10,
      defaultSort: {
        column: get(this.options, 'defaultSort.column', 'ModifiedDate'),
        direction: get(this.options, 'defaultSort.direction', 'DESC')
      } as SortInfo
    } as TableOptions, this.options);
    if (isNil(this.sortColumn)) this.sortColumn = get(this.options, 'defaultSort.column', 'ModifiedDate');
    if (isNil(this.sortDirection)) this.sortDirection = get(this.options, 'defaultSort.direction', 'DESC');
    this.loadData();
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    this.reset();
  }

  /**
   * @ignore
   */
  reset() {
    this.view$.next(assign({}, this.view$.value, {
      data: null,
      groupedData: null,
      groups: null,
      type: new this.type(),
      columns: slice(this.options.columns, this.options.stickyColumnCount),
      stickyColumns: slice(this.options.columns, 0, this.options.stickyColumnCount),
      page: this.page,
      limit: defaultTo(get(this, 'view$.value.limit'), this.options.limit),
      limitOptions: [this.options.limit, this.options.limit * 2, this.options.limit * 3, this.options.limit * 4]
    }));
  }

  /**
   * @ignore
   */
  @debounce(1000)
  loadDataDebounce(event) {
    if (this.searchedStringValue !== event.target.value) {
      this.searchedStringValue = event.target.value;
      this.loadData();
    }
  }

  /**
   * @ignore
   */
  loadData() {
    this.ngOnDestroy();
    const view = this.view$.value;
    let aggregateData;
    let queryparam = new URLSearchParams();
    const filters = get(this.options, 'filters', []);
    forEach(filters, (filter) => {
      filter.field && queryparam.append('filter', `${filter.filterOperator}(${filter.field}:'${filter.value}')`);
    });
    this.sortColumn ?
      this.sortColumn && queryparam.append('sort', `${defaultTo(this.sortDirection, 'ASC')}(${this.sortColumn})`) :
      this.options.defaultSort.column && queryparam.append('sort', `${defaultTo(this.options.defaultSort.direction, 'ASC')}(${this.options.defaultSort.column})`);
    if (get(this.searchString, 'length') > 2)
      this.searchString && queryparam.append('filter', `LIKE(Name:'${this.searchString.trim()}')`);
    const params = isEmpty(queryparam.toString()) ? '' : `${queryparam.toString()}`;
    const relativePath = this.metadataService.getRestResource(this.type);
    const dataQuery$ = this.apiService.get(`/${relativePath}?${params}&Page=${this.page}&limit=${view.limit}`,null,true,false)//to stop toaster messages from api service
      .pipe(
        map(result => {
          aggregateData = get(result, 'TotalCount');
          return plainToClass(this.type, result, { excludeExtraneousValues: true }) as unknown as Array<AObject>;;
        }),
        catchError(error => {
          return of(null)
        }));
    const describeQuery$ = this.service.describe(this.type);
    this.subscription = combineLatest([dataQuery$, describeQuery$])
      .subscribe(([recordData, describe]) => {
        // Set the actions on each of the records
        if (!isEmpty(get(this, 'options.actions'))) {
          forEach(recordData, record => {
            record.set('actions', filter(get(this.options, 'actions'), a => a.validate(record, null)));
          });

          this.options.selectItemsInGroupFunc && this.options.selectItemsInGroupFunc(recordData);
        }
        this.view$.next(assign({}, view, {
          groupedData: !isNil(this.options.groupBy) ? groupBy(recordData, this.options.groupBy) : null,
          data: defaultTo(recordData, []),
          totalRecords: aggregateData,
          childRecords: {},
          route: `/${defaultTo(get(this, 'options.routingLabel'), get(describe, 'DisplayName', '')).toLowerCase()}`,
          label: get(describe, 'DisplayName', 'Records'),
          groups: !isNil(this.options.groupBy)
            ? rmap(keys(groupBy(recordData, this.options.groupBy)), groupName => {
              return {
                state: CheckState.UNCHECKED,
                label: groupName
              };
            })
            : null
        }));
        this.updateView();
      });
  }

  /**
   * @ignore
   */
  onLimitChange() {
    this.loadData();
  }

  /**
   * @ignore
   */
  onPageChange(evt) {
    if (this.page !== evt.page) {
      this.page = evt.page;
      this.cdr.detectChanges();
      this.loadData();
    }
  }

  /**
   * @ignore
   */
  trackById(index, record) {
    return get(record, 'Id');
  }

  /**
   * Updates the selected records array with the currently selected records in the table.
   * @param state The check state of the record being updated.
   * @param record The record being updated.
   */
  updateSelectedRecordList(state: CheckState, record: AObject) {
    const massActions = this.getMassActions(record);
    if (state === CheckState.CHECKED && !includes(rmap(this.selectedRecords, r => get(r, 'Id')), get(record, 'Id'))) {
      // Add records to the selection only if it has mass action enabled.
      if (!isEmpty(massActions)) {
        this.selectedRecords.push(record);
      }
    }
    else if (state === CheckState.UNCHECKED) {
      remove(this.selectedRecords, r => get(r, 'Id') === get(record, 'Id'));
    }
  }

  /**
   * @ignore
   */
  toggleAll(event: any) {
    event.target.checked = false;
    const view = this.view$.value;
    let newState;
    // If main checkbox is unchecked or indeterminate with not every record on the current page with actions selected.
    if (view.checkState === CheckState.UNCHECKED || (view.checkState === CheckState.INDETERMINATE && !every(rmap(filter(view.data, record => get(this.getMassActions(record), 'length') > 0), r => r.Id), id => includes(rmap(this.selectedRecords, r => r.Id), id))))
      newState = CheckState.CHECKED;
    // Else if main checkbox is checked or indeterminated with every record on the current page with actions selected.
    else if (view.checkState === CheckState.CHECKED || (view.checkState === CheckState.INDETERMINATE && every(rmap(filter(view.data, record => get(this.getMassActions(record), 'length') > 0), r => r.Id), id => includes(rmap(this.selectedRecords, r => r.Id), id))))
      newState = CheckState.UNCHECKED;
    forEach(get(view, 'groups'), g => g.state = newState);
    forEach(get(view, 'data'), d => {
      if (get(this.getMassActions(d), 'length') > 0) {
        d.set('state', newState);
        this.updateSelectedRecordList(newState, d);
      }
    });
    // If selected records are less than the total in the table set main checkbox to indeterminate.
    if (this.selectedRecords.length < get(view, 'totalRecords'))
      event.target.indeterminate = this.selectedRecords.length === 0 ? false : true;
    // Else if all records in the table are selected set the main checkbox to checked.
    else if (this.selectedRecords.length === get(view, 'totalRecords'))
      event.target.checked = true;
    this.updateView();
  }

  /**
   * @ignore
   */
  toggleRecord(record: AObject, group?: TableGroup) {
    const view = this.view$.value;
    const state = record.get('state') === CheckState.CHECKED ? CheckState.UNCHECKED : CheckState.CHECKED;
    record.set('state', state);
    this.updateSelectedRecordList(state, record);

    if (!isNil(group)) {
      const groupedData = get(view, `groupedData.${group.label}`);

      if (every(groupedData, child => child.get('state') === CheckState.CHECKED))
        group.state = CheckState.CHECKED;
      else if (some(groupedData, child => child.get('state') === CheckState.CHECKED))
        group.state = CheckState.INDETERMINATE;
      else
        group.state = CheckState.UNCHECKED;
    }
    this.updateView();
  }

  /**
   * @ignore
   */
  toggleGroup(group: TableGroup) {
    const view = this.view$.value;
    const state = group.state === CheckState.CHECKED ? CheckState.UNCHECKED : CheckState.CHECKED;
    group.state = state;

    forEach(get(view, `groupedData.${group.label}`), r => {
      r.set('state', state);
      this.updateSelectedRecordList(state, r);
    });
    this.updateView();
  }

  /**
   * @ignore
   */
  updateView(): void {
    const view = this.view$.value;
    // Add any checked record to the selectedRecords array. This handles programmatically checked records.
    forEach(filter(view.data, d => d.get('state') === CheckState.CHECKED), checkedRecord => {
      if (!includes(rmap(this.selectedRecords, rec => get(rec, 'Id')), get(checkedRecord, 'Id')))
        this.selectedRecords.push(checkedRecord);
    });
    // Select records that are in the selected records list
    forEach(view.data, r => {
      if (includes(rmap(this.selectedRecords, rec => get(rec, 'Id')), get(r, 'Id')))
        r.set('state', CheckState.CHECKED);
    });

    // Check the main checkbox based on the state of the selected records.
    if (this.selectedRecords.length === 0)
      view.checkState = CheckState.UNCHECKED;
    else if (this.selectedRecords.length < get(view, 'totalRecords'))
      view.checkState = CheckState.INDETERMINATE;
    else if (this.selectedRecords.length === get(view, 'totalRecords'))
      view.checkState = CheckState.CHECKED;
    // Check the groups based on the state of the selected records.
    forEach(keys(get(view, 'groupedData')), key => {
      if (every(rmap(get(view.groupedData, key), record => get(record, 'Id')), id => includes(rmap(this.selectedRecords, r => get(r, 'Id')), id)))
        set(find(get(view, 'groups'), { label: key }), 'state', CheckState.CHECKED);
      else if (some(rmap(get(view.groupedData, key), record => get(record, 'Id')), id => includes(rmap(this.selectedRecords, r => get(r, 'Id')), id)))
        set(find(get(view, 'groups'), { label: key }), 'state', CheckState.INDETERMINATE);
    });

    view.selectedItemCount = this.selectedRecords.length;

    view.totalPages = view.totalRecords? Math.ceil(view.totalRecords / view.limit): 1;

    view.pageStats = {
      minVal: view.totalRecords > 0 ? ((view.page - 1) * view.limit + 1) : 0,
      maxVal: ((view.limit * view.page) >= view.totalRecords) ? view.totalRecords : (view.limit * view.page),
      totalVal: view.totalRecords? view.totalRecords : 0
    };

    view.actions = filter(get(this.options, 'actions'), 'massAction');
    forEach(
      view.actions, a => {
        a.enabled = this.selectedRecords.length > 0 && every(this.selectedRecords, a.validate);
      }
    );
  }

  /**
   * This methods sorts the table column.
   * @param column referenced by the table.
   */
  sort(column: string): void {
    if (this.sortColumn === column)
      this.sortDirection = (this.sortDirection === 'ASC') ? 'DESC' : 'ASC';
    else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }
    this.loadData();
  }

  /**
   * Executes row action or mass action on selected table record(s).
   * @param action table action on the record(s) to be executed.
   * @param record list of selected table records.
   */
  executeAction(action: TableAction, record: AObject | Array<AObject>): void {
    if (isArray(record) && action.massAction) {
      const selectedItems = filter(record, d => d.get('state') === CheckState.CHECKED);
      forEach(record, r => r.set('state', 'processing'));
      action.enabled = false;
      if (every(selectedItems, action.validate)) {
        const obsv$ = action.action(selectedItems);
        obsv$.pipe(take(1)).subscribe(() => {
          forEach(record, r => r.set('state', 'ready'));
          if (!action.disableReload)
            this.loadData();
        });
        const view = this.view$.value;
        this.selectedRecords = [];
        view.selectedItemCount = this.selectedRecords.length;
      }
    } else if (!isArray(record) && record instanceof AObject) {
      record.set('state', 'processing');
      const childRecords = this.view$.value.childRecords as Array<AObject>;
      if (action.validate(record, childRecords)) {
        const obsv$ = action.action([record]);
        obsv$.pipe(take(1)).subscribe(() => {
          record.set('state', 'ready');
          if (!action.disableReload)
            this.loadData();
          else
            this.updateView();
        });
      }
    }
  }

  /**
   * @ignore
   */
  canHighlightRow(record: AObject): Observable<boolean> {
    return this.options.highlightRow ? this.options.highlightRow(record) : of(false);
  }

  /**
   * Opens the product configuration summary modal with the given product.
   * @param product The product referenced by the configuration modal.
   * @param relatedTo Cart item or asset item.
   */
  openModal(product: Product, relatedTo: CartItem | AssetLineItem) {
    this.configProduct = product;
    this.relatedTo = relatedTo;
    setTimeout(() => { this.productConfigurationSummary.show(); });
  }

  /**
   * @ignore
   */
  showCheckbox(record) {
    const massActions = this.getMassActions(record);
    return !isEmpty(massActions);
  }

  /**
   * @ignore
   */
  getMassActions(record) {
    return filter(record.get('actions'), record => record.massAction);
  }
}