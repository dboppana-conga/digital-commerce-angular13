import {combineLatest,  Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { AObjectService, AObject, MetadataService } from '@congacommerce/core';

/**
 * Dependent picklist component displays picklist values with country and state inforamtion of user's address record.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/dependentCountryStatePickList.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { DependentPicklistModule } from '@congacommerce/elements';
@NgModule({
  imports: [DependentPicklistModule, ...]
})
export class AppModule {}
 ```
*
* @example
 ```typescript
* <apt-dependent-picklist
*               [(ngModel)]="myModel"
*               [fieldMethod]="fieldService"
*               [field]="stateCode"
*               [parentField]="countryCode"
*               [inline]="isInline"
*               [size]="inputSize"
* ></apt-dependent-picklist>
 ```
*/

@Component({
    selector: 'apt-dependent-picklist',
    template: `
    <div [class.d-flex]="inline" *ngIf="view$ | async as view">
      <div *ngIf="view.parentDescribe as parentDescribe" class="form-group" [class.mr-3]="inline">
        <label for="parentField">{{parentDescribe?.label}}</label>
        <select class="custom-select" [class.custom-select-sm]="size === 'sm'" [(ngModel)]="view.parentValue" name="parentValue" (ngModelChange)="parentChange($event)" [class.custom-select-lg]="size === 'lg'" id="parentField" required="" name="parentField" [disabled]="parentDescribe?.updateable === false">
          <option [value]="" *ngIf="parentDescribe?.nillable">{{'DEPENDENT_PICKLIST.CHOOSE' | translate}}...</option>
          <option *ngFor="let picklist of parentDescribe?.picklistValues" [value]="picklist.value" [hidden]="!picklist.active">{{picklist.label}}</option>
        </select>
      </div>
      <div *ngIf="view.fieldDescribe as fieldDescribe" class="form-group">
        <label for="childField">{{fieldDescribe?.label}}</label>
        <select class="custom-select" [class.custom-select-sm]="size === 'sm'" [(ngModel)]="view.value" name="value" (ngModelChange)="childChange($event)" [class.custom-select-lg]="size === 'lg'" id="childField" required="" name="childField" [disabled]="fieldDescribe?.updateable === false || !view?.childOptions">
          <option [value]="" *ngIf="fieldDescribe?.nillable">{{'DEPENDENT_PICKLIST.CHOOSE' | translate}}...</option>
          <option *ngFor="let picklist of view.childOptions" [value]="picklist.value" [hidden]="!picklist.active">{{picklist.label}}</option>
        </select>
      </div>
    </div>
  `,
    styles: [],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: DependentPicklistComponent,
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.Default
})
export class DependentPicklistComponent implements OnChanges, ControlValueAccessor, OnDestroy {
    /**
     * AObjectService reference
     */
    @Input('entity') entity: AObject;
    /**
     * Field.
     */
    @Input('field') field: string;
    /**
     * Parent field.
     */
    @Input('parentField') parentField: string;
    /**
     * Flag to set this as an inline element.
     */
    @Input('inline') inline: boolean = true;
    /**
     * Size of the input.
     */
    @Input('size') size: 'sm' | 'md' | 'lg' = 'md';
    /**
     * Used to hold information for rendering the view.
     */
    view$: BehaviorSubject<DependentPicklistView> = new BehaviorSubject<DependentPicklistView>(null);
    /**
     * @ignore
     */
    subscription: Subscription;
    /**
     * Current selected value.
     */
    value: [string, string];

    constructor(private metadataService: MetadataService) { }

    /**
    * Stores the picklist values of address fields like country and state which are displayed on initial page load. Picklist values are based on type of address as per user preference. Different address type values can be mailing address, billing address, shipping address etc.
    */
    ngOnChanges() {
        // this.valueSub = Observable.from(this.value);
        this.ngOnDestroy();
        const service = this.metadataService.getAObjectServiceForType(this.entity);
        this.subscription = combineLatest(service.describe(this.entity.getType(), this.parentField), service.describe(this.entity.getType(), this.field))
            .subscribe(r => {
                this.view$.next({
                    parentDescribe: _.first(r),
                    fieldDescribe: _.last(r)
                });
               this.updateView();
            }
        );
    }

    ngOnDestroy() {
        if(!_.isNil(this.subscription))
            this.subscription.unsubscribe();
    }

    /**
     * Sets the country and corresponding state inforamtion selected by the user from dropdown.
    * @param evt Event associated with the user action.
    */
    parentChange(evt) {
        const state = this.view$.value;
        state.value = '';
        const countryIdx = _.findIndex(state.parentDescribe.picklistValues, (c: any) => c.value === evt);
        state.childOptions = _.filter(_.get(state, 'fieldDescribe.picklistValues'), s => testBit(b64bin(s.validFor), countryIdx));
        state.parentValue = _.get(_.find(_.get(state, 'parentDescribe.picklistValues'), y => y.value === evt), 'value');
        this.value = [_.find(_.get(state, 'parentDescribe.picklistValues'), y => y.value === state.parentValue), _.find(_.get(state, 'fieldDescribe.picklistValues'), y => y.value === state.value)];
        if(this.onChange)
           this.onChange(this.value);
    }

    /**
     * Sets the state inforamtion selected by the user from dropdown.
    * @param evt Event associated with the user action.
    */
    childChange(evt){
        const state = this.view$.value;
        state.value = evt;
        this.value = [_.find(_.get(state, 'parentDescribe.picklistValues'), y => y.value === state.parentValue), _.find(_.get(state, 'fieldDescribe.picklistValues'), y => y.value === state.value)];
          if(this.onChange)
            this.onChange(this.value);
    }

    /**
     * Sets the value property to the option selected in the dropdown.
    * @param value selected by user from the picklist.
    */
    onChange;
    writeValue(value: [string, string]) {
        this.value = value;
        if(value && this.view$.value) this.updateView();
    }
    /**
    * @ignore
    */
    registerOnChange(fn) { this.onChange = fn; }
    /**
    * @ignore
    */
    registerOnTouched(fn) { }

    /**
    * @ignore
    */
    updateView() {
        if(this.value && this.view$.value){
            const state=this.view$.value;
            state.parentValue =  _.get(_.find(_.get(state, 'parentDescribe.picklistValues'), y => y.label === _.first(this.value)), 'value');
            const countryIdx = _.findIndex(state.parentDescribe.picklistValues, (c: any) => c.value === state.parentValue);
            state.childOptions = _.filter(_.get(state, 'fieldDescribe.picklistValues'), s => testBit(b64bin(s.validFor), countryIdx));
            state.value =  _.get(_.find(_.get(state, 'fieldDescribe.picklistValues'), y => y.label === _.last(this.value)), 'value');
            this.value = [_.find(_.get(state, 'parentDescribe.picklistValues'), y => y.value === state.parentValue), _.find(_.get(state, 'fieldDescribe.picklistValues'), y => y.value === state.value)];
        }
    }
}

/**
 * @ignore
* @param a string value str representing country or state information.
* @returns a result array containing b64 conversion of input string paramater.
*/
function b64bin(str) {
    let chars = str.split('');
    let bits = '';

    for (let n = 0; n < chars.length; n++) {
        let bit = '';
        let num = b64a[chars[n]];
        let bin = num.toString(2);
        for (let i = 6 - bin.length; i > 0; i--) {
            bit += '0';
        }
        bit += bin;
        bits += (bit);
    }

    let result = [];
    while (bits.length) {
        result.push(bits.substr(0, 8));
        bits = bits.substr(8);
    }
    return result;
}
/**@ignore **/
const b64a = {
    'C': 2, 'B': 1, 'A': 0, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K': 10, 'L': 11,
    'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 30, 'W': 22, 'X': 23,
    'Y': 24, 'Z': 25, 'a': 26, 'b': 27, 'c': 28, 'd': 29, 'e': 30, 'f': 31, 'g': 32, 'h': 33, 'i': 34, 'j': 35,
    'k': 36, 'l': 37, 'm': 38, 'n': 39, 'o': 40, 'p': 41, 'q': 41, 'r': 43, 's': 44, 't': 45, 'u': 46, 'v': 47,
    'w': 48, 'x': 49, 'y': 50, 'z': 51
};

/**
 * 
 * @ignore
 */
function testBit(bytes, pos) {
    let byteToCheck = Math.floor(pos / 8);
    let bit = 7 - (pos % 8);
    return ((Math.pow(2, bit) & bytes[byteToCheck]) >> bit) === 1;
}

/** @ignore */
interface DependentPicklistView {
    parentDescribe: any;
    fieldDescribe: any;
    parentValue?: string;
    value?: string;
    childOptions?: Array<string>;
}