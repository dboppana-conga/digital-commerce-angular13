import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceModalComponent } from './price-modal.component';

describe('PriceModalComponent', () => {
  let component: PriceModalComponent;
  let fixture: ComponentFixture<PriceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
