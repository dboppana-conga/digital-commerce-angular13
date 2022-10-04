import { of, Observable, BehaviorSubject, from, EMPTY, throwError } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { AObject } from '../classes/a.model';
import { take, map, filter, distinctUntilChanged, mergeMap, debounceTime, bufferTime, share, tap, takeUntil } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { PlatformConstants } from '../classes/configuration.model';
import * as _ from 'lodash';
import { ClassType } from 'class-transformer/ClassTransformer';
import * as Fuse from 'fuse.js';

export interface Key {
    type: string;
    query: number;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    keyStore: Array<Key>;

    private cache: Array<CacheKey> = [];

    private _cache: any;
    private bufferCache = {};
    private CACHE_VERSION = 12;
    private DB_STORE = 'cache';
    private DB_NAME = 'ApttusDC';
    // private encryptionKey = CryptoJS.enc.Base64.parse(PlatformConstants.SV);

    constructor(private ngZone: NgZone, private configurationService: ConfigurationService) {
        this._cache = {};
        this.keyStore = new Array();
    }





    buffer(bufferKey: string, value: any, executable: (arg: any) => Observable<any>, dataMap?: (arg: any) => any, bufferTimeInMilliseconds?: number, bufferCount?: number, debounceResult: boolean = false): Observable<any> {
        let bufferData = _.find(_.get(this.bufferCache, bufferKey), d => _.get(d, 'state.value') === 'open');

        bufferTimeInMilliseconds = _.defaultTo(bufferTimeInMilliseconds, this.configurationService.get('disableBuffer', false) === true ? 0 : this.configurationService.get('bufferTime', 50)) as number;
        bufferCount = _.defaultTo(bufferCount, this.configurationService.get('disableBuffer', false) === true ? 1 : this.configurationService.get('maxBufferSize', 10)) as number;


        if (_.isNil(bufferData)) {
            const state = new BehaviorSubject<'open' | 'running' | 'closed'>('open');
            let acc = new BehaviorSubject<any>(value).pipe(
                bufferTime(bufferTimeInMilliseconds, undefined, bufferCount)
            );
            if (debounceResult) {
                acc = new BehaviorSubject<any>(value).pipe(
                    tap(d => _.set(bufferData, 'data', _.concat(_.get(bufferData, 'data', []), d))),
                    debounceTime(this.configurationService.get('debounceTime', 1000)),
                    map(() => _.get(bufferData, 'data'))
                );
            }
            bufferData = {
                state: state,
                accumulator: acc
                    .pipe(
                        filter(x => !_.isEmpty(x)),
                        takeUntil(state.pipe(filter(s => s === 'closed'))),
                        mergeMap(data => {
                            state.next('running');
                            return bufferData.executable(_.flatten(data));
                        }),
                        tap(d => {
                            state.next('closed');
                            _.remove(_.get(this.bufferCache, bufferKey), x => !_.includes(['open', 'running'], _.get(x, 'state.value')));
                        }),
                        share()),
                executable: executable
            };
            _.set(this.bufferCache, bufferKey, _.concat(_.get(this.bufferCache, bufferKey, []), bufferData));
        } else
            bufferData.accumulator.next(value);


        return bufferData.accumulator.pipe(
            map(data => {
                return (!_.isNil(dataMap)) ? dataMap(data) : data;
            })
        );
    }

}

interface CacheKey {
    id: string;
    subject: BehaviorSubject<any>;
    output: Observable<any>;
    type: ClassType<AObject>;
    data: Array<AObject>;
    parse?: boolean;
    skipCache?: boolean;
    dirty?: boolean;
    strategy?: 'freshness' | 'performance';
    executable(): Observable<any>;
}

export interface CacheRequest {
    parse?: boolean;
    skipCache?: boolean;
    useIndexedDB?: boolean;
    strategy?: 'freshness' | 'performance';
}