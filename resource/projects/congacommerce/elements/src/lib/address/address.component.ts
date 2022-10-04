import { map } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm, ControlContainer } from '@angular/forms';

import { AccountLocation, Account, Contact, AccountService, ContactService, AccountLocationService, Order } from '@congacommerce/ecommerce';

import * as _ from 'lodash';
import { AObjectService, AObject } from '@congacommerce/core';
import { Address } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/**
 * The Address component allows users to enter address details. The details include street name, city name, country code, state code and zip code.
 * When a user tries to add a new address or update an existing address associated with his account, he can fill in details like street, city name and zip in the respective text boxes provided.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/address.png" style="max-width: 100%">
 * 
 * <h3>Usage</h3>
 *
 ```typescript
import { AddressModule } from '@congacommerce/elements';
@NgModule({
  imports: [AddressModule, ...]
})
export class AppModule {}
```
*
* @example
```typescript
* <apt-address
*              [(ngModel)]="contact"
*              [readonly]="readonly"
*              [type]="Shipping"
*              [form]="form"
* ></apt-address>
```
*/

@Component({
  selector: 'apt-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AddressComponent,
    multi: true
  }],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class AddressComponent implements ControlValueAccessor, OnInit {
  /**
   * Flag to set this form as read only or as an editable form.
   */
  @Input() readonly: boolean = false;
  /**
   * Set the address as either billing or shipping.
   */
  @Input() type: 'Billing' | 'Shipping' = 'Billing';
  /**
   * Set the layout for the displayed label and value.
   */
  @Input() layout: 'Block' | 'Inline' = 'Block';
  /**
   * NgForm object to bind data to.
   */
  @Input() form: NgForm = new NgForm(null, null);
  /**
   * Value is setter method to set the user's address details.
   */
  @Input()
  set value(record: AccountLocation | Account | Contact | Address) {
    if(record && (record instanceof AccountLocation || record instanceof Account || record instanceof Contact) ) {
      this.record = record;
    }
  }
  /**
   * Set the label as either billing address or shipping address.
   */
   @Input() label: string;
  /**
   * Observable for the city label.
   * @ignore
   */
  cityLabel$: Observable<string>;
  /**
   * Observable for the postal code label.
   * @ignore
   */
  postalCodeLabel$: Observable<string>;
  /**
  * A string value to generate a unique id for street name, city name or postal code of user's address record.
   * @ignore
  */
  uniqueId: string;
  /**
   * A variable to hold user's address details.
   * @ignore
   */
  record: AccountLocation | Account | Contact | Address;
  /**
   * Holds the current selected value of the state input.
   * @ignore
   */
  countryState: any;
  /**
   * A new instance of Account
   * @ignore
   */
  entity: Account = new Account();


  /**
    * @returns a string value representing the street details on user's address record.
    * The return value holds the street information of an address type. Different address type values can be mailing address, billing address, shipping address etc.
   * @ignore
  */
  get street() {
    if (this.record instanceof AccountLocation || _.get(this.record, 'Street'))
      return 'Street';
    else if (_.get(this.record, 'street'))
      return 'street';
    else if (this.record instanceof Contact || _.get(this.record, 'MailingStreet'))
      return (this.type === 'Billing') ? 'MailingStreet' : 'OtherStreet';
    else
      return (this.type === 'Billing') ? 'BillingStreet' : 'ShippingStreet';
  }

  /**
    * @returns a string value representing the city details on user's address record.
    * The return value holds the city information of an address type. Different address type values can be mailing address, billing address, shipping address etc.
   * @ignore
  */
  get city() {
    if (this.record instanceof AccountLocation || _.get(this.record, 'City'))
      return 'City';
    else if (_.get(this.record, 'city'))
      return 'city';
    else if (this.record instanceof Contact || _.get(this.record, 'MailingCity'))
      return (this.type === 'Billing') ? 'MailingCity' : 'OtherCity';
    else
      return (this.type === 'Billing') ? 'BillingCity' : 'ShippingCity';
  }

  /**
    * @returns a string value representing the state property on user's address record.
    * The return value defines a picklist with state names for the selected country.
   * @ignore
  */
  get state() {
    if (this.record instanceof AccountLocation || _.get(this.record, 'State'))
      return 'State';
    else if (_.get(this.record, 'state'))
      return 'state';
    else if (this.record instanceof Contact || _.get(this.record, 'MailingState'))
      return (this.type === 'Billing') ? 'MailingState' : 'OtherState';
    else
      return (this.type === 'Billing') ? 'BillingState' : 'ShippingState';
  }

  /**
    * @returns a string value representing the state property on user's address record.
    * The return value defines a picklist with state codes for the selected country code.
   * @ignore
  */
  get stateCode() {
    if (this.record instanceof AccountLocation || _.get(this.record, 'State'))
      return 'State';
    else if (_.get(this.record, 'stateCode'))
      return 'stateCode';
    else if (this.record instanceof Contact || _.get(this.record, 'MailingStateCode'))
      return (this.type === 'Billing') ? 'MailingStateCode' : 'OtherStateCode';
    else
      return (this.type === 'Billing') ? 'BillingStateCode' : 'ShippingStateCode';
  }

  /**
    * @returns a string value representing the postal code property on user's address record.
    * The return value holds the zip code information of an address type. Different address type values can be mailing address, billing address, shipping address etc.
   * @ignore
  */
  get postalCode() {
    if (this.record instanceof AccountLocation || _.get(this.record, 'PostalCode'))
      return 'PostalCode';
    else if (_.get(this.record, 'postalCode'))
      return 'postalCode';
    else if (this.record instanceof Contact || _.get(this.record, 'MailingPostalCode'))
      return (this.type === 'Billing') ? 'MailingPostalCode' : 'OtherPostalCode';
    else
      return (this.type === 'Billing') ? 'BillingPostalCode' : 'ShippingPostalCode';
  }

  /**
    * @returns a string value representing the country property based on the type of user's address record.
    * The return value defines a picklist with country names in address record.
   * @ignore
  */
  get country() {
    if (this.record instanceof AccountLocation || _.get(this.record, 'Country'))
      return 'Country';
    else if (_.get(this.record, 'country'))
      return 'country';
    else if (this.record instanceof Contact || _.get(this.record, 'MailingCountry'))
      return (this.type === 'Billing') ? 'MailingCountry' : 'OtherCountry';
    else
      return (this.type === 'Billing') ? 'BillingCountry' : 'ShippingCountry';
  }

  /**
    * @returns a string value representing the country code property based on the type of user's address record.
    * The return value defines a picklist with country codes in address record.
   * @ignore
  */
  get countryCode() {
    if (this.record instanceof AccountLocation || _.get(this.record, 'Country'))
      return 'Country';
    else if (_.get(this.record, 'countryCode'))
      return 'countryCode';
    else if (this.record instanceof Contact || _.get(this.record, 'MailingCountryCode'))
      return (this.type === 'Billing') ? 'MailingCountryCode' : 'OtherCountryCode';
    else
      return (this.type === 'Billing') ? 'BillingCountryCode' : 'ShippingCountryCode';
  }

  /**
    * @param evt Event associated with the user action.
    * Sets the country and state information selected by the user.
   * @ignore
  */
  countryStateChange([parent, child]) {
    const country = (_.isNil(parent)) ? '' : _.get(parent, 'label');
    const state = (_.isNil(child)) ? '' : _.get(child, 'label');
    if (this.record instanceof Contact) {
      _.set(this.record, `${this.countryCode}`, _.get(parent, 'value'));
      _.set(this.record, `${this.stateCode}`, _.get(child, 'value'));
      _.set(this.record, `${this.country}`, country);
      _.set(this.record, `${this.state}`, state);
    }
    else {
      _.set(this.record, `${this.country}`, country);
      _.set(this.record, `${this.state}`, state);
    }
  }
  
  

  /**
     * Constructor for Address Component for injecting dependencies.
     *
     * @param accountLocationService Instance of AccountLocationService
     * @param contactService Instance of ContactService
     * @param accountService Instance of AccountService
     * @param aobjectService Instance of AObjectService
     * @param translateService Instance of TranslateService
     */
  constructor(private accountLocationService: AccountLocationService, private contactService: ContactService, private accountService: AccountService, private aobjectService: AObjectService, private translateService: TranslateService) {
    this.uniqueId = _.uniqueId();
  }

  ngOnInit() {
    const entity = !(this.record instanceof AObject) ? new Account() : this.record;
    this.cityLabel$ = this.aobjectService.describe(entity.getType(), this.city).pipe(map(res => _.get(res, 'label')));
    this.postalCodeLabel$ = this.aobjectService.describe(entity.getType(), this.postalCode).pipe(map(res => _.get(res, 'label')));
  }

  /**
     * @ignore
     *
  */
  writeValue(value: AccountLocation | Account | Contact) {
    this.record = value;
    if (this.record instanceof AccountLocation) {
      this.countryState = [this.record.Country, this.record.State];
    }
  }

  /**
   * @ignore
   */
  registerOnChange(fn) { }
  /**
   * @ignore
   */
  registerOnTouched(fn) { }

  /**
     * @returns unique id which is associated to the address fields entered. Address details iclude street name, city name and zip code.
     * @param id Address type for which a unique id has to be generated.
   * @ignore
  */
  getId(id: string): string {
    return this.uniqueId + '_' + id;
  }

}