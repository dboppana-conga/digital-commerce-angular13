import { combineLatest, of, Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, take, switchMap, filter } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { AObject } from '../classes/index';
import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { ConfigurationService } from './configuration.service';
import { ClassType } from 'class-transformer/ClassTransformer';
import { MetadataService } from './metadata.service';
import { MemoizeAll, Memoize } from 'lodash-decorators';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AObjectService {
    static defaultFields = ['Id', 'CreatedDate', 'LastModifiedDate', 'LastModifiedById', 'CreatedById'];
    static currencyFields = ['DefaultCurrencyIsoCode', 'CurrencyIsoCode', 'CountryCode', 'StateCode'];

    metadata: any;
    customFields: Array<string> = [];
    defaultImplementationNoProvided = 'Default implementation is not provided';

    type: ClassType<AObject> = AObject;

    static arrayToCsv(idArray: Array<string>): string {
        if (!idArray || idArray.length === 0)
            return '';
        else {
            let result = ``;
            for (const key of idArray) {
                result += `'` + key + `',`;
            }
            if (result.indexOf(',') > -1)
                result = result.substring(0, result.lastIndexOf(','));

            return result;
        }
    }

    constructor(public cacheService: CacheService, public apiService: ApiService,
        public metadataService: MetadataService,
        public configurationService: ConfigurationService,
        public injector: Injector) {
        setTimeout(() => this.onInit());
    }


    onInit() { }

    onWhere(records: Array<AObject>): Observable<Array<AObject>> {
        return of(records);
    }

    getInstance(): AObject {
        if (!this.type)
            throw new Error('AObject service missing type');
        else
            return new this.type();
    }

    setType(type: ClassType<AObject>) {
        this.type = type;
    }

    getLookups(instance: AObject, depth: number = 0, deep: boolean = true): Array<Object> {
        const replace = (field: string) => field.replace('__r', '__c');
        const referenceField = instance.getReferenceFieldsFromExpose('Lookup');
        if (!_.isEmpty(referenceField) && depth <= this.configurationService.get('expandDepth')) {
            return _.map(referenceField, (l: string) => {
                const expand = _.get(instance.getMetadata(l), 'expand') === 'deep' && deep;
                return {
                    // field: replace(instance.getApiName(l)),
                    // lookups: this.getLookups(instance.instanceOf(l), depth + 1, expand),
                    // children: expand ? this.getChildren(instance.instanceOf(l), [], depth, expand) : null
                };
            });
        } else
            return new Array();
    }

    getChildren(instance: AObject, filters?: Array<any>, depth: number = 0, deep: boolean = true): Array<Object> {
        depth += 1;
        const referenceField = instance.getReferenceFieldsFromExpose('Child');
        if (!_.isEmpty(referenceField) && depth <= this.configurationService.get('expandDepth') && deep) {
            return _.map(referenceField, (c: string) => (
                {
                    //  field: instance.getApiName(c),
                    filters: _.compact(_.first(_.map(_.filter(filters, { field: c }), 'filterList'))),
                    //  children: this.getChildren(instance.instanceOf(c), [], depth, _.get(instance.getMetadata(c), 'expand') === 'deep' && deep),
                    //  lookups: this.getLookups(instance.instanceOf(c), depth, _.get(instance.getMetadata(c), 'expand') === 'deep' && deep)
                }
            ));
        } else
            return new Array();
    }

    getRestResource() {
        return this.metadataService.getRestResource(this.type);
    }
    // To Do:
    @MemoizeAll()
    describeObject(entity?: ClassType<AObject>): Observable<any> {
        const entityClass = (entity != null) ? entity : this.type;
        const subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
        const apiObjectName = new entityClass().getApiName();
        this.apiService.get(`/metadata/v1/objects/${apiObjectName}`, entityClass)
            .pipe(take(1))
            .subscribe(d => subject.next(d));
        return subject.pipe(
            filter(data => !_.isNil(data))
        );
    }

    describe(entity?: ClassType<AObject>, field?: string, picklistOnly: boolean = false, useGobalDescribe: boolean = false): Observable<any> {
        const entityClass = (entity != null) ? entity : this.type;
        let fieldApiName: any, apiName;
        fieldApiName = (apiName === undefined) ? field : apiName;
        return this.describeObject(entity)
            .pipe(
                map(data => {
                    const metadata = (!_.isNil(field)) ? _.find(_.get(data, 'FieldMetadata', []), (f: any) => _.toLower(f.FieldName) === _.toLower(_.trim(fieldApiName))) : data;
                    const picklistValues = _.get(_.find(_.get(data, 'PicklistMetadata', []), (f: any) => _.toLower(f.Name) === _.toLower(_.get(metadata, 'PicklistName'))), 'PicklistEntries');
                    if (picklistOnly) {
                        return picklistValues;
                    }
                    _.set(metadata, 'picklistValues', picklistValues);
                    return metadata;
                })
            );
    }

    guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    }

    @MemoizeAll()
    fetch(id: string): Observable<AObject> {
        const route: string = _.defaultTo(_.get(this.getInstance().getMetadata(), 'route'), this.getInstance().getApiName());
        const subject: BehaviorSubject<AObject> = new BehaviorSubject<AObject>(new AObject());

        this.apiService.get(`/${route}/${id}`, this.type)
            .pipe(take(1))
            .subscribe(data => subject.next(_.first(data) as AObject));

        return subject.pipe(filter(d => !_.isNil(d)));
    }

    delete(recordList: Array<AObject>, updateCache: boolean = true): Observable<any> {
        return of(null); //this.constructiveOperation(recordList, _.bind(this.platformService.remove, this.platformService), updateCache, 'delete');
    }

    create(objectList: Array<AObject>, updateCache: boolean = true): Observable<any> {
        return of(null); //this.constructiveOperation(objectList, _.bind(this.platformService.create, this.platformService), updateCache, 'create');
    }

    update(recordList: Array<AObject>, updateCache: boolean = true): Observable<any> {
        return of(null);
    }

    upsert(recordList: Array<AObject>, updateCache: boolean = true): Observable<any> {
        return of(null);//this.constructiveOperation(recordList, _.bind(this.platformService.upsert, this.platformService), updateCache, 'upsert');
    }

    generateModel(): Observable<boolean> {
        throw 'Method is deprecated, set the dynamic attribute on the ATable decorator of your model to true';
    }

    // toApiJson(recordList: Array<AObject>): any {
    //     const adtlRecords = new Array<AObject>();

    //     recordList = _.map(_.compact(recordList), (record) => {
    //         if (record.hasExpose())
    //             return record.toApiJsonFromExpose(this.configurationService.platform());
    //         else
    //             return record.toApiJson(this.configurationService.platform());
    //     });
    //     return adtlRecords.concat(recordList);
    // }

    // private constructiveOperation(recordList: Array<AObject>, callout: (data, type, cache) => Observable<Array<string>>, updateCache: boolean = true, key: string): Observable<Array<AObject>> {
    //     const records = _.filter(_.compact(recordList), a => a instanceof AObject);
    //     if (!_.isEmpty(records)) {
    //         return this.cacheService.buffer(
    //             _.first(records).generatedId() + key + updateCache,
    //             records,
    //             (items) => {
    //                 const flatItems = _.uniqWith(_.flatten(items), (a, b) => _.get(b, 'Id') !== null && _.get(b, 'Id') === _.get(a, 'Id'));
    //                 return callout(this.toApiJson(flatItems), this.type, updateCache)
    //                     .pipe(
    //                         map(idArray => {
    //                             _.forEach(flatItems, (i, index) => _.set(i, 'Id', _.get(idArray, `[${index}]`)));
    //                             if (updateCache)
    //                                 this.cacheService.onDML(flatItems);
    //                             return flatItems;
    //                         })
    //                     );
    //             },
    //             null, null, null, true
    //         );
    //     } else
    //         return of(null);
    // }
}