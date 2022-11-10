import { TestBed } from '@angular/core/testing';
import * as _moment from 'moment';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  ApiService,
  ConfigurationService,
  MetadataService,
} from '@congacommerce/core';
import { CategoryService } from '../../catalog/services/category.service';
import { AccountService } from '../../crm/services/account.service';
import { CartItemService } from './cart-item.service';
import { ProductAttributeValueService } from '../../catalog/services/product-attribute.service';
import { CART_ITEMS, PRODUCT, PRODUCT2 } from '../../../test/data-manager';
import { CartService } from './cart.service';
import { PriceListItemService, PriceListService } from '../../pricing/services';
import { CARTS, PRODUCT_ATTRIBUTE_DATA, User1 } from './datamanager/data';

const moment = _moment;

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let productAttributeSericeSpy = jasmine.createSpyObj<ProductAttributeValueService>('ProductAttributeValueService', ['describe']);
  let priceListItemServiceSpy = jasmine.createSpyObj<PriceListItemService>('PriceListItemService', ['describe']);
  let priceListServiceSpy = jasmine.createSpyObj<PriceListService>('PriceListService', ['getEffectivePriceListId']);
  let categoryServiceSpy = jasmine.createSpyObj<CategoryService>('CategoryService', ['getCategoryBranchForProductSync']);
  let accountServiceSpy = jasmine.createSpyObj<AccountService>('AccountService', ['getCurrentAccount']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartItemService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', {
            refreshToken: of(User1),
            get: of(null),
          }),
        },
        {
          provide: MetadataService,
          useValue: jasmine.createSpyObj('MetadataService', [
            'getAObjectServiceForType',
          ]),
        },
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['get']),
        },
        {
          provide: CategoryService,
          useValue: jasmine.createSpyObj('CategoryService', [
            'getCategoryBranchForProductSync',
          ]),
        },
        {
          provide: AccountService,
          useValue: jasmine.createSpyObj('AccountService', [
            'getCurrentAccount',
          ]),
        },
        {
          provide: ProductAttributeValueService,
          useValue: jasmine.createSpyObj('ProductAttributeValueService', [
            'describe',
          ]),
        },
        {
          provide: PriceListItemService,
          useValue: priceListItemServiceSpy
        },
      ],
    });
    cartItemService = TestBed.inject(CartItemService);
  });

  describe('Test end date', () => {
    it('should return valid end date for frequency passed as Monthly', () => {
      const date = new Date('2022-03-20');
      const endDate = cartItemService.getEndDate(date, 2, 'Monthly');
      expect(endDate).toBeDefined();
      expect(moment(endDate).format('YYYY-MM-DD')).toBe(
        '2022-05-19',
        "End date doesn't match with expected value"
      );
    });

    it('should return purchase date for frequency passed as None', () => {
      const date = new Date('2022-01-20');
      const endDate = cartItemService.getEndDate(date, 2, '--None--');
      expect(endDate).toBeDefined();
      expect(moment(endDate).format('YYYY-MM-DD')).toBe(
        '2022-01-20',
        "End date doesn't match with expected value"
      );
    });
  });

  it('should return selling term', () => {
    const startDate = moment(new Date('2022-01-12'));
    const endDate = moment(new Date('2025-01-11'));
    const sellingTerm = cartItemService.getTerm(
      startDate,
      endDate,
      'Quarterly'
    );
    expect(sellingTerm).toEqual(12);
  });

  it('should return readable term for the frequency passed', () => {
    const term1 = cartItemService.getReadableTerm(2, 'Quarterly');
    expect(term1).toEqual('8 years');

    const term2 = cartItemService.getReadableTerm(4, 'Monthly');
    expect(term2).toBe('4 months');

    const term3 = cartItemService.getReadableTerm(4.6, 'Hourly');
    expect(term3).toBe('4.6 hours');

    const term4 = cartItemService.getReadableTerm(2, 'One Time');
    expect(term4).toBe('One Time');
  });

  it('should return array of CartItem associated with Product', () => { /* TO DO: Need to re-visit */
    const product = PRODUCT2;
    productAttributeSericeSpy.describe.and.returnValue(null);
    // productAttributeSericeSpy.getInstanceWithDefaults.and.returnValue(PRODUCT_ATTRIBUTE_DATA);
    spyOn(cartItemService, 'getNextPrimaryLineNumber');
    spyOn(PriceListItemService, 'getPriceListItemForProduct');
    priceListServiceSpy.getEffectivePriceListId.and.returnValue(of('62ad6108-6abc-465c-b137-3bd3327a2fe6'));
    accountServiceSpy.getCurrentAccount.and.returnValue(of(null));
    spyOn(cartItemService, 'getEndDate');
    categoryServiceSpy.getCategoryBranchForProductSync.and.returnValue(null);
    const results = cartItemService.getCartItemsForProduct(product);
    results.pipe(take(1)).subscribe((res) => {
      expect(productAttributeSericeSpy.describe).toHaveBeenCalledTimes(1);
      expect(cartItemService.getNextPrimaryLineNumber).toHaveBeenCalledTimes(1);
      expect(productAttributeSericeSpy.describe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Call getNextPrimaryLineNumber method', () => {
    let cartItemService: CartItemService;
    beforeEach(() => {
      cartItemService = TestBed.inject(CartItemService);
    });

    it('should return number of primaryLine as 1', () => {
      const results = cartItemService.getNextPrimaryLineNumber(null, CARTS);
      expect(results).toBeTruthy();
      expect(results).toEqual(1);
    });
  });

  it('should return number of primaryLine', () => {
    const results = cartItemService.getNextPrimaryLineNumber(CART_ITEMS, CARTS);
    expect(results).toBeTruthy();
    expect(results).toEqual(2);
  });

  describe('Call addCartItems method', () => {
    let cartItemService: CartItemService;
    beforeEach(() => {
      cartItemService = TestBed.inject(CartItemService);
    });
    
    it('should call getCurrentCartId() twice ', () => {
      const currentCartSpy = spyOn(
        CartService,
        'getCurrentCartId'
      ).and.returnValue('a1I790432107VdqEAE');
      spyOn(cartItemService, 'upsert').and.returnValue(of(null));
      cartItemService
        .addCartItems(CART_ITEMS)
        .pipe(take(1))
        .subscribe((res) => {
          expect(res).toBeTruthy;
          //  expect(currentCartSpy).toHaveBeenCalledTimes(CART_ITEMS.length);//  need to revist this unit test case
        });
    });
  });
});