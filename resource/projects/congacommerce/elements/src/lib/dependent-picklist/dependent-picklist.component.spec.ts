import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AccountLocation, Account, Contact, AccountService, ContactService, AccountLocationService, Order, Address } from '@congacommerce/ecommerce';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm, ControlContainer } from '@angular/forms';
import { ApiService, ConfigurationService, MetadataService, AObjectService, AObjectMetadata, AObject } from '@congacommerce/core';
import { BehaviorSubject, of } from 'rxjs';
import { get, first, last } from 'lodash';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DependentPicklistComponent } from './dependent-picklist.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { view, view2, view3} from './data';
import { ClassType } from 'class-transformer/ClassTransformer';

describe('dependentComponent', () => {
  let component: DependentPicklistComponent;
  let fixture: ComponentFixture<DependentPicklistComponent>;
  let mSpy=jasmine.createSpyObj<MetadataService>(['getAObjectServiceForType'])
  let account= new Account()
  mSpy.getAObjectServiceForType.and.returnValue(account as unknown as AObjectService)
  let aomSpy=jasmine.createSpyObj<AObjectMetadata>(['getType'])
  aomSpy.getType.and.returnValue(account as unknown as ClassType<AObject>);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            CommonModule,
            FormsModule,
            TranslateModule.forChild()
          ],
      declarations: [ DependentPicklistComponent ],
      providers: [
        AccountLocationService,
        { provide: ApiService, useValue: jasmine.createSpyObj('ApiService', { 'get': of(null) }) },
        { provide: MetadataService, useValue: mSpy },
        { provide: ConfigurationService, useValue: jasmine.createSpyObj('ConfigurationService', ['get']) },
        { provide: HttpClient, useValue: {} },
        { provide: AObjectService, useValue: jasmine.createSpyObj('AObjectService',{'describe': of([{'label':'anypostalorcity'}],[{'label':'rcity'}])}) },
        { provide: TranslateService, useValue: {} },
        { provide: AObjectMetadata, useValue: aomSpy}

        ]})
    .compileComponents();
    fixture = TestBed.createComponent(DependentPicklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('getId () should get unique Id', () => {
    expect(component).toBeTruthy()
  });

  it('writeValue() when view has value', () => {
    component.view$.next(view);
    spyOn(component,'updateView');
    component.writeValue(['1','2']);
    expect(component.updateView).toHaveBeenCalled()
    
  });

  it('writeValue() when view is null', () => {
    component.view$.next(null);
    spyOn(component,'updateView');
    component.writeValue(['1','2']);
    expect(component.updateView).toHaveBeenCalledTimes(0)
    
  });

  it('childChange() when returns the values matching the conditions.', () => {
    let value:any;
    component.view$.next(view2);
    component.onChange=true;
    spyOn(component,'onChange');
    component.childChange('1');
    expect(first(component.value).value).toEqual('2');
    expect(last(component.value).value).toEqual('1');
    expect(component.onChange).toHaveBeenCalledTimes(1);

  });

  it('parentChange() when returns the values matching the conditions.', () => {
    let value:any;
    component.view$.next(view3);
    component.onChange=true;
    spyOn(component,'onChange');
    component.parentChange('2');
    expect(first(component.value).value).toEqual('2');
    expect(last(component.value)).toBeUndefined();
    expect(component.onChange).toHaveBeenCalledTimes(1);

  });

  it('updateView() when returns the values matching the conditions.', () => {
    component.value=['1','1']
    component.view$.next(view3);
    component.updateView();
    expect(first(component.value).value).toEqual('1');
    expect(last(component.value).validFor).toEqual('Test');
  });

  xit('ngOnChanges() when returns the values matching the conditions.', () => {
    spyOn(component,'updateView');
    component.entity=account
    component.ngOnChanges();
    console.log(component.view$.value);
  });


});
