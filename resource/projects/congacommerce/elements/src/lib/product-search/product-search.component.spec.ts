import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { NgModule, TemplateRef } from '@angular/core';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../icon/icon.module';
import { FormsModule } from '@angular/forms';
import { ApttusModule } from '@congacommerce/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TypeaheadMatch, TypeaheadDirective } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { ProductSearchComponent } from './product-search.component';
import { AObjectService, CacheService, AObject, ConfigurationService, MetadataService } from '@congacommerce/core';
import { ProductOptionService, CartService, ProductService,  } from '@congacommerce/ecommerce';
import { ExceptionService } from '../../shared/services/index';
import { of, throwError } from 'rxjs';
import { get } from 'lodash';
import { PRODUCT_MOCK } from '../product-card/test/data';
import { Router } from '@angular/router';

const spy = jasmine.createSpy();
const testWidth = 420;
beforeAll(() => {
    window.addEventListener('resize', spy);
});

describe('ProductSearchComponent ', () => {
    let component: ProductSearchComponent;
    let fixture: ComponentFixture<ProductSearchComponent>;
    const configSpy= jasmine.createSpyObj<ConfigurationService>(['get'])
    configSpy.get('productIdentifier')
    const pSpy= jasmine.createSpyObj<ProductService>(['searchProducts'])
    pSpy.searchProducts.and.returnValue(of([PRODUCT_MOCK]))
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const exceptionServiceSpy = jasmine.createSpyObj<ExceptionService>(['showError','showSuccess']);
    exceptionServiceSpy.showError;
    exceptionServiceSpy.showSuccess;
    const ccomponent= jasmine.createSpyObj('summaryModal',['show','hide']);
    let aSpy= jasmine.createSpyObj<AObjectService>(['guid']);
    aSpy.guid.and.returnValue('test');
    let cartSpy= jasmine.createSpyObj<CartService>(['addProductToCart']);
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    }
    let modalValue=jasmine.createSpyObj('modalRef',['hide']);
    let moSpy=jasmine.createSpyObj<BsModalService>(['show']);


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TranslateModule.forChild(),
    IconModule,
    ApttusModule
  ],
            providers: [
                { provide: ConfigurationService, useValue: configSpy },
                { provide: ProductService, useValue: pSpy },
                { provide: CartService, useValue: cartSpy },
                { provide: BsModalService, useValue: moSpy },
                { provide: MetadataService, useValue: {} },
                { provide: AObjectService, useValue: aSpy },
                { provide: ExceptionService, useValue: exceptionServiceSpy },
                { provide: Router, useValue: mockRouter},
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ProductSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('component is called.', () => {
        component.searchQuery='Test'
        expect(component).toBeTruthy();
    });

    it('onSubmit() navigates to the search.', () => {
        component.searchQuery='Test1'
        component.onSubmit()
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/search', 'Test1'])
    });

    it('typeaheadNoResults sets noresult as true/false', () => {
        component.typeaheadNoResults(false)
        expect(component.noResult).toBeFalsy();
        component.typeaheadNoResults(true)
        expect(component.noResult).toBeTruthy();
    });

    it('doSearch() navigates to the search url when searchquery is present', () => {
        component.searchQuery='test23'
        component.modalRef=modalValue;
        component.doSearch();
        expect(component.typeaheadLoading).toBeFalsy();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/search', component.searchQuery])
    });

    it('doSearch() navigates to the search url when searchquery is null', () => {
        component.searchQuery=null;
        component.modalRef=modalValue;
        component.doSearch();
        expect(component.typeaheadLoading).toBeFalsy();
        expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/search', component.searchQuery])
    });

    it('openModal() navigates to the search url when searchquery is null', () => {
        component.openModal('qwert' as unknown as TemplateRef<any>);
        expect(component.searchQuery).toEqual('');
    });

    it('onInputChange sets searchstring with the searchQuery value', () => {
        let value1={key:'ENTER'};
        component.searchQuery='Alpha';
        spyOn(component,'doSearch')
        component.onInputChange(value1);
        expect(component.doSearch).toHaveBeenCalled()
        expect(component.searchString).toEqual(component.searchQuery)
    });

    it('onTemplateMatch sets searchstring with the value', () => {
        let value1={value:'string'};
        component.onTemplateMatch(value1 as unknown as TypeaheadMatch);
        expect(component.searchString).toEqual(value1.value);
    });

    it('typeaheadOnSelect() when searchstring is not equal to searchquery', () => {
        component.searchString='Beta'
        component.searchQuery='Alpha';
        spyOn(component,'doSearch')
        component.typeaheadOnSelect('test')
        expect(component.searchString).toEqual(component.searchQuery);
        expect(component.doSearch).toHaveBeenCalled()
    });

    it('typeaheadOnSelect() when searchstring is equal to searchquery', () => {
        let test={item:['test','test2']}
        component.searchString='Alpha'
        component.searchQuery='Alpha';
        component.modalRef=modalValue;
        component.typeaheadOnSelect(test)
        expect(component.searchString).toEqual(component.searchQuery);
        expect(component.typeaheadLoading).toBeFalsy()
    });


});
