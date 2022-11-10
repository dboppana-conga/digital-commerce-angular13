import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { MiniCartComponent } from './mini-cart.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { get as _get, set, map as _map, compact, flatten, isArray, defaultTo, includes, isNil, filter } from 'lodash';
import { CartService } from '@congacommerce/ecommerce';
import { ApiService, MetadataService, ConfigurationService, AObjectMetadata, AObjectService } from '@congacommerce/core';
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { ExceptionService } from '../../shared/services/index';
import { RevalidateCartService } from '@congacommerce/elements';
import { Router, RouterModule } from '@angular/router';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { cartItem, cartItem2, INVALID_QUANTITY, Cart1, TranslatePipeMock, cartItem3, cartItem4 } from './data/datamanager'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { PriceModule } from '../price/price.module';
import { ApttusModule } from '@congacommerce/core';
import { InputFieldModule } from '../input-field/input-field.module';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

describe('Mini Cart Component', () => {
    let component: MiniCartComponent;
    let fixture: ComponentFixture<MiniCartComponent>;
    const cartServiceSpy = jasmine.createSpyObj<CartService>(['updateCartItems', 'getMyCart','removeCartItem','updateItem','addItem']);
    cartServiceSpy.updateCartItems.and.returnValue(of([cartItem2]))
    cartServiceSpy.updateItem.and.returnValue(of([cartItem4]))
    cartServiceSpy.getMyCart.and.returnValue(of(Cart1))
    cartServiceSpy.addItem.and.returnValue(of([cartItem4]))
    cartServiceSpy.removeCartItem.and.returnValue(of(null))
    const configspy = jasmine.createSpyObj<ConfigurationService>(['get','endpoint'])
    configspy.get('productidentifier');
    const exceptionServiceSpy = jasmine.createSpyObj<ExceptionService>(['showError', 'showSuccess']);
    exceptionServiceSpy.showError;
    exceptionServiceSpy.showSuccess;
    const translateServiceSpy = jasmine.createSpyObj<TranslateService>(['stream']);
    translateServiceSpy.stream.and.returnValue(of(INVALID_QUANTITY));
    let mockRouter = {
        navigate: jasmine.createSpy('navigate'),
        url:'/DCurl'
    }
    const revalidateSpy= jasmine.createSpyObj<RevalidateCartService>(['setRevalidateLines']);
    revalidateSpy.setRevalidateLines.and.returnValue(null);


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule,
                FormsModule,
                LaddaModule,
                PriceModule,
                ApttusModule,
                RouterModule,
                InputFieldModule,
                TranslateModule.forChild(),
                ModalModule.forRoot(),
                ToastrModule.forRoot({ onActivateTick: true })],
            declarations: [MiniCartComponent, TranslatePipeMock],
            providers: [
                { provide: AObjectService, useValue: jasmine.createSpyObj('AObjectService', { 'describe': of({ 'label': 'anypostalorcity' }), 'configurationService': 'string' }) },
                { provide: RevalidateCartService, useValue: revalidateSpy},
                { provide: BsModalService, useValue: {} },
                { provide: MetadataService, useValue: {} },
                { provide: ConfigurationService, useValue: configspy },
                { provide: HttpClient, useValue: {} },
                { provide: TranslateService, useValue: {} },
                { provide: Router, useValue: mockRouter },
                { provide: ExceptionService, useValue: exceptionServiceSpy },
                { provide: CartService, useValue: cartServiceSpy }

            ]
        })
            .compileComponents().then(() => {
                fixture = TestBed.createComponent(MiniCartComponent);
                component = fixture.componentInstance;
                component.productIdentifier = configspy.get('test')
            }
            );
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('trackbyId() should return the id of the passed record', () => {
        const record = cartItem;
        const Id = component.trackById(1, record)
        expect(Id).toEqual('1234')
    });

    it('navigateToCart() should navigate to manage cart page', () => {
        component.navigateToCart();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/carts', 'active'])
    });

    it('changeItemQuantity() throws an error when quantity is missing ', () => {
        component.changeItemQuantity(cartItem);
        expect(exceptionServiceSpy.showError).toHaveBeenCalled()
    });

    it('changeItemQuantity() throws an error when quantity less than Zero', () => {
        component.changeItemQuantity(cartItem3);
        expect(exceptionServiceSpy.showError).toHaveBeenCalled()
    });

    it('changeItemQuantity() calls the updatecartItems method which updates the response cartitem quantity', () => {
        component.changeItemQuantity(cartItem4);
        expect(cartServiceSpy.updateCartItems).toHaveBeenCalled();
        expect(cartItem4.Quantity).toEqual(5);
    });

    it('removeCartItem calls the removeCartItem method of cartservice which updates the response cartitem quantity', () => {
        let event= new Event('string')
        component.removeCartItem(cartItem3,event);
        expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/products'])
    });

    it('removeCartItem calls the removeCartItem method of cartservice which updates the response cartitem quantity', () => {
        let event= new Event('string')
        component.removeCartItem(cartItem4,event);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products', '344'])
    });

    it('savechanges when related to is not null', () => {
        component.saveChanges(cartItem4,true,'344');
        expect(cartServiceSpy.updateItem).toHaveBeenCalled()
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products', '344', cartItem4.Id])
    });

    it('savechanges when related to is null', () => {
        cartServiceSpy.addItem.and.returnValue(of([cartItem3]))
        component.saveChanges(null,true,'344');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products', '344'])
    });

    xit('dropDown', () => {
        component.btnDropdown
        component.dropdown('');
    });
    
    

});