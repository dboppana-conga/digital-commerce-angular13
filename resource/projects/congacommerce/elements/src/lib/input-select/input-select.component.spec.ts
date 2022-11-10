import { ComponentFixture, fakeAsync, TestBed, tick,ComponentFixtureAutoDetect  } from '@angular/core/testing';
import { map} from 'rxjs/operators';
import { of } from 'rxjs';
import { Component, Input, OnInit, OnChanges, EventEmitter, Output, DebugElement, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputSelectComponent } from './input-select.component';
import { By } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';

describe('Input Select Component', () => {
  let component: InputSelectComponent ;
  let fixture: ComponentFixture<InputSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ FormsModule, NgSelectModule],
      declarations: [ InputSelectComponent ],
      providers: [
        FormsModule,
        TranslateModule
        ]})
    .compileComponents().then(() =>{
    fixture = TestBed.createComponent(InputSelectComponent );
    component = fixture.componentInstance;
    }
    );
    fixture.detectChanges();
  });

  it('input variables should display the updated value; Else show default values ', () => {
    expect(component.placeholder).toBe('Select values')//before updating the input variables
    expect(component.picklistType).toBe('picklist')//before updating the input variables
    expect(component.values).toEqual([])//before updating the input variables
    component.placeholder='test holder'
    component.picklistType='multipicklist'
    fixture.detectChanges()
    expect(component.placeholder).toBe('test holder')//After updating the values
    expect(component.picklistType).toBe('multipicklist')
    component.values=[1,'Demo'];
    expect(component.values).toEqual([1,'Demo'])
  });

  it('output variable onChanges should emit when ngModel value changes', () => {
    const dataElement =fixture.debugElement.query(By.css('ng-select'))
    const emitValue=spyOn(component.onChange,'emit')
    dataElement.triggerEventHandler('change', {})
    fixture.detectChanges();
    expect(emitValue).toHaveBeenCalled()
  
   })

});