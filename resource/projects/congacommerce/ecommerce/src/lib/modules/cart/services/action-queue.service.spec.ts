import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, mergeMap, share, skip, switchMap, tap,take } from "rxjs/operators";
import { concat, compact, bind } from 'lodash';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApiService, ConfigurationService, MetadataService, AObjectService, AObjectMetadata } from '@congacommerce/core';
import { ActionQueue } from "./action-queue.service";
import { value1, value2 } from "./datamanager/data"

describe('ActionQueueService', () => {
    let service: ActionQueue;
    let apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    apiSpy.refreshToken.and.returnValue(of(null));
    let aObjectSpy =jasmine.createSpyObj<AObjectService> ([ 'fetch','cacheService' ]);
    let aObjectMetaSpy =jasmine.createSpyObj<AObjectMetadata> ([ 'get' ]);
    let configSpy= jasmine.createSpyObj('ConfigurationService', ['get'])
    let metadataSpy =jasmine.createSpyObj('MetadataService', ['getAObjectServiceForType', 'getTypeByApiName'])
    beforeEach(() => {


        TestBed.configureTestingModule({
            providers: [
                ActionQueue,
                { provide: ApiService, useValue: apiSpy },
                { provide: MetadataService, useValue: metadataSpy },
                { provide: ConfigurationService, useValue: configSpy },
                { provide: AObjectService, useValue: aObjectSpy },
                { provide: AObjectMetadata, useValue: aObjectMetaSpy }
            ]
        });
        service= TestBed.inject(ActionQueue);
    })

    it('service should be created', () =>{
        expect(service).toBeTruthy();
    });

    it('onError should return the error', () =>{
        let result: any;
        service.responseData=[value1];
        const subject= new BehaviorSubject<any>([value2]);
        service.subjectQueue.push(subject)
        expect(service.responseData).toEqual([value1])
        expect(service.subjectQueue.length).toEqual(1)
        result=service['onError']('error');
        result.pipe(take(1)).subscribe(c=>{
            expect(service.responseData).toBeNull()
            expect(service.subjectQueue.length).toEqual(0)
            expect(c).toEqual('error')
        })
    });

    it('onComplete should return the concat data', fakeAsync(() =>{
        const subject= new BehaviorSubject<any>([value2]);
        service.subjectQueue.push(subject)
        service.callback= service['onError'];
        service.responseData=[value1];
        service['onComplete']([value2]);
        tick();
        expect(service.responseData).toEqual([value1, value2])
        service.subjectQueue.pop()
        expect(service.subjectQueue.length).toEqual(0)
        service['onComplete']('error'); // removed callback as it was throwing error check with team
        expect(service.responseData).toBeUndefined()

    }));

    it('queueAction should return the data from the queue', () =>{
        let result: any;
        spyOn<any>(service,'onComplete');
        spyOn<any>(service,'onError').and.returnValue(of(null));
        result= service.queueAction(of([value1,value2]),null); 
        result.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual([value1,value2])
            expect(service['onComplete']).toHaveBeenCalledTimes(1)
            expect(service['onError']).toHaveBeenCalledTimes(0)//since no errors were there
        }
        )
    });

    it('queueAction should return the data from the queue, when subjectQueue length is greated than 1 ', () =>{
        let result: any;
        spyOn<any>(service,'onComplete');
        spyOn<any>(service,'onError').and.returnValue(of(null));
        const subject= new BehaviorSubject<any>(value2);
        service.subjectQueue.push(subject)
        result= service.queueAction(of(['push 1st','push next']),service['onError']); 
        result.pipe(take(1)).subscribe(c=>{
            expect(service['onComplete']).toHaveBeenCalledTimes(1)
            expect(service['onError']).toHaveBeenCalledTimes(0)//since no errors were there
        }
        )
    });

})