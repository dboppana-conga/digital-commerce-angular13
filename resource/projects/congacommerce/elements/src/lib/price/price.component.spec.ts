import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingModule } from '@congacommerce/ecommerce';
import { PriceComponent } from './price.component';

import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy, Input, OnChanges, OnDestroy } from '@angular/core';
import { of, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { isArray, some, defaultTo, get } from 'lodash';
import { AObject } from '@congacommerce/core';
import {
  PriceService, Cart, CartItem, Product, ProductOptionComponent,
  Order, ProductAttributeValue, Price, OrderLineItem, Quote, QuoteLineItem,
  LocalCurrencyPipe, AssetLineItem
} from '@congacommerce/ecommerce';
import {quoteValue,orderValue,cartValue,poComponent,productValue,cartItemValue} from './data'

describe('PriceComponent', () => {
    let component: PriceComponent;
    let fixture: ComponentFixture<PriceComponent>;
    let priceSpy= jasmine.createSpyObj<PriceService>(['getQuotePrice', 'getCartPrice','getProductPrice','getOptionAdjustmentPrice','getOrderPrice','getLineItemPrice']);
    let price= new Price(null,10,20,30,40,50);
    priceSpy.getCartPrice.and.returnValue(of(price));
    priceSpy.getOrderPrice.and.returnValue(of(price));
    priceSpy.getProductPrice.and.returnValue(of(price));
    priceSpy.getOptionAdjustmentPrice.and.returnValue(of(price));
    priceSpy.getQuotePrice.and.returnValue(of(price));
    priceSpy.getLineItemPrice.and.returnValue(of(price));


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                PricingModule
              ],
              declarations: [PriceComponent],
            providers: [
                { provide: PriceService, useValue: priceSpy },
                { provide: LocalCurrencyPipe, useValue: { } }
            ]
        }
        )
            .compileComponents();
        fixture = TestBed.createComponent(PriceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('to be created.', () => {
        expect(component).toBeTruthy()
    });

    it('getObservable() when record is Quote instance ', () => {
        let value:any;
        component.record=quoteValue;
        value=component.getObservable();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(price);
        })

    });

    it('getObservable() when record is Order instance ', () => {
        let value:any;
        component.record=orderValue;
        value=component.getObservable();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(price);
        })

    });

    it('getObservable() when record is Cart instance ', () => {
        let value:any;
        component.record=cartValue;
        value=component.getObservable();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(price);
        })

    });

    it('getObservable() when record is Product instance ', () => {
        let value:any;
        component.record=productValue;
        value=component.getObservable();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(price);
        })

    });

    it('getObservable() when record is ProductOptionComponent instance ', () => {
        let value:any;
        component.record=poComponent;
        value=component.getObservable();
        value.pipe(take(1)).subscribe(c=>{
            expect(c).toEqual(price);
        })

    });

    it('getObservable() when record is ProductOptionComponent instance ', () => {
        let value:any;
        spyOn(component,'isItem').and.returnValue(true)
        component.record=cartItemValue;
        value=component.getObservable();
        value.pipe(take(1)).subscribe(c=>{
            expect(component.isItem).toHaveBeenCalled()
            expect(c).toEqual(price);
        })

    });

    it('isItem() method returns true when the instances match the objects; when parameter is not array<Aobject> ', () => {
        let value:any;
        value=component.isItem(cartItemValue);
        expect(value).toBeTruthy();
    });

    it('isItem() method returns true when the instances match the objects; when parameter is array<Aobject> ', () => {
        let value:any;
        value=component.isItem([cartItemValue]);
        expect(value).toBeTruthy();
    });

    it('isItem() method returns true when the instances match the objects; when parameter is array<Aobject> ', () => {
        let value:any;
        value=component.isItem([cartValue]);
        expect(value).toBeFalsy();
    });

    it('ngOnChanges()', () => {
        let value:any;
        component.type='net'
        component.formatted=false;
        spyOn(component,'getObservable').and.returnValue(of(price))
        component.ngOnChanges();
    });



});