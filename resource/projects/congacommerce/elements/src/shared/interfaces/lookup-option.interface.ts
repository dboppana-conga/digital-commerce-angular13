import { AObject } from '@congacommerce/core';
//To Do:
/** @ignore */
export interface LookupOptions {
    primaryTextField: 'Name';
    secondaryTextField?: string;
    thumbnailField?: string;
    searchString?: string;
    conditions?: Array<any>;
    expressionOperator?: 'AND' | 'OR';
    filters?: Array<any>;
    sortOrder?: Array<any>;
    page?: any;
    fieldList?: Array<string>;
    onLookupChange?(record: AObject): void;
  }