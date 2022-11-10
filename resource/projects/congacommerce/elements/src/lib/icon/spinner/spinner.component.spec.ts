import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule as BSPopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../icon.module'
import { SpinnerComponent } from './spinner.component';
import { ComponentFixture, fakeAsync, TestBed, tick,ComponentFixtureAutoDetect  } from '@angular/core/testing';
import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

describe('Spinnercomponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            CommonModule,
            IconModule,
            RouterModule,
            FormsModule,
            BSPopoverModule.forRoot(),
            TranslateModule.forChild()
          ],
          declarations: [SpinnerComponent]
    }
        )
    .compileComponents();
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('the component is called.', () => {
    expect(component).toBeTruthy()
  });

});