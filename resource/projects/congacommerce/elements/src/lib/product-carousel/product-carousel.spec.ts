import { ComponentFixture, fakeAsync, TestBed, tick,ComponentFixtureAutoDetect  } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ProductCarouselComponent } from './product-carousel.component';
import { ProductCardModule } from '../product-card/product-card.module';
import { LineitemCardModule } from '../lineitem-card/lineitem-card.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ConfigurationService } from '@congacommerce/core';
import { product, result } from './data';
import { Component, OnChanges, Input, ViewEncapsulation, ChangeDetectionStrategy, QueryList, ViewChildren } from '@angular/core';
import { CarouselComponent } from 'ngx-bootstrap/carousel';

const spy = jasmine.createSpy();
const testWidth = 420;
beforeAll(() => {
  window.addEventListener('resize', spy);
});

describe('ProductCarouselComponent', () => {
  let component: ProductCarouselComponent;
  let component2: CarouselComponent;
  let fixture: ComponentFixture<ProductCarouselComponent>;
  const configSpy= jasmine.createSpyObj<ConfigurationService>(['get'])
  configSpy.get('productIdentifier')
  const childComponent = jasmine.createSpyObj<CarouselComponent>('carouselList',['ngAfterViewInit']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            CommonModule,
            ProductCardModule,
            LineitemCardModule,
            CarouselModule.forRoot()
          ],
        providers:[
            { provide: ConfigurationService, useValue: configSpy },
        ],
          declarations: [ProductCarouselComponent, CarouselComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ProductCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component is called.', () => {
    expect(component).toBeTruthy();
  });

  it('trackbyId() returns the id of the record', () => {
    let value:any;
    value=component.trackById(1,product);
    expect(value).toEqual(product.Id);
  });

  it('ngOnChanges() when carouselList is null and readonly is true', () => {
    spyOn(component,'adjustCarouselSlide')
    component.readonly=true;
    component.carouselList=null;
    component.ngOnChanges();
    expect(component.adjustCarouselSlide).toHaveBeenCalled();
  });

  it('ngOnChanges() when carouselList is null and readonly is false', () => {
    spyOn(component,'adjustCarouselSlide')
    component.carouselList=null;
    component.ngOnChanges();
    expect(component.adjustCarouselSlide).toHaveBeenCalled();
    expect(component.cardType).toEqual('card')
  });

  it('ngOnChanges() when carouselList is not null', () => {
    spyOn(component,'adjustCarouselSlide')
    component.readonly=true;
    component.carouselList=[childComponent] as unknown as QueryList<CarouselComponent>;
    component.ngOnChanges();
    expect(component.adjustCarouselSlide).toHaveBeenCalled();
    expect(childComponent.ngAfterViewInit).toHaveBeenCalled();
  });

  it('adjustCarouselSlide() sets the slides value based on window width; when window width is greater than 992', () => {
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 998})
    component.adjustCarouselSlide();
    expect(component.slides).toEqual(4);
  });

  it('adjustCarouselSlide() sets the slides value based on window width; when window width is greater than 768 less than 992', () => {
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 780})
    component.adjustCarouselSlide();
    expect(component.slides).toEqual(3);
  });

  it('adjustCarouselSlide() sets the slides value based on window width; when window width is greater than 768 less than 992', () => {
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 780})
    component.adjustCarouselSlide();
    expect(component.slides).toEqual(3);
  });

  it('adjustCarouselSlide() sets the slides value based on window width; when window width is less than 768 greater than 576', () => {
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 577})
    component.adjustCarouselSlide();
    expect(component.slides).toEqual(2);
  });

  it('adjustCarouselSlide() sets the slides value based on window width; when window width is less than 576', () => {
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 500})
    component.adjustCarouselSlide();
    expect(component.slides).toEqual(1);
  });



});
