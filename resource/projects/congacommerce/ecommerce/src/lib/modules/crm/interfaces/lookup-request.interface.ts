/** @ignore */
export interface LookupRequest {
    q?: string;
    searchType?: 'Recent' | 'Search' | 'TypeAhead';
    dependentFieldBindings?: Array<string>;
    page?: number;
    pageSize?: number;
}