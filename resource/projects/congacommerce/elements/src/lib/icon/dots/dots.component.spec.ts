import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule as BSPopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../icon.module'
import { DotsComponent } from './dots.component';
import { ComponentFixture, fakeAsync, TestBed, tick,ComponentFixtureAutoDetect  } from '@angular/core/testing';
import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

describe('DotsComponent', () => {
  let component: DotsComponent;
  let fixture: ComponentFixture<DotsComponent>;


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
          declarations: [DotsComponent]
    }
        )
    .compileComponents();
    fixture = TestBed.createComponent(DotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('the component is called.', () => {
    expect(component).toBeTruthy()
  });

});