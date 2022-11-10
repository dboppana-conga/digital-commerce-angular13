import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PricingModule } from '@congacommerce/ecommerce';
import { TranslateModule , TranslateService , TranslatePipe} from '@ngx-translate/core';
import { LaddaModule } from 'angular2-ladda';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from '../icon/icon.module';
import { OutputFieldModule } from '../output-field/output-field.module';
import { PriceModule } from '../price/price.module';
import { ProductDrawerComponent } from './product-drawer.component';
import { AObjectService, CacheService, AObject, MetadataService, ConfigurationService } from '@congacommerce/core';
import { CartItem, OrderLineItem, ProductOptionService, Product, CartService, QuoteLineItem } from '@congacommerce/ecommerce';
import { ExceptionService } from '../../shared/services/index';
import { BatchSelectionService } from '../../shared/services/batch-selection.service';
import { BatchActionService } from '../../shared/services/batch-action.service';
import { ProductDrawerService } from './product-drawer.service';
import { of, throwError } from 'rxjs';
import { get } from 'lodash';
import { cartitem1, cartitem2, product1, product2, TranslatePipeMock, TranslateServiceStub } from './data';
import { take } from 'rxjs/operators';

const spy = jasmine.createSpy();
const testWidth = 420;
beforeAll(() => {
    window.addEventListener('resize', spy);
});

describe('ProductDrawerComponent ', () => {
    let component: ProductDrawerComponent;
    let fixture: ComponentFixture<ProductDrawerComponent>;
    const configSpy= jasmine.createSpyObj<ConfigurationService>(['get'])
    configSpy.get('productIdentifier')
    const exceptionServiceSpy = jasmine.createSpyObj<ExceptionService>(['showError','showSuccess']);
    exceptionServiceSpy.showError;
    exceptionServiceSpy.showSuccess;
    let aSpy= jasmine.createSpyObj<AObjectService>(['guid']);
    aSpy.guid.and.returnValue('test');
    let cartSpy= jasmine.createSpyObj<CartService>(['addProductToCart','getMyCart']);
    let bsSpy= jasmine.createSpyObj<BatchSelectionService>(['removeAllLineitems','getSelectedProducts','getSelectedLineItems','removeAllProducts']);
    bsSpy.getSelectedProducts.and.returnValue(of([product1,product2]))
    bsSpy.getSelectedLineItems.and.returnValue(of([cartitem1,cartitem2]))
    let baSpy= jasmine.createSpyObj<BatchActionService>(['activateProductActions','activateCartitemActions']);
    let pdSpy= jasmine.createSpyObj<ProductDrawerService>(['isDrawerOpen','openDrawer','toggleDrawer','closeDrawer']);
    let mSpy=jasmine.createSpyObj<MetadataService>(['getAObjectServiceForType'])
   


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
                { provide: CartService, useValue: cartSpy },
                { provide: MetadataService, useValue: mSpy },
                { provide: AObjectService, useValue: aSpy },
                { provide: ExceptionService, useValue: exceptionServiceSpy },
                { provide: BatchSelectionService, useValue: bsSpy },
                { provide: BatchActionService, useValue: baSpy },
                { provide: ProductDrawerService, useValue: pdSpy },
                { provide: TranslateService, useValue: { } },
                { provide: TranslatePipe,  useValue: {}},
            ],
            declarations: [
                ProductDrawerComponent,TranslatePipeMock
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ProductDrawerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('component is called.', () => {
        expect(component).toBeTruthy();
    });

    it('toggledrawer calls the productdrawerservices toggledrawer.', () => {
        component.toggleDrawer();
        expect(pdSpy.toggleDrawer).toHaveBeenCalled()
    });

    it('openDrawer sets hidden as false.', () => {
        component.hidden=true;
        component.openDrawer();
        expect(component.hidden).toBeFalsy()
    });

    it('closeDrawer sets hidden as false.', () => {
        component.hidden=false;
        component.closeDrawer();
        expect(component.hidden).toBeTruthy()
    });

    it('setActivePill when pill is Product sets this.activePill and calls batchActionService.activateProductActions()', () => {
        let pill:any;
        pill='Product'
        component.setActivePill(pill);
        expect(component.activePill).toEqual('Product');
        expect(baSpy.activateProductActions).toHaveBeenCalled();
    });

    it('setActivePill when pill is CartItem sets this.activePill and calls batchActionService.activateCartItemActions()', () => {
        let pill:any;
        pill='CartItem'
        component.setActivePill(pill);
        expect(component.activePill).toEqual('CartItem');
        expect(baSpy.activateCartitemActions).toHaveBeenCalled();
    });

    it('setActivePill when pill is not cartitem or product', () => {
        let pill:any;
        pill='CartItemList'
        component.setActivePill(pill);
        expect(component.activePill).toEqual('CartItemList');
        expect(baSpy.activateCartitemActions).not.toHaveBeenCalledTimes(2);
    });

    it('onAction calls the productdrawerservices closeDrawer() when event is triggered', () => {
        component.onAction(true)
        expect(pdSpy.closeDrawer).toHaveBeenCalledTimes(1);
    });

    it('onAction does not call the productdrawerservices closeDrawer() when event is triggered', () => {
        component.onAction(false)
        expect(pdSpy.closeDrawer).not.toHaveBeenCalledTimes(2);
    });

    it('removeAllProducts calls this.batchSelectionService.removeAllProducts() and return true when confirmed', () => {
        let event = new Event('string');
        spyOn(window,'confirm').and.returnValue(true)//stubbing the confirm popup on window
        let value:any;
        value=component.removeAllProducts(event);
        expect(value).toBeTruthy();
    });

    it('removeAllProducts calls this.batchSelectionService.removeAllProducts() and return fasle when cancelled', () => {
        let event = new Event('string');
        spyOn(window,'confirm').and.returnValue(false)//stubbing the confirm popup on window
        let value:any;
        value=component.removeAllProducts(event);
        expect(value).toBeFalsy();
    });

    it('removeAllCartItems calls this.batchSelectionService.removeAllCartItems and return true when confirmed', () => {
        let event = new Event('string');
        spyOn(window,'confirm').and.returnValue(true)//stubbing the confirm popup on window
        let value:any;
        value=component.removeAllCartItems(event);
        expect(value).toBeTruthy();
    });

    it('removeAllCartItems calls this.batchSelectionService.removeAllCartItems and return true when confirmed', () => {
        let event = new Event('string');
        spyOn(window,'confirm').and.returnValue(false)//stubbing the confirm popup on window
        let value:any;
        value=component.removeAllCartItems(event);
        expect(value).toBeFalsy();
    });

    it('ngOnInit when getSelectedProducts returns null the activepill is set as CartItem', () => {
        bsSpy.getSelectedProducts.and.returnValue(of([null]));
        pdSpy.isDrawerOpen.and.returnValue(of(true));
        component.ngOnInit()
        expect(pdSpy.openDrawer).toHaveBeenCalled()
        component.products$.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual([null])
        })
        component.drawerIsOpen$.pipe(take(1)).subscribe(c=>{
            expect(c).toBeTruthy()
        })
    });

    it('ngOnInit when getSelectedLineItems returns null the activepill is set as Product', () => {
        bsSpy.getSelectedLineItems.and.returnValue(of(null));
        pdSpy.isDrawerOpen.and.returnValue(of(true));
        component.ngOnInit()
        expect(component.activePill).toEqual('Product');
        expect(pdSpy.openDrawer).toHaveBeenCalled();
        component.cartItems$.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(null)
        })
    });

});
