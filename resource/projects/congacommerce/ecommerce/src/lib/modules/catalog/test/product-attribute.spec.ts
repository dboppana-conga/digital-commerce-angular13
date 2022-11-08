import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';
import { Observable } from 'rxjs';
import { ProductAttribute, Product, ProductAttributeValue } from '../classes/index';
import { of } from 'rxjs';
import { get, flatten, map, isNil, forEach, set, find } from 'lodash';
import { ProductAttributeGroupMemberService } from '../services//product-attribute-group.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductAttributeValueService } from '../services/product-attribute.service';
import { ApttusModule } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { productMockData, productWithAttribute, typeObject } from './data/dataManger';

describe('ProductAttributeValueService', () => {
    let service: ProductAttributeValueService;
    let aObjectSpy =jasmine.createSpyObj<AObjectService> ([ 'fetch','cacheService','getInstance' ]);
    aObjectSpy.getInstance.and.returnValue(typeObject);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [ProductAttributeValueService,
                { provide: AObjectService, useValue: aObjectSpy }],
        });

        service = TestBed.inject(ProductAttributeValueService);
    });

    it('getInstanceWithDefaults() should return an instance object with Attibute name as label and its default value as value', () => {
        let value:any;
        value=service.getInstanceWithDefaults(productWithAttribute,'true')
        expect(value.RAM).toEqual('16GB');
        expect(value.Processor).toEqual('Intel Core i5-12600K')
    });

    it('getInstanceWithDefaults() should return an instance object when product without attribute is passed', () => {
        let value:any;
        value=service.getInstanceWithDefaults(productMockData[0],'true')
        expect(value.RAM).toBeUndefined();
        expect(value.Processor).toBeUndefined();
    });
    
});