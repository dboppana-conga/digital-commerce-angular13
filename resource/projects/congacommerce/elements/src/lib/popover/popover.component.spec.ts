import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule as BSPopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../icon/icon.module';
import { PopoverComponent } from './popover.component';
import { ComponentFixture, fakeAsync, TestBed, tick,ComponentFixtureAutoDetect  } from '@angular/core/testing';
import { PopoverService } from './services/popover.service';
import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

describe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;


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
          providers: [PopoverService],
          declarations: [PopoverComponent]
    }
        )
    .compileComponents();
    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('ngOnChanges should be called when the component is called.', () => {
    component.ngOnChanges()
    expect(component).toBeTruthy()
  });

});