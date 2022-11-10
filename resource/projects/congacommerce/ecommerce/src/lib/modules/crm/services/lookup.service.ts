import { Injectable } from '@angular/core';
import { AObject, ApiService } from '@congacommerce/core';
import { LookupValue } from '../interfaces/lookup-value.interface';
import { RecordCollection } from '../interfaces/record-collection.interface';
import { Observable, of } from 'rxjs';
import { LookupRequest } from '../interfaces/lookup-request.interface';
import { MetadataService } from '@congacommerce/core';
import * as _ from 'lodash';

/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class LookupService {
    
    constructor(private apiService: ApiService,private metadataService: MetadataService) {}

    /**
     * When a user edits a lookup field, use this resource to search for and display suggestions. You can search for most recently used matches, for matching names, or for any match in a searchable field. You can also specify lookup filter bindings for dependent lookups.
     *
     * @param entity the API name of the source object
     * @param field the API name of a lookup field on the source object
     * @param params LookupRequest object
     */
    public getLookupFieldSuggestions(entity: new (t?) => AObject, field: string, params?: LookupRequest): Observable<LookupValue> {
        // TODO: Replace with RLP API
        // const apiObjectName = ''; // encodeURIComponent(this.metadataService.getObjectName(entity));
        // const fieldApiName = encodeURIComponent(this.metadataService.getFieldName(entity, field));

        // const endpoint = `/ui-api/lookups/${apiObjectName}/${fieldApiName}${this.getQueryString(params)}`;
        // return this.apiService.callout('GET', endpoint);
        return of(null);
    }

    /**
     * When a user edits a lookup field, use this resource to search for and display suggestions for a specified object. You can search for most recently used matches, for matching names, or for any match in a searchable field. You can also specify lookup filter bindings for dependent lookups.
     *
     * @param entity the API name of the source object
     * @param field the API name of a lookup field on the source object
     * @param target the API name of the target (lookup) object
     * @param params LookupRequest object
     */
    public getLookupFieldSuggestionsForObject(entity: new (t?) => AObject, field: string, target: string, params?: LookupRequest): Observable<RecordCollection> {
        // TODO: Replace with RLP API
        // const apiObjectName = ''; // encodeURIComponent(this.metadataService.getObjectName(entity));
        // const fieldApiName = encodeURIComponent(this.metadataService.getFieldName(entity, field));

        // const endpoint = `/ui-api/lookups/${apiObjectName}/${fieldApiName}/${target}${this.getQueryString(params)}`;
        // return this.apiService.callout('GET', endpoint);
        return of(null)
    }


    private getQueryString(params) {
        // TODO: Replace with RLP API
        // if (params && Object.keys(params).length > 0)
        //     return '?' + Object.keys(params)
        //         .filter(key => {
        //             const val = _.get(params, `${key}`);
        //             if (typeof val === 'string' || Array.isArray(val))
        //                 return val != null && val !== 'undefined' && val.length > 0;
        //             else
        //                 return val != null;
        //         })
        //         .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
        // else
        //     return '';
        return of(null);
    }
}