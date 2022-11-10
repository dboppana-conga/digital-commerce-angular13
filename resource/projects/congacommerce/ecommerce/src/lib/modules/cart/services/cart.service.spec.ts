import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { ApiService, ConfigurationService, MetadataService, AObjectService, AObjectMetadata } from '@congacommerce/core';
import { UserService } from '../../crm/services/user.service';
import { CategoryService } from '../../catalog/services/category.service';
import { CartService } from './cart.service';
import { StorefrontService } from '../../store/services/storefront.service';
import { PriceListService } from '../../pricing/services/price-list.service';
import { Cart } from '../classes';
import { CART, CART_ITEMS } from '../../../test/data-manager';
import { CARTS, CARTS1, CARTITEMS, fieldFilter, CARTLISTRESULT, cartrequest, product, priceResponse, Users, CARTS2 } from './datamanager/data'
import { first, debounce } from 'lodash'
import { ActionQueue } from './action-queue.service';
import { CartItemProductService } from './cart-item-product.service';
import { plainToClass } from 'class-transformer';

describe('CartService', () => {
    let cartService: CartService;
    let userService: UserService;
    let apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    apiSpy.refreshToken.and.returnValue(of(null));
    //apiSpy.patch.and.returnValue(of([CARTS]));
    apiSpy.post
    let aObjectSpy = jasmine.createSpyObj<AObjectService>(['fetch', 'cacheService']);
    let aObjectMetaSpy = jasmine.createSpyObj<AObjectMetadata>(['get']);
    let configSpy = jasmine.createSpyObj('ConfigurationService', ['get'])
    let metadataSpy = jasmine.createSpyObj('MetadataService', ['getAObjectServiceForType', 'getTypeByApiName'])
    let actionQueue: ActionQueue;
    let plSpy = jasmine.createSpyObj<PriceListService>(['isPricelistId', 'refreshPriceList', 'getPriceListId', 'getEffectivePriceListId'])
    plSpy.getEffectivePriceListId.and.returnValue(of('null'))
    let cIPSpy = jasmine.createSpyObj<CartItemProductService>(['addProductInfoToLineItems']);

    beforeEach(() => {

        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            }
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);

        TestBed.configureTestingModule({
            providers: [
                CartService,
                { provide: ApiService, useValue: apiSpy },
                { provide: MetadataService, useValue: metadataSpy },
                { provide: ConfigurationService, useValue: configSpy },
                { provide: CategoryService, useValue: jasmine.createSpyObj('CategoryService', ['getCategoryBranchForProductSync', 'refresh']) },
                { provide: AObjectService, useValue: aObjectSpy },
                { provide: AObjectMetadata, useValue: aObjectMetaSpy },
                { provide: ActionQueue, useValue: jasmine.createSpyObj('ActionQueue', { 'queueAction': of(CARTITEMS) }) },
                { provide: PriceListService, useValue: plSpy },
                { provide: CartItemProductService, useValue: cIPSpy },
                { provide: UserService, useValue: jasmine.createSpyObj('UserService', { 'me': of(Users), 'isLoggedIn': of(true) }, ['getBrowserLocale']) }
            ]
        });
        cartService = TestBed.inject(CartService);
        userService = TestBed.inject(UserService);
        actionQueue = TestBed.inject(ActionQueue);
    });

    describe('getCurrentCartId() should get current cart details', () => {

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

        xit('loadheader()..........', () => { // the else condition is failing because of get cal of aobject metadate
            cartService['state'].next(CARTS1);
            const cart = new Cart()
            apiSpy.get.and.returnValue(of(CARTS));
            spyOn(CartService, 'getCurrentCartId').and.returnValue(CARTS1.Id)
            cartService['loadHeader']()
            expect(cartService['state'].value.LineItems).toEqual(CARTS1.LineItems)
        });

    });

    it('deleteLocalCart() should remove cart from local storage', () => {
        const cartId = 'a1I790432107VdqEAE';
        localStorage.setItem('local-cart', cartId);
        CartService.deleteLocalCart()
        expect(localStorage.getItem('local-cart')).toBeNull();
    });

    it('setCurrentCartId() should set cart id on local storage', () => {
        const cartId = 'a1I';
        CartService.setCurrentCartId(cartId)
        expect(localStorage.getItem('local-cart')).toBe(cartId, 'cart id not set on local storage');
    });

    it('getCartLineItems() returns the cart lineitems', () => {
        const cartId = 'a1I';
        let value: any;
        apiSpy.get.and.returnValue(of(CARTS));
        metadataSpy.getTypeByApiName.and.returnValue(null);
        value = cartService['getCartLineItems'](cartId);
        value.pipe(take(1)).subscribe(c => {
            expect(c).toEqual(CARTS.LineItems)
        })
    });

    it('resetOffset() resets the Lineitemoffset to zero', () => {
        cartService['lineItemOffset'] = 10;
        cartService['resetOffset']()
        expect(cartService['lineItemOffset']).toEqual(0)
    });

    it('onAdd() calls the pricecart', () => {
        cartService['state'].next(CARTS2);
        cartService['onAdd'](CARTS2);
        expect(cartService['state'].value.IsPricePending).toEqual(false);
    });

    it('republish() sets the Ispricepending value and updates the state; else calls the loadheader()', () => {
        cartService['state'].next(CARTS)
        spyOn<any>(cartService, 'loadHeader')
        cartService['republish'](true);
        expect(cartService['state'].value.IsPricePending).toBeTruthy()
        expect(cartService['loadHeader']).toHaveBeenCalledTimes(0)
        cartService['republish']();
        expect(cartService['loadHeader']).toHaveBeenCalledTimes(1)
    });

    it('mergeCartItems() sets the Ispricepending value and updates the state; else calls the loadheader()', () => {
        cartService['state'].next(CARTS1);
        localStorage.setItem('local-cart', '1234');
        expect(localStorage.getItem('local-cart')).toEqual('1234');
        spyOn<any>(cartService, 'publish');
        cartService['mergeCartItems'](CARTITEMS);
        expect(cartService['publish']).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem('local-cart')).toEqual('testid');
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

    xit('setCartActive when pricecart is true', () => {
        const cart1 = CARTS;
        cartService['state'].next(CARTS)// needed since errors are thrown
        spyOn<any>(cartService, 'getCartLineItems').and.returnValue(of(CART_ITEMS))
        spyOn(cartService, 'priceCart')
        spyOn(CartService, 'setCurrentCartId')
        cartService.setCartActive(cart1, true).pipe(take(1)).subscribe((res: Cart) => {
            expect(cartService.priceCart).toHaveBeenCalled();
            expect(res.LineItems).toEqual(CART_ITEMS)
        })
    });

    it('getCartList returns list of cart value with field filter', () => {
        const filter = fieldFilter;
        apiSpy.get.and.returnValue(of(CARTLISTRESULT));
        const value = cartService.getCartList(filter);
        value.pipe(take(1)).subscribe(c => {
            expect(c.TotalRecord).toEqual(2);
        })
    })

    it('updateCartItems updates the cartitems', () => {
        expect(CARTITEMS[0].PricingStatus).toEqual('New')
        spyOn(cartService, 'getMyCart').and.returnValue(of(CART));
        spyOn<any>(cartService, 'updateItems').and.returnValue(of(CARTITEMS))
        spyOn<any>(cartService, 'republish').withArgs(true);
        cartService.updateCartItems(CARTITEMS).pipe(take(1)).subscribe(c => {
            expect(cartService.getMyCart).toHaveBeenCalled();// add times also check the sequence
            expect(cartService['republish']).toHaveBeenCalled();
            expect(cartService['updateItems']).toHaveBeenCalled();
            expect(c[0].PricingStatus).toEqual('Pending');
        })
    })

    it('removeCartItem Removes the specified cart item from the cart', () => {
        spyOn(cartService, 'removeCartItems').and.returnValue(of(null));
        cartService.removeCartItem(CARTITEMS[0]).pipe(take(1)).subscribe(c => {
            expect(cartService.removeCartItems).toHaveBeenCalled()
        })
    })

    it('removeCartItems Removes the multiple cart item from the cart', () => {
        spyOn(cartService, 'priceCart');
        spyOn(CartService, 'getCurrentCartId')
        apiSpy.delete.and.returnValue(of(CARTITEMS))
        cartService.removeCartItems(CARTITEMS)
        expect(CartService.getCurrentCartId).toHaveBeenCalledTimes(1)
        expect(apiSpy.delete).toHaveBeenCalled();
    })

    it('getCartPriceStatus()  returns FALSE: Cart is succesfully priced and recent attempt to price the cart is succesful', () => {
        const cart = CARTS
        spyOn(cartService, 'getMyCart').and.returnValue(of(cart));
        cartService.getCartPriceStatus().pipe(take(1)).subscribe(c => {
            expect(cartService.getMyCart).toHaveBeenCalled()
            expect(c).toBeFalsy()
        })
    })

    it('getCartPriceStatus()  returns TRUE: Cart is price pending and recent attempt to price the cart has failed.', () => {
        const cart = CARTS1
        spyOn(cartService, 'getMyCart').and.returnValue(of(cart));
        cartService.getCartPriceStatus().pipe(take(1)).subscribe(c => {
            expect(cartService.getMyCart).toHaveBeenCalled()
            expect(c).toBeTruthy()
        })
    })

    it('reprice() either performs cart pricing or refesh cart based on DeferredPrice value', () => {
        CartService['DeferredPrice'] = true;
        spyOn(cartService, 'refreshCart')
        spyOn(cartService, 'priceCart')
        cartService.reprice()
        expect(cartService.refreshCart).toHaveBeenCalled()
        CartService['DeferredPrice'] = false;
        cartService.reprice()
        expect(cartService.priceCart).toHaveBeenCalled()
    })

    it('deleteCart returns true when it deletes the cart, else false', () => { // true case should be checked
        const cart = CARTS1
        apiSpy.delete.and.returnValue(of({
            "Id": "aEIOU",
            "Message": null,
            "Status": "Success"
        }))
        spyOn(cartService, 'refreshCart')
        const value = cartService.deleteCart(cart);
        value.pipe(take(1)).subscribe(c => {
            expect(c).toBeFalsy()
            expect(cartService.refreshCart).toHaveBeenCalled()
        })
    })

    it('getNextPrimaryLineNumber returns the primary line number', () => {
        let value: any;
        cartService['debounceReset'] = 10;
        cartService['lineItemOffset'] = 10;
        spyOn<any>(cartService, 'debounceReset');
        configSpy.get.and.returnValue(15);
        value = cartService.getNextPrimaryLineNumber(CARTITEMS, CARTS);
        expect(value).toEqual(12);
    })

    it('getCartwithId returns the cart ID', () => {
        let value: any;
        spyOn(cartService, 'fetch').and.returnValue(of(CARTS1))
        cartService.getCartWithId('CARTITEMS,CARTS').pipe(take(1)).pipe(take(1)).subscribe(res => {
            expect(cartService.fetch).toHaveBeenCalledTimes(1)
            expect(res.Id).toEqual(CARTS1.Id)
        })
    })

    it('publish() prices the cart', () => {
        cartService.publish(CARTS)
        expect(cartService['state'].value).toEqual(CARTS)
    })

    it('updateItem() returns the updated cartitems of the cart', () => {
        let user: any;
        apiSpy.patch.and.returnValue(of(CARTS));
        apiSpy.get.and.returnValue(of(CARTS));
        spyOn(CartService, 'getCurrentCartId')
        spyOn<any>(cartService, 'mergeCartItems');
        metadataSpy.getTypeByApiName.and.returnValue(null);
        user = cartService.updateItem('123', [cartrequest]);
        user.pipe(take(1)).subscribe(c => {
            expect(c).toEqual(CARTS['CartResponse'].LineItems)
            expect(cartService['mergeCartItems']).toHaveBeenCalledTimes(1)
        })

    })

    it('CreateNewCart() prices the cart', () => {
        let cart = new Cart()
        localStorage.setItem('account', 'abc12345');
        spyOn(CartService, 'setCurrentCartId')
        spyOn(cartService, 'publish')
        apiSpy.post.and.returnValue(of([cart]))
        apiSpy.patch.and.returnValue(of([cart]))
        cartService.createNewCart().pipe(take(1)).subscribe(c => {
            expect(apiSpy.post).toHaveBeenCalled()
            expect(apiSpy.patch).toHaveBeenCalled()
            expect(cartService.publish).toHaveBeenCalledTimes(1)
            expect(CartService.setCurrentCartId).toHaveBeenCalledTimes(1)
        })
    })

    it('addProducttocart() returns cartitems when only product is passed', () => {
        cartService['state'].next(CARTS)
        localStorage.setItem('account', 'abc12345');
        spyOn(cartService, 'addItem').and.returnValue(of(CARTITEMS))
        spyOn(cartService, 'updateItem').withArgs('cartrequest', [cartrequest]).and.returnValue(of(CARTITEMS))
        spyOn(cartService, 'getNextPrimaryLineNumber').and.returnValue(1)
        cartService.addProductToCart(product).pipe(take(1)).subscribe(c => {
            expect(cartService.updateItem).toHaveBeenCalledTimes(0)
            expect(cartService.addItem).toHaveBeenCalledTimes(1)
            expect(c).toEqual(CARTITEMS)
        })
    })

    it('addProducttocart() updates the  cartitems when cartitems are passed', () => {
        cartService['state'].next(CARTS)// searched for option.id hence we need to initilize state value.
        localStorage.setItem('account', 'abc12345');
        spyOn(cartService, 'addItem').and.returnValue(of(CARTITEMS))
        spyOn(cartService, 'updateItem').and.returnValue(of(CARTITEMS))
        spyOn(cartService, 'getNextPrimaryLineNumber').and.returnValue(1)
        cartService.addProductToCart(product, 1, CARTITEMS).pipe(take(1)).subscribe(c => {
            expect(cartService.updateItem).toHaveBeenCalledTimes(1)

        })
    })

    it('getmycart returns cart instance with values as null', () => {
        cartService['state'].next(null)// need this as it's returns value from state.
        cartService.getMyCart().pipe(take(1)).subscribe(c => {
            expect(c.Id).toBeNull()
        })
    })

    it('getmycart returns cart', () => {
        cartService['state'].next(CARTS1)// need this as it's returns value from state.
        cartService.getMyCart().pipe(take(1)).subscribe(c => {
            expect(c).toEqual(CARTS1)
        })
    })

    it('priceCart prices and updates the state', () => {
        cartService['state'].next(CARTS1)// need this as it's returns value from state.
        expect(cartService['state'].value.IsPricePending).toBeTrue()
        apiSpy.post.and.returnValue(of(priceResponse))
        spyOn(CartService, 'getCurrentCartId').and.returnValue('aEIOU12356')
        CartService['DeferredPrice'] = false;
        cartService.priceCart()
        expect(cartService['state'].value.IsPricePending).toBeFalse()
    })

    it('priceCart does not update the state when response is not correct from post api', () => {
        cartService['state'].next(CARTS1)// need this as it's returns value from state.
        apiSpy.post.and.returnValue(of(CARTS1))
        spyOn(CartService, 'getCurrentCartId').and.returnValue('aEIOU12356')
        CartService['DeferredPrice'] = false;
        cartService.priceCart()
        expect(cartService['state'].value).toEqual(CARTS1)
    })

    it('addItems adds the cartitems', () => {
        cartService['state'].next(CARTS)// need this as it's returns value from state.
        apiSpy.post.and.returnValue(of([CARTS.LineItems]));
        apiSpy.get.and.returnValue(of([CARTS.LineItems]));
        cIPSpy.addProductInfoToLineItems.and.returnValue(of(CARTS.LineItems));
        spyOn(cartService, 'getMyCart').and.returnValue(of(CARTS));
        spyOn(cartService, 'createNewCart').and.returnValue(of(CARTS));
        spyOn<any>(cartService, 'mergeCartItems');
        cartService.addItem([cartrequest]).subscribe(c => {
            expect(c).toEqual(CARTITEMS)
            expect(cartService['mergeCartItems']).toHaveBeenCalledTimes(1)
        })
    })

    xit('refresh()', () => {
        let carts = new Cart();
        carts.Id = '1224'
        carts.IsPricePending = false;
        apiSpy.get.and.returnValue(of(priceResponse));
        cIPSpy.addProductInfoToLineItems.and.returnValue(of(CARTS.LineItems));
        spyOn<any>(cartService, 'mergeCartItems');
        spyOn(CartService, 'getCurrentCartId').and.returnValue('12344')
        cartService.refreshCart();
    })
});
