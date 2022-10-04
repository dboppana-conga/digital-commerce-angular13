import { FilterOperator } from '@congacommerce/core';

export interface ProductFilter {
    field: string;
    value: any;
    filterOperator: FilterOperator
}