import { ComponentFixture, fakeAsync, TestBed, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Component, Input, OnInit, OnChanges, EventEmitter, Output, DebugElement } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputQuantityComponent } from './input-quantity.component';
import { TranslatePipeMock } from './data/datamanager';
import { By } from '@angular/platform-browser';
import { ExceptionService } from '@congacommerce/elements';

describe('Input Quantity Component', () => {
  let component: InputQuantityComponent;
  let fixture: ComponentFixture<InputQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [InputQuantityComponent, TranslatePipeMock],
      providers: [
        FormsModule,
        TranslateModule,
        {
          provide: TranslatePipe,
          useClass: TranslatePipeMock
        }
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(InputQuantityComponent);
        component = fixture.componentInstance;
      }
      );
    fixture.detectChanges();
  });

  it('quantity value should be set to min value passed by user; Else default should be 1', () => {
    component.min = 10
    expect(component.quantity).toEqual(1);
    component.ngOnInit()// after calling ngOnInit the quantity value updates
    expect(component.quantity).toEqual(10);
  });

  it('writeValue() Updates the quantity every time user changes the input controller; Else default should be min value', () => {
    component.min = 10
    component.writeValue(1);
    expect(component.quantity).toEqual(10)
    component.writeValue(21);
    expect(component.quantity).toEqual(21)

  });

  it('writeValue() with default value set anf greater tha min value; Else default should be min value', () => {
    component.min = 10
    component.default = 22;
    component.ngOnChanges();
    expect(component.max).toEqual(9999999)
    expect(component.quantity).toEqual(22)
    component.default = 2;
    component.ngOnChanges();
    expect(component.quantity).toEqual(10)
  });

  it('writeValue() with default value set anf greater tha min value; Else default should be min value', () => {
    component.min = null;
    component.default = null;
    component.ngOnChanges();
    expect(component.min).toEqual(1)
    expect(component.quantity).toEqual(1)
  });

  it('button event decrease() should be called; when quantity is greater than min value', () => {
    const comp = new InputQuantityComponent();
    component.quantity = 5
    component.min = 4;
    const evt = new Event('click');
    spyOn(evt, 'stopPropagation');
    spyOn(component, 'propagateChange')
    component.decrease(evt);
    expect(component.propagateChange).toHaveBeenCalled();
    expect(evt.stopPropagation).toHaveBeenCalled();
    expect(component.quantity).toEqual(4);
  });

  it('button event decrease() should be called; when quantity is lesser than min value', () => {
    const comp = new InputQuantityComponent();
    component.quantity = 3;
    component.min = 5;
    const evt = new Event('click');
    spyOn(evt, 'stopPropagation');
    spyOn(component, 'propagateChange')
    component.decrease(evt);
    expect(component.propagateChange).toHaveBeenCalled();
    expect(evt.stopPropagation).toHaveBeenCalled();
    expect(component.quantity).toEqual(5);
  });


  it('button event increase() should be called; when quantity is lesser than max value', () => {
    component.max = 3;
    component.quantity = 2;
    const comp = new InputQuantityComponent();
    const evt = new Event('click');
    spyOn(evt, 'stopPropagation');
    spyOn(component, 'propagateChange')
    component.increase(evt);
    expect(component.propagateChange).toHaveBeenCalled()
    expect(evt.stopPropagation).toHaveBeenCalled()
    expect(component.quantity).toEqual(3);
  });

  it('button event increase() should be called; when quantity is greater than max value', () => {
    component.max = 3;
    component.quantity = 20;
    const comp = new InputQuantityComponent();
    const evt = new Event('click');
    spyOn(evt, 'stopPropagation');
    spyOn(component, 'propagateChange')
    component.increase(evt);
    expect(component.propagateChange).toHaveBeenCalled()
    expect(evt.stopPropagation).toHaveBeenCalled()
    expect(component.quantity).toEqual(3);
  });

  it('ngModel should update the values when passed', () => {
    expect(component.quantity).toEqual(1)
    const modelInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('.quantity');
    fixture.detectChanges();
    modelInput.valueAsNumber = 1000;
    modelInput.dispatchEvent(new Event('input'));// angular detects input value changes
    expect(component.quantity).toBe(1000)

  })

  it('propagateChange() should be called when ngModel value changes', () => {
    const dataElement = fixture.debugElement.query(By.css('.quantity'))
    spyOn(component, 'propagateChange')
    dataElement.triggerEventHandler('change', {})
    fixture.detectChanges();
    expect(component.propagateChange).toHaveBeenCalled()

  })





});



