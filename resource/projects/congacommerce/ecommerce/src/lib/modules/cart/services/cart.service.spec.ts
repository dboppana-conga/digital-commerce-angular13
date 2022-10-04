import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { ApiService, ConfigurationService, MetadataService, AObjectService } from '@congacommerce/core';
import { UserService } from '../../crm/services/user.service';
import { CategoryService } from '../../catalog/services/category.service';
import { CartService } from './cart.service';
import { StorefrontService } from '../../store/services/storefront.service';
import { PriceListService } from '../../pricing/services/price-list.service';
import { Cart } from '../classes';
import { CART, CART_ITEMS } from '../../../test/data-manager';
import { CARTS, CARTS1, CARTITEMS, fieldFilter, CARTLISTRESULT } from './datamanager/data'
import { first } from 'lodash'

describe('CartService', () => {
    let cartService: CartService;
    let apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    apiSpy.refreshToken.and.returnValue(of(null));
    apiSpy.patch.and.returnValue(of([CARTS]));
    apiSpy.post
    beforeEach(() => {

        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            }
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);

        TestBed.configureTestingModule({
            providers: [
                CartService,
                { provide: ApiService, useValue: apiSpy },
                { provide: MetadataService, useValue: jasmine.createSpyObj('MetadataService', ['getAObjectServiceForType']) },
                { provide: ConfigurationService, useValue: jasmine.createSpyObj('ConfigurationService', ['get']) },
                { provide: CategoryService, useValue: jasmine.createSpyObj('CategoryService', ['getCategoryBranchForProductSync', 'refresh']) },
                { provide: AObjectService, useValue: jasmine.createSpyObj('AObjectService', { 'fetch': of(CART) }) },
            ]
        });
        cartService = TestBed.inject(CartService);
    });

    describe('get current cart details', () => {

        it('should fetch current cart to be `active`', () => {
            const cart = CartService.getCurrentCartId();
            expect(cart).toBe('active');
        });

        it('should fetch cart details from local storage', () => {
            const cartId = 'a1I790432107VdqEAE';
            localStorage.setItem('local-cart', cartId);
            const cart = CartService.getCurrentCartId();
            expect(cart).toBe(cartId);
        });
    });

    it('should remove cart from local storage', () => {
        localStorage.removeItem('local-cart');
        expect(localStorage.getItem('local-cart')).toBeNull();
    });

    it('should set cart id on local storage', () => {
        const cartId = 'a1I790432107VdqEAE';
        localStorage.setItem('local-cart', cartId);
        expect(localStorage.getItem('local-cart')).toBe(cartId, 'cart id not set on local storage');
    });

    it('should fetch isPricePending flag on cart', () => {
        const res = cartService.isPricePending(new Cart());
        expect(res).toBe(false);
        spyOn(cartService, 'isPricePending').and.returnValue(true);
        expect(cartService.isPricePending(new Cart)).toBe(true);
    });

    it('should fetch isPricePending flag on cart', () => {
        const res = cartService.isPricePending(new Cart());
        expect(res).toBe(false);
        spyOn(cartService, 'isPricePending').and.returnValue(true);
        expect(cartService.isPricePending(new Cart)).toBe(true);
    });

    it('setCartActive when pricecart is false', () => {
        const cart1 = CARTS;
        spyOn<any>(cartService, 'getCartLineItems').and.returnValue(of(CART_ITEMS))
        spyOn(cartService, 'refreshCart')
        spyOn(CartService, 'setCurrentCartId')
        cartService.setCartActive(cart1).pipe(take(1)).subscribe((res: Cart) => {
            expect(cartService.refreshCart).toHaveBeenCalled();
        })
    });

    it('setCartActive when pricecart is true', () => {
        const cart1 = CARTS;
        cartService['state'].next(CART)
        spyOn<any>(cartService, 'getCartLineItems').and.returnValue(of(CART_ITEMS))
        spyOn(cartService, 'priceCart')
        spyOn(CartService, 'setCurrentCartId')
        cartService.setCartActive(cart1, true).pipe(take(1)).subscribe((res: Cart) => {
            expect(cartService.priceCart).toHaveBeenCalled();
            expect(res.LineItems).toEqual(CART_ITEMS)
            expect(cartService['state'].value.Id).toEqual(CARTS.Id);
        })
    });

    it('getCartList returns list of cart value with field filter', () => {
        const filter= fieldFilter;
        apiSpy.get.and.returnValue(of(CARTLISTRESULT));
        const a= cartService.getCartList(filter); 
        a.subscribe(c=>{
            expect(c.TotalRecord).toEqual(2);
        })
     })
    // To DO: need to update this method to support private method
    // it('updateCartItems updates the ', () => {
    //     expect(CARTITEMS[0].PricingStatus).toEqual('New')
    //     spyOn(cartService, 'getMyCart').and.returnValue(of(CART));
    //     spyOn<any>(cartService, 'updateItems').and.returnValue(of(CARTITEMS))
    //     cartService.updateCartItems(CARTITEMS).subscribe(c => {
    //         expect(cartService.getMyCart).toHaveBeenCalled();
    //         expect(c[0].PricingStatus).toEqual('Pending');
    //     })
    // })

    it('removeCartItem Removes the specified cart item from the cart', () => {
        spyOn(cartService, 'removeCartItems').and.returnValue(of(null));
        cartService.removeCartItem(CARTITEMS[0]).subscribe(c => {
            expect(cartService.removeCartItems).toHaveBeenCalled()
        })
    })

    xit('removeCartItems Removes the multiple cart item from the cart', () => {
        spyOn(cartService,'removeCartItems').and.returnValue(of(null));
        cartService.removeCartItem(CARTITEMS[0]).subscribe( c=> {
            expect(cartService.removeCartItems).toHaveBeenCalled()
        })
    })

    it('getCartPriceStatus()  returns FALSE: Cart is succesfully priced and recent attempt to price the cart is succesful', () => {
        const cart = CARTS
        spyOn(cartService, 'getMyCart').and.returnValue(of(cart));
        cartService.getCartPriceStatus().subscribe(c => {
            expect(cartService.getMyCart).toHaveBeenCalled()
            expect(c).toBeFalsy()
        })
    })

    it('getCartPriceStatus()  returns TRUE: Cart is price pending and recent attempt to price the cart has failed.', () => {
        const cart = CARTS1
        spyOn(cartService, 'getMyCart').and.returnValue(of(cart));
        cartService.getCartPriceStatus().subscribe(c => {
            expect(cartService.getMyCart).toHaveBeenCalled()
            expect(c).toBeTruthy()
        })
    })

    it('reprice() either performs cart pricing or refesh cart based on DeferredPrice value', () => {
        CartService['DeferredPrice']=true;
        spyOn(cartService, 'refreshCart')
        spyOn(cartService,'priceCart')
        cartService.reprice()
        expect(cartService.refreshCart).toHaveBeenCalled()
        CartService['DeferredPrice']=false;
        cartService.reprice()
        expect(cartService.priceCart).toHaveBeenCalled()
    })

     it('deleteCart returns true when it deletes the cart, else false', () => { // true case should be checked
        const cart=CARTS1
        apiSpy.delete.and.returnValue(of({
            "Id": "aEIOU",
            "Message": null,
            "Status": "Success"
        }))
        spyOn(cartService,'refreshCart')
        const a= cartService.deleteCart(cart);
        a.subscribe(c=>{
            expect(c).toBeFalsy()
            expect(cartService.refreshCart).toHaveBeenCalled()
        })
     })
});
