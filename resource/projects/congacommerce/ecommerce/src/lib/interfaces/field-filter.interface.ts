import { FilterOperator } from "@congacommerce/core";

export interface FieldFilter {
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