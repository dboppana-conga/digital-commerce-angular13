import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { set, get } from 'lodash';
import { Account, CartItem, CartService, StorefrontService } from '@congacommerce/ecommerce';
import { ProductConfigurationSummaryComponent } from '../product-configuration-summary/product-configuration-summary.component';
import { BatchSelectionService } from '../../shared/services/index';
import { ComponentFixture, fakeAsync, TestBed, tick,ComponentFixtureAutoDetect  } from '@angular/core/testing';
import { ApiService, ConfigurationService, MetadataService, AObjectService } from '@congacommerce/core';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { LineItemTableRowComponent } from './line-item-table-row.component';
import { storefront,CARTS, cartItem2, value, value2, value3, value4, carts2, CARTS2, cartItemView, cartItem3, carts3, subs, value5 } from './data';
import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

describe('LineItem', () => {
  let component: LineItemTableRowComponent;
  let fixture: ComponentFixture<LineItemTableRowComponent>;
  const summaryDialog= jasmine.createSpyObj('ProductConfigurationSummaryComponent',['show']);
  const configSpy= jasmine.createSpyObj<ConfigurationService>(['get'])
  configSpy.get('productIdentifier')
  const bSpy= jasmine.createSpyObj<BatchSelectionService>(['getSelectedLineItems','isLineItemSelected'])
  bSpy.getSelectedLineItems.and.returnValue(of(cartItem2));
  bSpy.isLineItemSelected.and.returnValue(of(true));
  const cartSpy= jasmine.createSpyObj<CartService>(['updateCartItems','removeCartItem'])
  cartSpy.removeCartItem.and.returnValue(of(null));
  //component.identifier='productIdentifier';


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineItemTableRowComponent, ProductConfigurationSummaryComponent ],
      providers: [
        { provide: ApiService, useValue: jasmine.createSpyObj('ApiService', { 'get': of(null) }) },
        { provide: MetadataService, useValue: jasmine.createSpyObj('MetadataService', ['getAObjectServiceForType']) },
        { provide: ConfigurationService, useValue: configSpy },
        { provide: HttpClient, useValue: {} },
        { provide: CartService, useValue: cartSpy },
        { provide: AObjectService, useValue: jasmine.createSpyObj('AObjectService',{'describe': of({'label':'anypostalorcity'}),'configurationService': 'string'}) },
        { provide: StorefrontService, useValue: jasmine.createSpyObj('StorefrontService',{'getStorefront': of(storefront)}) },
        { provide: BatchSelectionService, useValue: bSpy },
        { provide: TranslateService, useValue: {} },
        { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj<ChangeDetectorRef>(['detectChanges']) }
        ]})
    .compileComponents();
    fixture = TestBed.createComponent(LineItemTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit should be called when the component is called.', () => {
    component.parent=value5;
    component.cart=CARTS;
    spyOn(component,'calculateTotalTax').and.returnValue(null)
    component.ngOnInit()
    expect(get(component.parent,'PricingFrequency')).toEqual('17');
    expect(get(component.parent,'AdjustmentAmount')).toEqual(0);
  });

  it('ngOnChanges should set quantity value based on parent object.', () => {
    component.parent=value2;
    component.cart=CARTS;
    component.ngOnChanges()
    expect(component.readonly).toBeTruthy();
    expect(component.isFavoriteConfigurationItem).toBeTruthy();
    expect(component['quantity']).toEqual(200);
  });

  it('ngOnChanges should set quantity value based on parent object.', () => {
    component.parent=value3;
    component.cart=CARTS;
    component.ngOnChanges()
    expect(component.readonly).toBeTruthy();
    expect(component.isFavoriteConfigurationItem).toBeTruthy();
    expect(component['quantity']).toEqual(8);
  });

  it('ngOnChanges should set quantity value based on parent object.', () => {
    component.parent=value3;
    component.cart=CARTS;
    component.ngOnChanges()
    expect(component.readonly).toBeTruthy();
    expect(component.isFavoriteConfigurationItem).toBeTruthy();
    expect(component['quantity']).toEqual(8);
  });

  it('changeItemQuantity should set cartitems quantity value;when the cartitem does not have Quantity it is assigned with this.quantity value', () => {
    component.cart=CARTS;
    component['quantity']=3;
    component.changeItemQuantity(value4)
    expect(value4.Quantity).toEqual(3);
  });

  it('changeItemQuantity should set cartitems quantity value;when the cartitem has Quantity value', () => {
    component.cart=CARTS;
    component['quantity']=3;
    cartSpy.updateCartItems.and.returnValue(of(cartItem2))
    component.changeItemQuantity(value3)
    expect(value3.Quantity).toEqual(8);
    expect(cartSpy.updateCartItems).toHaveBeenCalled();
  });

  it('changeItemQuantity should set cartitems quantity value;when error is thrown', () => {
    component.cart=CARTS;
    component['quantity']=3;
    expect(component.cart.IsPricePending).toBeTruthy()
    cartSpy.updateCartItems.and.returnValue(throwError(() => new Error('error')));
    component.changeItemQuantity(value3)
    expect(value3.Quantity).toEqual(8);
    expect(cartSpy.updateCartItems).toHaveBeenCalled();
    expect(component.cart.IsPricePending).toBeFalsy()
  });

  it('updateAdjustments should set cartitems quantity value;when the cartitem has Quantity value', () => {
    cartSpy.updateCartItems.and.returnValue(of(cartItem2))
    component.updateAdjustments(value3)
    expect(cartSpy.updateCartItems).toHaveBeenCalled();
  });

  it('updateAdjustments when error is thrown', () => {
    component.cart=carts2;
    expect(component.cart.IsPricePending).toBeTruthy();
    cartSpy.updateCartItems.and.returnValue(throwError(() => new Error('error')));
    component.updateAdjustments(value3)
    expect(cartSpy.updateCartItems).toHaveBeenCalled();
    expect(component.cart.IsPricePending).toBeFalsy()
  });

  it('removeCartItem when error is thrown', () => {
    set(value3, '_metadata._loading', true);
    component.removeCartItem(value3,'')
    expect(cartSpy.removeCartItem).toHaveBeenCalled();
    expect(value3._metadata._loading).toBeFalsy()
  });

  it('removeCartItem when error is thrown', () => {
    set(value3, '_metadata._loading', true);
    component.removeCartItem(value3,'')
    cartSpy.removeCartItem.and.returnValue(throwError(() => new Error('error')))
    expect(cartSpy.removeCartItem).toHaveBeenCalled();
    expect(value3._metadata._loading).toBeFalsy()
  });

  it('trackById returns Id', () => {
    let test:any;
    test=component.trackById(1,value4)
    expect(test).toEqual(value4.Id);
  });

  it('showTaxPopupLink returns boolean value depending on the Taxable variable; Id set true it returns true', () => {
    let test:any;
    component.parent=value3;
    test=component.showTaxPopupLink()
    expect(test).toBeFalsy();
  });

  it('showTaxPopupLink returns boolean value depending on the Taxable variable; Id set true it returns true', () => {
    let test:any;
    component.parent=value5;
    test=component.showTaxPopupLink()
    expect(test).toBeTruthy();
  });

  it('trackByFn returns Id of the item when item passed has Id', () => {
    let test:any;
    test=component.trackByFn(1,value4)
    expect(test).toEqual(value4.Id);
  });

  it('trackByFn returns Id of the item when item passed has Id; else returns index', () => {
    let test:any;
    test=component.trackByFn(3,value3)
    expect(test).toEqual(3);
  });

  it('isOrderOrProposal returns order', () => {
    let test:any;
    test=component.isOrderOrProposal(CARTS)
    expect(test).toEqual(CARTS.Order)
  });

  it('isOrderOrProposal returns quote', () => {
    let test:any;
    test=component.isOrderOrProposal(CARTS2)
    expect(test).toEqual(get(CARTS2,'Proposal'))
  });

  it('isCartLineItem returns true if parameter passed in CartLineItem and isFavoriteConfigurationItem is false', () => {
    let test:any;
    test=component.isCartLineItem(value2)
    expect(test).toBeTruthy();
  });

  it('isCartLineItem returns flase if isFavoriteConfigurationItem is true', () => {
    let test:any;
    component.isFavoriteConfigurationItem=true;
    test=component.isCartLineItem(value2)
    expect(test).toBeFalsy();
  });

  it('isCartLineItem returns false if parameter passed in not CartLineItem', () => {
    let test:any;
    test=component.isCartLineItem(value)
    expect(test).toBeFalsy();
  });

  it('updateValues updates the values of cartitem passed as parent parameter when view and parameter are not equal', () => {
    component['quantity']=12;
    cartSpy.updateCartItems.and.returnValue(of(cartItem2))
    component.updateValues(cartItemView,cartItem3)
    expect(get(cartItem3, 'Quantity')).toEqual(12)
    expect(cartItem3[cartItemView.fieldName]).toEqual(cartItemView);
  });

  it('updateValues updates the values of cartitem passed as parent parameter when view and parameter are not equal; when error occurs', () => {
    component.cart=carts3;
    expect(component.cart.IsPricePending).toBeTruthy()
    cartSpy.updateCartItems.and.returnValue(throwError(() => new Error('error')))
    component.updateValues(cartItemView,value4)
    expect(component.cart.IsPricePending).toBeFalsy()
  });

  xit('showSummary updates the values of cartitem passed as parent parameter when view and parameter are not equal; when error occurs', () => {
    spyOn(component.summaryDialog,'show');
    component.showSummary();
    expect(component.renderSummary).toBeTruthy()
  });







});
