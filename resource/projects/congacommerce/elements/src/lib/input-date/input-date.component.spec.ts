import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { get, isNil } from 'lodash';
import * as momentImported from 'moment';
import { Subscription } from 'rxjs';
import { AObjectService, CacheService, AObject, ConfigurationService, MetadataService } from '@congacommerce/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CartItemService } from '@congacommerce/ecommerce';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OutputFieldModule } from '../output-field/output-field.module';
import { InputDateComponent } from './input-date.component';
import { cartItemValue, cartItemValue2, cartItemValue3 } from './data'

describe('InputDateComponent', () => {
    let component: InputDateComponent;
    let fixture: ComponentFixture<InputDateComponent>;
    let cartItemSpy = jasmine.createSpyObj<CartItemService>(['getTerm', 'getEndDate']);
    let domSpy = jasmine.createSpyObj<DomSanitizer>(['sanitize']);
    domSpy.sanitize.and.returnValue('2/2/2022');
    let configSpy = jasmine.createSpyObj<ConfigurationService>(['get'])
    configSpy.get('productIdentifier');
    let aSpy = jasmine.createSpyObj<AObjectService>(['guid']);
    aSpy.guid.and.returnValue('test');


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                DatepickerModule.forRoot(),
                BsDatepickerModule.forRoot(),
                TranslateModule.forChild(),
                OutputFieldModule
            ],
            providers: [
                { provide: CartItemService, useValue: cartItemSpy },
                { provide: ConfigurationService, useValue: configSpy },
                { provide: DomSanitizer, useValue: domSpy },
                { provide: MetadataService, useValue: {} },
                { provide: AObjectService, useValue: aSpy },
            ],
            declarations: [InputDateComponent],
        }
        )
            .compileComponents();
        fixture = TestBed.createComponent(InputDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('to be created.', () => {
        expect(component).toBeTruthy()
    });

    it('isValidDate returns true when date is not null or "Invalid date" else false', () => {
        let value:any;
        value=component.isValidDate('date')
        expect(value).toBeTrue()
        value=component.isValidDate(null)
        expect(value).toBeFalse()
        value=component.isValidDate('Invalid date')
        expect(value).toBeFalse()
    });

    it('ngOnChanges() sets the cartitems start and end date; and Startdate and enddate based on the conditions', () => {
        component.cartItem=cartItemValue;
        component.ngOnChanges();
        expect(component.cartItem.StartDate).toEqual('2023-03-03');
        expect(component.cartItem.EndDate).toEqual('2023-04-04');
    });

    it('ngOnChanges() sets the cartitems start and end date; and Startdate and enddate based on the conditions; when startdate and enddate are not passed in cartitem object', () => {
        let value,value2:any;
        component.cartItem=cartItemValue2;
        component.ngOnChanges();
        value=component.moment(component.cartItem.StartDate).format('YYYY-MM-DD') 
        value2=component.moment(component.cartItem.EndDate).format('YYYY-MM-DD') 
        expect(component.cartItem.StartDate).toEqual(value);
        expect(component.cartItem.EndDate).toEqual(value2);
    });

    it('endDateChange sets the cartitems start and end date; and Startdate and enddate based on the conditions; when startdate and enddate are not passed in cartitem object', () => {
        let event= new Date()
        component.cartItem=cartItemValue2;
        cartItemSpy.getTerm.and.returnValue(2)
        component.endDateChange(event);
        expect(component.cartItem.SellingTerm).toEqual(2);
        expect(component.cartItem.EndDate).toEqual('2022-02-02');
    });

    it('endDateChange sets the cartitems start and end date; and Startdate and enddate based on the conditions; when startdate and enddate are not passed in cartitem object', () => {
        let event= new Date()
        component.cartItem=cartItemValue3;
        cartItemSpy.getTerm.and.returnValue(2)
        component.endDateChange(event);
        expect(component.cartItem.SellingTerm).toBeUndefined();
    });

    it('startDateChange sets the cartitems start and end date; and Startdate and enddate based on the conditions; when startdate and enddate are not passed in cartitem object', () => {
        let event= new Date()
        let date= new Date('2022-02-02')
        component.cartItem=cartItemValue2;
        cartItemSpy.getTerm.and.returnValue(2)
        cartItemSpy.getEndDate.and.returnValue(date)
        component.startDateChange(event);
        expect(component.cartItem.SellingTerm).toEqual(2);
    });


});