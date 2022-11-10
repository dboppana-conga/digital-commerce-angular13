import { of, throwError } from 'rxjs';
import { CartService, StorefrontService } from '@congacommerce/ecommerce';
import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { TableRowSubItemComponent } from './table-row-sub-item.component';
//import { storefront, CARTS, LocalPipeMock, value3, translateServiceStub, value, cartItem2, value4, value2, carts2, cartItem3, carts3, cartItemView2 } from './data';

import { storefront, CARTS, value3, value, cartItem2, value4, value2, carts2, cartItem3, carts3, cartItemView2 } from './data';
import { ChangeDetectorRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { get } from 'lodash';
import { cartItemView } from '../data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AObjectService, ApttusModule, ConfigurationService, MetadataService } from '@congacommerce/core';
import { PricingModule } from '@congacommerce/ecommerce';
import { ConfigurationSummaryModule } from '../../product-configuration-summary/configuration-summary.module';
import { InputDateModule } from '../../input-date/input-date.module';
import { PriceModule } from '../../price/price.module';
import { OutputFieldModule } from '../../output-field/output-field.module';
import { InputFieldModule } from '../../input-field/input-field.module';
import { PromotionModalModule } from '../../promotion-modal/promotion-modal.module';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from './data';


describe('Table-Row-Sub-Item', () => {
    let component: TableRowSubItemComponent;
    let fixture: ComponentFixture<TableRowSubItemComponent>;
    const cartSpy = jasmine.createSpyObj<CartService>(['updateCartItems', 'removeCartItem'])
    cartSpy.removeCartItem.and.returnValue(of(null));
    let aSpy= jasmine.createSpyObj<AObjectService>(['guid']);
    aSpy.guid.and.returnValue('test');

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ApttusModule,
                RouterModule,
                InputDateModule,
                PriceModule,
                PricingModule,
                FormsModule,
                LaddaModule,
                OutputFieldModule,
                TranslateModule.forRoot(),
                InputFieldModule,
                PromotionModalModule,
                PopoverModule.forRoot(),
                ConfigurationSummaryModule,
                BsDropdownModule.forRoot()
            ],
            declarations: [TableRowSubItemComponent, TranslatePipeMock],
            providers: [
                { provide: HttpClient, useValue: {} },
                { provide: CartService, useValue: cartSpy },
                { provide: StorefrontService, useValue: jasmine.createSpyObj('StorefrontService', { 'getStorefront': of(storefront) }) },
                { provide: TranslateService, useValue: {} },
                { provide: MetadataService, useValue: {} },
                { provide: AObjectService, useValue: aSpy },
                { provide: TranslatePipe,  useValue: {} },
                { provide: ConfigurationService, useValue: jasmine.createSpyObj<ConfigurationService>(['get'])},
                { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj<ChangeDetectorRef>(['detectChanges']) }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(TableRowSubItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('ngOnChanges should be called when the component is called.', () => {
        component.subItem = value3;
        component.cart = CARTS;
        component.ngOnChanges()
        expect(component['quantity']).toEqual(8)

    })

    it('ngOnInit should be called when the component is called; when subitem is not an instance of cartitem.', () => {
        component.subItem = value;
        component.ngOnInit()
        expect(component.readonly).toBeTruthy()
        component.storefront$.pipe(take(1)).subscribe(c => {
            expect(c).toEqual(storefront);
        })

    })

    it('ngOnInit should be called when the component is called; when subitem is an instance of cartitem', () => {
        component.subItem = value4;
        component.ngOnInit()
        expect(component.readonly).toBeTruthy()

    })

    it('handleStartChange should call the cartservice updatecartitem method', () => {
        cartSpy.updateCartItems.and.returnValue(of([value]))
        component.handleStartChange(value)
        expect(cartSpy.updateCartItems).toHaveBeenCalled();

    })

    it('handleEndDateChange should call the cartservice updatecartitem method', () => {
        cartSpy.updateCartItems.and.returnValue(of([value]))
        component.handleEndDateChange(value)
        expect(cartSpy.updateCartItems).toHaveBeenCalled();

    })

    it('isCartLineItem returns true when the parameter is instance of cartitem', () => {
        let result: any;
        component.isFavoriteConfigurationItem = false
        result = component.isCartLineItem(value2);
        expect(result).toBeTruthy();

    })

    it('isCartLineItem returns true when the parameter is instance of cartitem', () => {
        let result: any;
        component.isFavoriteConfigurationItem = false
        result = component.isCartLineItem(value);
        expect(result).toBeFalse();

    })

    it('changeItemQuantity should set cartitems quantity value;when the cartitem does not have Quantity it is assigned with this.quantity value', () => {
        component.cart = CARTS;
        component['quantity'] = 3;
        component.changeItemQuantity(value4)
        expect(value4.Quantity).toEqual(3);
    });

    it('changeItemQuantity should set cartitems quantity value;when the cartitem has Quantity value', () => {
        component.cart = CARTS;
        component['quantity'] = 3;
        cartSpy.updateCartItems.and.returnValue(of(cartItem2))
        component.changeItemQuantity(value3)
        expect(value3.Quantity).toEqual(8);
        expect(cartSpy.updateCartItems).toHaveBeenCalled();
    });

    it('updateAdjustments should set cartitems quantity value;when the cartitem has Quantity value', () => {
        cartSpy.updateCartItems.and.returnValue(of(cartItem2))
        component.updateAdjustments(value3)
        expect(cartSpy.updateCartItems).toHaveBeenCalled();
    });

    it('updateAdjustments when error is thrown', () => {
        component.cart = carts2;
        expect(component.cart.IsPricePending).toBeTruthy();
        cartSpy.updateCartItems.and.returnValue(throwError(() => new Error('error')));
        component.updateAdjustments(value3)
        expect(cartSpy.updateCartItems).toHaveBeenCalled();
        expect(component.cart.IsPricePending).toBeFalsy()
    });

    it('updateValues updates the values of cartitem passed as parent parameter when view and parameter are not equal', () => {
        component['quantity'] = 12;
        cartSpy.updateCartItems.and.returnValue(of(cartItem2))
        component.updateValues(cartItemView, cartItem3)
        expect(get(cartItem3, 'Quantity')).toEqual(12)
        expect(cartItem3[cartItemView.fieldName]).toEqual(cartItemView);
    });

    it('updateValues updates the values of cartitem passed as parent parameter when view and parameter are not equal; when error occurs', () => {
        component.cart = carts3;
        expect(component.cart.IsPricePending).toBeTruthy()
        cartSpy.updateCartItems.and.returnValue(throwError(() => new Error('error')))
        component.updateValues(cartItemView, value4)
        expect(component.cart.IsPricePending).toBeFalsy()
    });

    it('updateValues updates the values of cartitem passed as parent parameter when view and parameter are equal', () => {
        component.updateValues(cartItemView, cartItemView2)
    });


});


