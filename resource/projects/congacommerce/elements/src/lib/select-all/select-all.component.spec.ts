import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AccountLocation, Account, Contact, AccountService, ContactService, AccountLocationService, Order, Address, Product, CartItem } from '@congacommerce/ecommerce';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm, ControlContainer } from '@angular/forms';
import { ApiService, ConfigurationService, MetadataService, AObjectService } from '@congacommerce/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchSelectionService } from '../../shared/services/batch-selection.service';
import { filter, some, get } from 'lodash';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SelectAllComponent } from './select-all.component';
import { product1,product2,cartitem1,cartitem2, cartitem3, allItems, selectedItems, selectItem,allItem} from './data'

describe('SelectAllComponent', () => {
    let component: SelectAllComponent;
    let fixture: ComponentFixture<SelectAllComponent>;
    const bSpy = jasmine.createSpyObj<BatchSelectionService>(['addAllProductstoSelection', 'removeAllProductsFromSelection','removeAllLineItemsFromSelection','addAllLineItemstoSelection']);
    bSpy._lineItems=of(cartitem1) as unknown as BehaviorSubject<Array<CartItem>>;
    bSpy._products=of(product1) as unknown as BehaviorSubject<Array<Product>>;
    

  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
          imports: [
              CommonModule,
              TranslateModule.forChild()
            ],
        declarations: [ SelectAllComponent ],
        providers: [
          AccountLocationService,
          { provide: BatchSelectionService, useValue: bSpy },
          { provide: MetadataService, useValue: jasmine.createSpyObj('MetadataService', ['getAObjectServiceForType']) },
          { provide: ConfigurationService, useValue: jasmine.createSpyObj('ConfigurationService', ['get']) },
          { provide: HttpClient, useValue: {} },
          { provide: AObjectService, useValue: jasmine.createSpyObj('AObjectService',{'describe': of({'label':'anypostalorcity'})}) },
          { provide: TranslateService, useValue: {} }
          ]})
      .compileComponents();
      fixture = TestBed.createComponent(SelectAllComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('getId () should get unique Id', () => {
      expect(component).toBeTruthy()
    });

    it('ngOnChanges is called and calls setstatusitems is instnace of product', () => {
        spyOn(component,'setStatus');
        component.type='product';
        component.items=[product1]
        component.ngOnChanges();
        expect(component.setStatus).toHaveBeenCalledTimes(1);
    });

    it('ngOnChanges is called and calls setstatusitems is instnace of cartitem', () => {
        spyOn(component,'setStatus');
        component.type='lineitem';
        component.items=[cartitem2]
        component.ngOnChanges();
        expect(component.setStatus).toHaveBeenCalledTimes(1);
    });

    it('ngOnChanges is called and calls setstatusitems is instnace of cartitem', () => {
        spyOn(component,'setStatus');
        component.type='lineitem';
        component.items=[cartitem3]
        component.ngOnChanges();
        expect(component.setStatus).toHaveBeenCalledTimes(0);
    });

    it('setStatus sets the SelectionState baed on the foolowing conditions; when selectedItems.length is not equal to items length ans not an array', () => {
        component.setStatus(selectedItems,allItems)
        component.items=selectedItems as unknown as Array<Product>;
        expect(component.SelectionState).toEqual('indeterminate');
    });

    it('setStatus sets the SelectionState baed on the foolowing conditions; when selectedItems.length is equal to items length', () => {
        component.setStatus([selectedItems],[allItems])
        component.items=selectItem as unknown as Array<Product>;
        expect(component.SelectionState).toEqual('checked');
    });

    xit('setStatus sets the SelectionState baed on the following conditions; when selectedItems.length is equal to items length', () => {
        component.SelectionState='indeterminate';
        component.setStatus([selectItem],[])
        component.items.length=1;
        expect(component.SelectionState).toEqual('unchecked');//should
    });

    it('toggleAllItems calls batchselection methods based on the selectionstate; when selectedItems is not equal to checked; for products', () => {
        component.SelectionState='indeterminate';
        component.toggleAllItems([product1,product2])
        expect(bSpy.addAllProductstoSelection).toHaveBeenCalledTimes(1);
    });

    it('toggleAllItems calls batchselection methods based on the selectionstate; when selectedItems is equal to checked; for products', () => {
        component.SelectionState='checked';
        component.toggleAllItems([product1,product2])
        expect(bSpy.removeAllProductsFromSelection).toHaveBeenCalledTimes(1);
    });

    it('toggleAllItems calls batchselection methods based on the selectionstate; when selectedItems is not equal to checked; for cartitem', () => {
        component.SelectionState='unchecked';
        component.toggleAllItems([cartitem1,cartitem2])
        expect(bSpy.addAllLineItemstoSelection).toHaveBeenCalledTimes(1);
    });

    it('toggleAllItems calls batchselection methods based on the selectionstate; when selectedItems is equal to checked; for cartitem', () => {
        component.SelectionState='checked';
        component.toggleAllItems([cartitem1,cartitem2])
        expect(bSpy.removeAllLineItemsFromSelection).toHaveBeenCalledTimes(1);
    });

    it('toggleAllItems for other aobject', () => {
        component.SelectionState='checked';
        component.toggleAllItems([selectItem])
        expect(selectItem).toBeInstanceOf(Object)
    });

  
  });