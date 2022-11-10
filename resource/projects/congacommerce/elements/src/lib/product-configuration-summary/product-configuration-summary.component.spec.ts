import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PricingModule } from '@congacommerce/ecommerce';
import { TranslateModule } from '@ngx-translate/core';
import { LaddaModule } from 'angular2-ladda';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from '../icon/icon.module';
import { OutputFieldModule } from '../output-field/output-field.module';
import { PriceModule } from '../price/price.module';
import { ProductConfigurationSummaryComponent } from './product-configuration-summary.component';
import { AObjectService, CacheService, AObject, ConfigurationService, MetadataService } from '@congacommerce/core';
import { CartItem, OrderLineItem, ProductOptionService, Product, CartService, QuoteLineItem } from '@congacommerce/ecommerce';
import { ExceptionService } from '../../shared/services/index';
import { of, throwError } from 'rxjs';
import { get } from 'lodash';
import { cartitem, PRODUCT_MOCK } from './data';

const spy = jasmine.createSpy();
const testWidth = 420;
beforeAll(() => {
    window.addEventListener('resize', spy);
});

describe('ProductConfigurationSummaryComponent ', () => {
    let component: ProductConfigurationSummaryComponent;
    let fixture: ComponentFixture<ProductConfigurationSummaryComponent>;
    const configSpy= jasmine.createSpyObj<ConfigurationService>(['get'])
    configSpy.get('productIdentifier')
    const pSpy= jasmine.createSpyObj<ProductOptionService>(['getProductOptionTree'])
    pSpy.getProductOptionTree.and.returnValue(of(PRODUCT_MOCK))
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


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                PriceModule,
                PricingModule,
                IconModule,
                RouterModule,
                LaddaModule,
                OutputFieldModule,
                ModalModule,
                NgScrollbarModule,
                FormsModule,
                TranslateModule.forChild()
            ],
            providers: [
                { provide: ConfigurationService, useValue: configSpy },
                { provide: ProductOptionService, useValue: pSpy },
                { provide: CartService, useValue: cartSpy },
                { provide: MetadataService, useValue: {} },
                { provide: Router, useValue: routerSpy },
                { provide: AObjectService, useValue: aSpy },
                { provide: ExceptionService, useValue: exceptionServiceSpy },
                { provide: Router, useValue: mockRouter},
            ],
            declarations: [
                ProductConfigurationSummaryComponent
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ProductConfigurationSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('component is called.', () => {
        expect(component).toBeTruthy();
    });

    it('uuid() returns the value combined with "a + value returned from aobjectservice.get()"', () => {
        expect(component['uuid']).toEqual('atest');
    });

    it('uuid() returns the value assigned to _uuid', () => {
        component['_uuid']='Test'
        expect(component['uuid']).toEqual('Test');
    });

    it('isLineItem() returns true when relatedTo is assigned with cartitem object; else false', () => {
        let value:any;
        component.relatedTo=cartitem
        value=component.isLineItem()
        expect(value).toBeTruthy();
    });

    it('trackById() returns the id of the record passed', () => {
        let value:any;
        value=component.trackById(1,PRODUCT_MOCK);
        expect(value).toEqual(PRODUCT_MOCK.Id);
    });

    it('hide() hides of the modal popover', () => {
        component.summaryModal=ccomponent;
        component.hide();
        expect(ccomponent.hide).toHaveBeenCalled()
    });

    it('show() opens the modal popover; when quantity is passed', () => {
        component.summaryModal=ccomponent;
        component.product$.next(PRODUCT_MOCK);
        spyOn(component,'setProduct');
        component.show(2);
        expect(component.setProduct).not.toHaveBeenCalled();
        expect(ccomponent.show).toHaveBeenCalled()
        expect(component.quantity).toEqual(2);
    });

    it('show() opens the modal popover; when quantity is not passed and product$.value is null', () => {
        component.summaryModal=ccomponent;
        component.product$.next(null);
        spyOn(component,'setProduct');
        component.show();
        expect(component.setProduct).toHaveBeenCalled();
        expect(ccomponent.show).toHaveBeenCalled()
        expect(component.quantity).toBeUndefined();
    });

    it('setProduct() opens the modal popover; when quantity is not passed and product$.value is null', () => {
        component.changes=[cartitem]
        component.setProduct();
        expect(component.product$.value).toEqual(PRODUCT_MOCK);
        expect(component.cartItems).toEqual(component.changes)
    });

    it('ngOnChanges; when showActionButtons is true', () => {
        spyOn(component,'setProduct');
        component.showActionButtons=true;
        component.relatedTo=cartitem
        component.product$.next(PRODUCT_MOCK);
        component.preload=true;
        component.ngOnChanges();
        expect(get(component.actionButton,'label')).toEqual('PRODUCT_CARD.CHANGE_CONFIGURATION')
        expect(component.setProduct).toHaveBeenCalled();
    });

    it('ngOnChanges; when showActionButtons is false', () => {
        spyOn(component,'setProduct');
        component.showActionButtons=false;
        component.product$.next(null);
        component.preload=true;
        component.ngOnChanges();
        expect(get(component.actionButton,'label')).toBeUndefined();
        expect(component.setProduct).toHaveBeenCalled();
    });

    it('ngOnChanges; when relatedTo is null', () => {
        spyOn(component,'setProduct');
        component.showActionButtons=true;
        component.relatedTo=null;
        component.product$.next(null);
        component.preload=false;
        component.ngOnChanges();
        expect(get(component.actionButton,'label')).toEqual('COMMON.ADD_TO_CART');
        expect(get(component.secondaryButton,'label')).toEqual('PRODUCT_CARD.CHANGE_CONFIGURATION');
        expect(component.setProduct).not.toHaveBeenCalled();
    });

    it('addToCart; when addProducttocart returns a value', () => {
        spyOn(component,'hide');
        cartSpy.addProductToCart.and.returnValue(of([cartitem]))
        component.addToCart(1,PRODUCT_MOCK);
        expect(component.hide).toHaveBeenCalled();
        expect(exceptionServiceSpy.showSuccess).toHaveBeenCalled();
    });

    it('addToCart; when addProducttocart returns no result', () => {
        spyOn(component,'hide');
        cartSpy.addProductToCart.and.returnValue(of(null))
        component.addToCart(1,PRODUCT_MOCK);
        expect(component.hide).toHaveBeenCalled();
        expect(exceptionServiceSpy.showError).toHaveBeenCalled();
    });

    it('addToCart; when addProducttocart returns an error', () => {
        spyOn(component,'hide');
        cartSpy.addProductToCart.and.returnValue(throwError(() => new Error('error')))
        component.addToCart(1,PRODUCT_MOCK);
        expect(component.hide).not.toHaveBeenCalled();
        expect(component.addLoading).toBeFalsy()
    });

    it('changeConfiguration; when relatedTo is null and response from addProductToCart method', () => {
        spyOn(component,'hide');
        component.relatedTo=null;
        component.product=PRODUCT_MOCK;
        cartSpy.addProductToCart.and.returnValue(of([cartitem]))
        component.changeConfiguration(PRODUCT_MOCK);
        expect(component.hide).toHaveBeenCalled();
        expect(exceptionServiceSpy.showSuccess).toHaveBeenCalled();
        expect(component.addLoading).toBeFalsy();
        expect (mockRouter.navigate).toHaveBeenCalledWith(['/products', '0ebb3fa0-59e5-472a-9678-62d45d5d0344', '456' ], Object({ state:component.product}));
    });

    it('changeConfiguration; when relatedTo is null and response from addProductToCart method is empty', () => {
        spyOn(component,'hide');
        component.relatedTo=null;
        component.product=PRODUCT_MOCK;
        cartSpy.addProductToCart.and.returnValue(of(null))
        component.changeConfiguration(PRODUCT_MOCK);
        expect(component.hide).toHaveBeenCalled();
        expect(exceptionServiceSpy.showError).toHaveBeenCalled();
        expect(component.addLoading).toBeFalsy();
    });

    it('changeConfiguration; when relatedto is not null', () => {
        spyOn(component,'hide');
        component.relatedTo=cartitem;
        component.product=PRODUCT_MOCK;
        component.changeConfiguration(PRODUCT_MOCK);
        expect (mockRouter.navigate).toHaveBeenCalledWith(['/products', '0ebb3fa0-59e5-472a-9678-62d45d5d0344', '456' ], Object({ state:component.product}));
    });


});
