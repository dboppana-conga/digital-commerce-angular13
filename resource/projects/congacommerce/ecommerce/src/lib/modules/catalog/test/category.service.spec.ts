import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CategoryService } from '../services/category.service';
import { ApttusModule } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { mockCategory } from './data/dataManger';
import { Category } from '../classes/index';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

describe('CategoryService', () => {
    let service: CategoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [CategoryService],
        });

        service = TestBed.inject(CategoryService);
    });

    it('getCategories() should return list of categories based on priceList', () => {
        let productData: any;
        spyOn(service, 'getCategories').and.returnValue(of(mockCategory));
        service.getCategories().pipe(take(1)).subscribe(res => {
            productData = res;
        });
        expect(productData).toEqual(mockCategory);
    });

    it('getCategoryByName() should return based on given paramter', () => {
        let productData;
        spyOn(service, 'getCategoryByName').and.returnValue(of(mockCategory[0]));
        service.getCategoryByName('Software_Category').pipe(take(1)).subscribe(res => {
            productData = res;
        });
        expect(productData).toBeTruthy();
        expect(productData.Name).toEqual(mockCategory[0].Name);
    });

    it('getCategoriesByProductId() should return based on given product id', () => {
        let productData;
        spyOn(service, 'getCategoriesByProductId').and.returnValue(of(mockCategory[0]));
        service.getCategoriesByProductId('0ebb3fa0-59e5-472a-9678-62d45d5d0344').pipe(take(1)).subscribe(res => {
            productData = res;
        });
        expect(productData).toBeTruthy();
        expect(productData.Name).toEqual(mockCategory[0].Name);
    });

    it('getCategoryTree() should return category tree', () => {
        spyOn(service, 'getCategoryTree').and.returnValue(of(mockCategory));
        service.getCategoryTree().pipe(take(1)).subscribe(res => {
            expect(res).toBeTruthy();
        });
        expect(service.getCategoryTree).toHaveBeenCalled();
    });

    it('getSubcategories() should return Sub category of given category', () => {
        spyOn(service, 'getSubcategories').and.returnValue(of(mockCategory));
        service.getSubcategories('0ebb3fa0-59e5-472a-9678-62d45d5d-0a36w8').pipe(take(1)).subscribe(res => {
            expect(res).toBeTruthy();
        });
        expect(service.getSubcategories).toHaveBeenCalled();
    });

    it('getRelatedCategories() should return related category of given category', () => {
        spyOn(service, 'getRelatedCategories').and.returnValue(of(mockCategory));
        service.getRelatedCategories('9678-59e5-472a-9678-3dsawer-0a36w8').pipe(take(1)).subscribe(res => {
            expect(res).toBeTruthy();
        });
        expect(service.getRelatedCategories).toHaveBeenCalled();
    });

    it('getRootCategories() should return root category', () => {
        let productData = mockCategory[2] as unknown as Array<Category>;;
        spyOn(service, 'getRootCategories').and.returnValue(of(productData));
        service.getRootCategories().pipe(take(1)).subscribe(res => {            
            expect(res['AncestorId']).toBeNull();
        });
        expect(service.getRootCategories).toHaveBeenCalled();
    });
});
