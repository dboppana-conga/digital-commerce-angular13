import { Component, Input, OnChanges, ElementRef, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, Output, EventEmitter, DebugElement } from '@angular/core';
import { isNil, get, find, first, split, last, map, defaultTo, set, lowerCase, includes } from 'lodash';
import { BehaviorSubject, Subscription, combineLatest, of } from 'rxjs';
import { map as rmap, switchMap, take } from 'rxjs/operators';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ApiService, MetadataService, ConfigurationService, AObjectMetadata, AObjectService, AObject, RavenErrorHandler } from '@congacommerce/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { LookupOptions } from '../../shared/interfaces/lookup-option.interface';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputFieldComponent, OutputFieldView } from './output-field.component';
import { AddressModule } from '../address/address.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { InputFieldModule } from '../input-field/input-field.module';
import { LaddaModule } from 'angular2-ladda';
import { Account, PricingModule } from '@congacommerce/ecommerce';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { metadata, metadata2, orderInstance, fieldMetadata, fieldMetadata2, accountValue, contactValue, outputfield } from './data/datamanager'
import { By } from '@angular/platform-browser';
describe('Output Field Component', () => {
  let component: OutputFieldComponent;
  let fixture: ComponentFixture<OutputFieldComponent>;
  let debugElement: DebugElement;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const configSpy = jasmine.createSpyObj<ConfigurationService>(['get'])
  configSpy.get('sentryDsn')
  const childComponent = jasmine.createSpyObj('pop', ['hide']);
  const ccomponent= jasmine.createSpyObj('lookupPop',['show','hide'])
  const metaSpy= jasmine.createSpyObj<MetadataService>(['getAObjectServiceForType'])
  metaSpy.getAObjectServiceForType.and.returnValue(null);
  const aoSpy= jasmine.createSpyObj<AObjectService>(['update'])
  aoSpy.update.and.returnValue(of(null));
  const espy = jasmine.createSpyObj('nativeElement',['getBoundingClientRect'])
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        AddressModule,
        PopoverModule.forRoot(),
        TranslateModule.forChild(),
        InputFieldModule,
        RouterModule,
        LaddaModule,
        PricingModule],
      declarations: [OutputFieldComponent, PopoverDirective],
      providers: [
        { provide: ConfigurationService, useValue: configSpy },
        { provide: AObjectService, useValue: aoSpy },
        { provide: MetadataService, useValue: metaSpy },
        { provide: ElementRef, useValue: espy},
        //{ provide: RavenErrorHandler, useValue: {revenSpy} }
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(OutputFieldComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
      }
      );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getDateFormat() should return date format based on the metadata of the field on this record', () => {
    const dateType = component.getDateFormat(metadata);
    expect(dateType).toEqual('short')
    const dateType1 = component.getDateFormat(metadata2);
    expect(dateType1).toEqual('shortDate')
    component.dateFormat = 'demoDate'
    const dateType2 = component.getDateFormat(metadata2);
    expect(dateType2).toEqual('demoDate')
  });

  it('getValue() should return value of the field passed in the record', () => {
    const instance = orderInstance
    const field = 'Name'
    const value = component.getValue(instance, field, instance);
    expect(value).toEqual('orcerDemo');
  });

  it('handleLookupPopClick() should click once', () => {
    expect(component.showQuickView).toBeFalse()
    spyOn(component, 'hidePopover')
    component.showQuickView = true;
    component.lookupPop = true
    const incrementButton = debugElement.query(By.css('[.btn-link popoverLink]')
    );
    const evt = new Event('click');
    fixture.detectChanges();
    expect(component.showQuickView).toBeTrue()
  });

  it('getPopoverFields() should return values', () => {
    spyOn(accountValue, 'getFieldMetadata').and.returnValue(fieldMetadata)
    const account = component.getPopoverFields(accountValue);
    expect(first(account).field).toEqual('BillingAddress');
    expect(first(account).label).toEqual('Billing Address');
    spyOn(contactValue, 'getFieldMetadata').and.returnValue(fieldMetadata2)
    const contact = component.getPopoverFields(contactValue);
    expect(first(contact).field).toEqual('FirstName');
    expect(first(contact).label).toEqual('FirstName');
  });

  it('getFieldType() should return values; when record valuepassed is not nil', () => { // to check
    let value: any;
    component.record = accountValue;
    value = component.getFieldType('ChildAccounts.ts');
    expect(value).toBeInstanceOf(Function)
  });

  it('getFieldType() should return values; when record valuepassed is nil', () => { // to check
    let value: any;
    component.record = null;
    value = component.getFieldType('Account.ts');
    expect(value).toBeUndefined()
  });

  it('handleLookupPopClick() when showquickview is true doesnt call the hidepopover method', () => {
    component.lookupPop = ccomponent;
    component.showQuickView=true;
    component.lookupPop.isOpen=true;
    spyOn(component,'hidePopover');
    component.handleLookupPopClick();
    expect(component.hidePopover).toHaveBeenCalled();

  });

  it('handleLookupPopClick() when showquickview is true but lookuppop.isopen is false doesnt call the hidepopover method', () => {
    component.lookupPop = ccomponent;
    component.showQuickView=true;
    component.lookupPop.isOpen=false;
    spyOn(component,'hidePopover');
    component.handleLookupPopClick();
    expect(component.hidePopover).toHaveBeenCalledTimes(0);
    expect(ccomponent.show).toHaveBeenCalled()

  });

  
  it('handleLookupPopClick() when showquickview is false doesnt call the hidepopover method', () => {
    component.lookupPop = ccomponent;
    component.showQuickView=false;
    component.lookupPop.isOpen=true;
    spyOn(component,'hidePopover');
    component.handleLookupPopClick();
    expect(component.hidePopover).toHaveBeenCalledTimes(0);

  });

  it('handleHidePop() should return values;', () => {
    component.pop=childComponent;
    component.record=accountValue; 
    expect(outputfield.recordInstance.Id).toEqual('1234')
    component.handleHidePop(outputfield);
    expect(outputfield.recordInstance.Id).toEqual('test123')
    expect(childComponent.hide).toHaveBeenCalled()
  });

  it('hidePopover() when lookupPop is assigned with value', () => {
    component.expanded=true;
    component.lookupPop=ccomponent;
    component.hidePopover()
    expect(component.expanded).toBeFalse()
    expect(ccomponent.hide).toHaveBeenCalled()
  });

  it('onShown() when lookupPop is null', () => {
    component.showQuickView=true;
    let value:any;
    espy['getBoundingClientRect'].and.returnValue({ top: 500, bottom:500, height: 100, left: 2, width: 200, right: 202 });
    value=component.onShown();
    expect(value).toEqual('bottom')
  });

});