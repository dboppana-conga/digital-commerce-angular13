import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AccountLocation, Account, Contact, AccountService, ContactService, AccountLocationService, Order, Address } from '@congacommerce/ecommerce';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm, ControlContainer } from '@angular/forms';
import { ApiService, ConfigurationService, MetadataService, AObjectService } from '@congacommerce/core';
import { of } from 'rxjs';
import { get } from 'lodash';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { accountValue, accountlocationValue, contactValue, parent, child, address, address2, address3 } from './test/data/dataManager';

import { AddressComponent } from './address.component';

describe('Address Component', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressComponent ],
      providers: [
        AccountLocationService,
        { provide: ApiService, useValue: jasmine.createSpyObj('ApiService', { 'get': of(null) }) },
        { provide: MetadataService, useValue: jasmine.createSpyObj('MetadataService', ['getAObjectServiceForType']) },
        { provide: ConfigurationService, useValue: jasmine.createSpyObj('ConfigurationService', ['get']) },
        { provide: HttpClient, useValue: {} },
        { provide: AObjectService, useValue: jasmine.createSpyObj('AObjectService',{'describe': of({'label':'anypostalorcity'})}) },
        { provide: TranslateService, useValue: {} }
        ]})
    .compileComponents();
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('getId () should get unique Id', () => {
    const result =component.getId('567');
    expect(result).toContain('_567')
  });

  it('writeValue() should update only the record value when Account type is passed.', () => {
    component.countryState=[];
    const account=accountValue as unknown as Account;
    component.writeValue(account)
    expect(component.record).toEqual(account)
    expect(component.countryState).toHaveSize(0)
  });

  it('writeValue() should update the record value and countryState value when Accountlocation type is passed.', () => {
    component.countryState=[];
    const accountlocation= accountlocationValue;
    component.writeValue(accountlocation)
    expect(component.record).toEqual(accountlocation)
    expect(component.countryState).toEqual(['Country','State'])
  });

  it('getter method street(), when type="Billing", will return "Street" if the record type is AccountLocation; Else returns "MailingStreet" if the record type is Contact; Else returns "BillingStreet"', fakeAsync(() => {
     let value= accountlocationValue
     component.record=value;
     tick()
     expect(component.street).toEqual('Street')
     let value2= contactValue;
     component.record=value2;
     tick()
     expect(component.street).toEqual('MailingStreet')
     let value3= accountValue
     component.record=value3;
     tick()
     expect(component.street).toEqual('BillingStreet')
     component.record=address2;
     tick()
     expect(component.street).toEqual('street')
     component.type='Shipping';
     component.record=value2;
     tick()
     expect(component.street).toEqual('OtherStreet')
     component.type='Shipping';
     component.record=value3;
     tick()
     expect(component.street).toEqual('ShippingStreet')

  }));

  it('getter method countryCode(), when type="Shipping", will return "Country" if the record type is AccountLocation; Else returns "OtherCountryCode" if the record type is Contact; Else returns "ShippingCountryCode"', fakeAsync(() => {
    component.type='Shipping'
    let value= accountlocationValue
    component.record=value;
    tick() // waits for some time
    expect(component.countryCode).toEqual('Country')
    let value2= contactValue;
    component.record=value2;
    tick()
    expect(component.countryCode).toEqual('OtherCountryCode')
    let value3= accountValue;
    component.record=value3;
    tick()
    expect(component.countryCode).toEqual('ShippingCountryCode')
    component.record= address2;
    tick()
    expect(component.countryCode).toEqual('countryCode')
    component.type='Billing';
    component.record=accountValue;
    tick()
    expect(component.countryCode).toEqual('BillingCountryCode')

 }));

 it('setter method countryCodevalue(), sets the record value when the data is of type AccountLocation or Account or Contact', fakeAsync(() => {
  component.record=null // before the setter is called
  let value1= accountlocationValue
  component.value=value1;
  tick() // waits for some time
  expect(component.record).toBeInstanceOf(AccountLocation)
  let value2= contactValue;
  component.value=value2;
  tick()
  expect(component.record).toBeInstanceOf(Contact)
  expect(get(component.record, 'FirstName')).toEqual(contactValue.FirstName)
  component.record=null
  let value3= address
  component.value=value3;
  tick()
  expect(component.record).toBeNull()
}));

 it('countryStateChange() Sets the country and state and code fields information selected by the user;', () => {
  //before countryStateChange() is called, MailingCountryCode will be the value from mockdata
 component.record=contactValue;
 expect(component.record.MailingCountryCode).toEqual(contactValue.MailingCountryCode)
 component.countryStateChange([parent,child])
 //After countryStateChange() is called. MailingCountryCode will be changed to parent object's value
 expect(component.record.MailingCountryCode).toEqual(parent.value)
 expect(component.record.MailingStateCode).toEqual(child.value)
 expect(component.record.MailingCountry).toEqual(parent.label)
 expect(component.record.MailingState).toEqual(child.label)
 component.record=accountValue
 component.countryStateChange([null,null])
 expect(component.record.BillingCountryCode).toEqual(null)

});

it('getter method country()', fakeAsync(() => {
  component.type='Shipping'
  let value= accountlocationValue
  component.record=value;
  tick() // waits for some time
  expect(component.country).toEqual('Country')
  let value2= contactValue;
  component.record=value2;
  tick()
  expect(component.country).toEqual('OtherCountry')
  let value3= accountValue;
  component.record=value3;
  tick()
  expect(component.country).toEqual('ShippingCountry')
  component.record= address3;
  tick()
  expect(component.country).toEqual('country')
  component.type='Billing';
  component.record=accountValue;
  tick()
  expect(component.country).toEqual('BillingCountry')

}));

it('getter method state()', fakeAsync(() => {
  component.type='Shipping'
  let value= accountlocationValue
  component.record=value;
  tick() // waits for some time
  expect(component.state).toEqual('State')
  let value2= contactValue;
  component.record=value2;
  tick()
  expect(component.state).toEqual('OtherState')
  let value3= accountValue;
  component.record=value3;
  tick()
  expect(component.state).toEqual('ShippingState')
  component.record= address3;
  tick()
  expect(component.state).toEqual('state')
  component.type='Billing';
  component.record=accountValue;
  tick()
  expect(component.state).toEqual('BillingState')

}));

it('getter method city()', fakeAsync(() => {
  component.type='Shipping'
  let value= accountlocationValue
  component.record=value;
  tick() // waits for some time
  expect(component.city).toEqual('City')
  let value2= contactValue;
  component.record=value2;
  tick()
  expect(component.city).toEqual('OtherCity')
  let value3= accountValue;
  component.record=value3;
  tick()
  expect(component.city).toEqual('ShippingCity')
  component.record= address3;
  tick()
  expect(component.city).toEqual('city')
  component.type='Billing';
  component.record=accountValue;
  tick()
  expect(component.city).toEqual('BillingCity')
  component.type='Billing';
  component.record=contactValue;
  tick()
  expect(component.city).toEqual('MailingCity')

}));

it('getter method postalCode()', fakeAsync(() => {
  component.type='Shipping'
  let value= accountlocationValue
  component.record=value;
  tick() // waits for some time
  expect(component.postalCode).toEqual('PostalCode')
  let value2= contactValue;
  component.record=value2;
  tick()
  expect(component.postalCode).toEqual('OtherPostalCode')
  let value3= accountValue;
  component.record=value3;
  tick()
  expect(component.postalCode).toEqual('ShippingPostalCode')
  component.record= address3;
  tick()
  expect(component.postalCode).toEqual('postalCode')
  component.type='Billing';
  component.record=accountValue;
  tick()
  expect(component.postalCode).toEqual('BillingPostalCode')
  component.type='Billing';
  component.record=contactValue;
  tick()
  expect(component.postalCode).toEqual('MailingPostalCode')

}));

it('getter method stateCode()', fakeAsync(() => {
  component.type='Shipping'
  let value= accountlocationValue
  component.record=value;
  tick() // waits for some time
  expect(component.stateCode).toEqual('State')
  let value2= contactValue;
  component.record=value2;
  tick()
  expect(component.stateCode).toEqual('OtherStateCode')
  let value3= accountValue;
  component.record=value3;
  tick()
  expect(component.stateCode).toEqual('ShippingStateCode')
  component.record= address3;
  tick()
  expect(component.stateCode).toEqual('stateCode')
  component.type='Billing';
  component.record=accountValue;
  tick()
  expect(component.stateCode).toEqual('BillingStateCode')

}));

it('testing ngOnInit()', fakeAsync(() => {
  component.record=address3;
  component.ngOnInit();
  expect(component.entity).toBeInstanceOf(Account);
  component.cityLabel$.subscribe(c=>{
    expect(c).toEqual('anypostalorcity')
  })
  component.postalCodeLabel$.subscribe(c=>{
    expect(c).toEqual('anypostalorcity')
  })
  
}));

});
