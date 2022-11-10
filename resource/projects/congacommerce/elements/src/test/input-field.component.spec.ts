import { ChangeDetectorRef } from "@angular/core";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AObjectService, ApiService, MetadataService } from "@congacommerce/core";
import { Quote } from "@congacommerce/ecommerce";
import { InputFieldComponent } from "@congacommerce/elements";
import { TranslateService } from "@ngx-translate/core";
import { plainToClass } from "class-transformer";
import { of } from "rxjs";
import { ACCOUNT_LOOKUP, QUOTE_MOCK_DATA } from "./data/data-manager";

describe('InputFieldComponent', () => {

    const aObjectServiceSpy = jasmine.createSpyObj<AObjectService>(['describe', 'guid']);
    aObjectServiceSpy.guid.and.returnValue('test');
    const metadataSpy = jasmine.createSpyObj('MetadataService', ['getAObjectServiceForType', 'getTypeByApiName'])
    const apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    const translateServiceSpy = jasmine.createSpyObj<TranslateService>(['stream']);
    translateServiceSpy.stream.and.returnValue(of('string'));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InputFieldComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: ApiService, useValue: apiSpy },
                { provide: TranslateService, useValue: translateServiceSpy },
                { provide: AObjectService, useValue: aObjectServiceSpy },
                { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj<ChangeDetectorRef>(['detectChanges']) },
                { provide: MetadataService, useValue: metadataSpy },
            ]
        }).compileComponents();
    });

    it('check component loaded', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('Call onPickChange() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        const mySpy = spyOn(app, 'propagateChange');
        app.onPickChange('Account');
        expect(app.value).toEqual('Account');
        expect(mySpy).toHaveBeenCalled();
    });

    it('Call onDateChange() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        const date = new Date()
        spyOn(app, 'writeValue');
        app.onDateChange(date);
        expect(app.writeValue).toHaveBeenCalled();
    });

    it('Call writeValue() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        spyOn(app, 'setLookupFieldData');
        spyOn(app, 'propagateChange');
        app.writeValue('account');
        expect(app.setLookupFieldData).toHaveBeenCalled();
        expect(app.propagateChange).toHaveBeenCalled();
        expect(app.value).toEqual('account')
    });

    describe('Call setDisabledState() method', () => {
        it('Should set false', () => {
            const fixture = TestBed.createComponent(InputFieldComponent);
            const app = fixture.componentInstance;
            app.setDisabledState(false);
            expect(app.disabled).toEqual(false);
        });
        it('Should set true', () => {
            const fixture = TestBed.createComponent(InputFieldComponent);
            const app = fixture.componentInstance;
            app.setDisabledState(true);
            expect(app.disabled).toEqual(true);
        });
    });

    it('Call onBooleanChange() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        const date = new Date()
        spyOn(app, 'propagateChange');
        app.onBooleanChange(date);
        expect(app.propagateChange).toHaveBeenCalled();
    });

    it('Call onCurrencyChange() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        spyOn(app, 'propagateChange');
        app.onCurrencyChange('USD');
        expect(app.propagateChange).toHaveBeenCalled();
    });

    it('Call onMultiChange() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        spyOn(app, 'propagateChange');
        app.onMultiChange('USD');
        expect(app.propagateChange).toHaveBeenCalled();
    });

    it('Call onPickChange() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        spyOn(app, 'propagateChange');
        app.onPickChange('User1');
        expect(app.propagateChange).toHaveBeenCalled();
        expect(app.value).toEqual('User1');
    });

    it('Call onLookupChange() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        spyOn(app, 'propagateChange');
        app.onLookupChange('ffcc058e-b8ef-4e55-bb8c-3f04df488cfe', ACCOUNT_LOOKUP);
        expect(app.propagateChange).toHaveBeenCalled();
    });

    it('Call getEntityType() method', () => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        app.entity = plainToClass(Quote, QUOTE_MOCK_DATA);
        const mySpy = spyOn(app.entity, 'getType').and.callThrough();
        const result = app.getEntityType();
        expect(mySpy).toHaveBeenCalled();
    });

    it('Call onLookupSearch() method', fakeAsync(() => {
        const fixture = TestBed.createComponent(InputFieldComponent);
        const app = fixture.componentInstance;
        const mySpy = spyOn(app, 'setLookupFieldData').and.callThrough();
        app.onLookupSearch('Test1');
        flush();
        expect(mySpy).toHaveBeenCalled();
    }));

    describe('Call getsetValue() method', () => {
        it('Should return false', () => {
            const fixture = TestBed.createComponent(InputFieldComponent);
            const app = fixture.componentInstance;
            spyOn(app, 'propagateChange');
            const result = app.getsetValue('NOT_A_VALUE');
            expect(result.val).toEqual(false);
        });
        it('Should return true', () => {
            const fixture = TestBed.createComponent(InputFieldComponent);
            const app = fixture.componentInstance;
            app.value = 'account'
            spyOn(app, 'propagateChange');
            const result = app.getsetValue('account');
            expect(result.value).toEqual(true);
        });
    })
});