import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule as BSPopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../../icon/icon.module';
import { ComponentFixture, fakeAsync, TestBed, tick,ComponentFixtureAutoDetect  } from '@angular/core/testing';
import { PopoverService } from './popover.service';

describe('PopoverServiceService', () => {
    let service: PopoverService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                IconModule,
                RouterModule,
                FormsModule,
                BSPopoverModule.forRoot(),
                TranslateModule.forChild()
              ],
              providers: [PopoverService]
        });
        service= TestBed.inject(PopoverService);
    })

    it('service should be created', () =>{
        expect(service).toBeTruthy();
    });

})