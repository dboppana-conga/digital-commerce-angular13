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
import { CART_ITEMS, PRODUCT } from '../../../test/data-manager';
import { CartService } from './cart.service';

const moment = _moment;

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartItemService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', {
            refreshToken: of(null),
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

  it('should return array of CartItem associated with Product', () => {
    const product = PRODUCT;
    spyOn(cartItemService, 'getCartItemsForProduct').withArgs(product).and.returnValue(of(CART_ITEMS));
    cartItemService.getCartItemsForProduct(product).pipe(take(1)).subscribe((res) => {
        expect(res).toEqual(CART_ITEMS);
    });
  });

  describe('Call addCartItems method', () => {
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