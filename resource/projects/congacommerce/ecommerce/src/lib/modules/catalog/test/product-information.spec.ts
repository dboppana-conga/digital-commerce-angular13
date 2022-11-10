import { AObjectService, ApiService, ApttusModule  } from '@congacommerce/core';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductInformationService } from '../services/product-information.service';
import { CommerceModule } from "../../../ecommerce.module";
import { TranslateModule } from '@ngx-translate/core';
import { data, typeObject } from './data/dataManger';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('ProductInformationService', () => {
    let service: ProductInformationService;
    let aObjectSpy =jasmine.createSpyObj<AObjectService> ([ 'fetch','cacheService','getInstance' ]);
    aObjectSpy.getInstance.and.returnValue(typeObject);
    const apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', ['refreshToken', 'get', 'post', 'patch', 'delete']);
    apiServiceSpy.refreshToken.and.returnValue(of(null));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [ProductInformationService,
                { provide: ApiService, useValue: apiServiceSpy },
                { provide: AObjectService, useValue: aObjectSpy }],
        });

        service = TestBed.inject(ProductInformationService);
    });

    it('service should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getProductInformation returns product information object', () => {
        let value:any;
        apiServiceSpy.get.and.returnValue(of(data))
        value=service.getProductInformation('abc');
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual([null,null])
        })
    });

    it('getProductInformation returns .....', () => {
        let value:any;
        apiServiceSpy.get.and.returnValue(of(null))
        value=service.getProductInformation('abc');
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual([])
        })
    });
    
});