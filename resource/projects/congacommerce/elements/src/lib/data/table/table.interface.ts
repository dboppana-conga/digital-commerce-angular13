import { AObject, FilterOperator } from '@congacommerce/core';
import { FieldFilter } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs';
/**
 * Type used to describe the configuration options for the table component.
 * 
 */
export interface TableOptions {
  /**
   * Field to group rows by.
   */
  groupBy?: string;
  /**
   * Array of Filters to apply to the table.
   */
  filters?: Array<FieldFilter>;
  /**
   * Default order the table should be sorted by.
   */
  defaultSort?: SortInfo;
  /**
   * Array of TableColumn type to define the columns.
   */
  columns?: Array<TableColumn>;
  /**
   * Number of columns that should be sticky.
   */
  stickyColumnCount?: number;
  /**
   * Number of rows to limit the table to.
   */
  limit?: number;
  /**
   * Array of TableAction type to describe actions on the table.
   */
  actions?: Array<TableAction>;
  /**
   * Options for showing child records.
   */
  childRecordOptions?: ChildRecordOptions;
  /**
   * Array of lookup fields.
   */
  lookups?: Array<object>;
  /**
   * Array of child properties to query with the data
   */
  children?: Array<string>;
  /**
   * Array of additional fields to be queried with the data
   */
  fields?: Array<string>;
  /**
   * Flag to disable link for Name column
   */
  disableLink?: boolean;
  /**
   * String representing the routing label for Name column
   */
  routingLabel?: string;
  /**
   * Function that preselect items in group.
   */
  selectItemsInGroupFunc?(recordData: Array<AObject>): void;
  /**
   * Define a function to highlight row.
   * @param record AObject to highlight.
   */
  highlightRow?(record: AObject): Observable<boolean>;
}
/**
 * Used to describe an action to be used on the table.
 */
export interface TableAction {
  /**
   * Flag to set the action as enabled.
   */
  enabled?: boolean;
  /**
   * Icon to show for the action. font awesome class as string.
   * i.e. icon: 'fa-ban' for delet icon.
   */
  icon: string;
  /**
   * Flag to set this as a mass action.
   */
  massAction?: boolean;
  /**
   * Label to show for the action.
   */
  label: string;
  /**
   * Bootstrap class theme for this action.
   */
  theme?: 'primary' | 'warning' | 'danger' | 'info';
  /**
   * Validation method to be executed.
   * @param record AObject to validate.
   */
  validate(record: AObject, childRecords?: Array<AObject>): boolean;
  /**
   * Action method to be executed.
   * @param recordList Array of AObject records to pass to the action method.
   */
  action(recordList: Array<AObject>): Observable<any>;

  disableReload?: boolean;
}
/** @ignore */
export interface TableView {
  checkState?: CheckState;
  data: Array<AObject>;
  groupedData?: object;
  totalRecords: number;
  type: AObject;
  columns: Array<TableColumn>;
  stickyColumns: Array<TableColumn>;
  page: number;
  pageStats?: PageStats;
  totalPages?: number;
  selectedItemCount?: number;
  groups?: Array<TableGroup>;
  childRecords: object;
  route: string;
  limit: number;
  limitOptions: Array<number>;
  actions: Array<TableAction>;
  label: string;
}
/** @ignore */
export interface TableGroup {
  state: CheckState;
  label: string;
}
/** @ignore */
export interface PageStats {
  minVal: number;
  maxVal: number;
  totalVal: number;
}
/** @ignore */
export enum CheckState {
  CHECKED = 'checked',
  INDETERMINATE = 'indeterminate',
  UNCHECKED = 'unchecked'
}
/**
 * Type used to define a column to be shown in the table.
 */
export interface TableColumn {
  /**
   * Property value in the record that is being used.
   */
  prop: string;
  /**
   * Label to show on the column.
   */
  label?: string;
  /**
   * Boolean flag to indicate the column can be sorted ot not.
   */
  sortable?: boolean;
  /**
   * In case of custom values, define a function returning values for column.
   * @param record: AObject record for which value to be rendered.
  */
  value?(record: AObject): Observable<any>;

}
/**
 * Type used to describe the sorting information.
 */
export interface SortInfo {
  /**
   * Data field on the record to be sorted.
   */
  column: string;
  /**
   * Direction to sort.
   */
  direction: 'ASC' | 'DESC';
}
/**
 * Options for showing child records on the data table component.
 */
export interface ChildRecordOptions {
  /**
   * Filters for searching child records.
   */
  filters: Array<any>;
  /**
   * Field that relates the child records to their parent records.
   */
  relationshipField: string;
  /**
   * Fields to show on the child record table.
   */
  childRecordFields: Array<string>;
}

/**
 * Filters for showing records on the table component.
 */
export interface TableFilter {
  /**
   * Field on which the filter needs to be performed.
   */
  field: string;
  /**
   * The value for the filter field.
   */
  value: any;
  /**
   * The operator to be passed for filtering ex:'EQUAL'.
   */
  filterOperator: FilterOperator
}
