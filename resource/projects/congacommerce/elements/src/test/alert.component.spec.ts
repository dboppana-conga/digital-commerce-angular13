import { TestBed } from "@angular/core/testing";
import { CartService, StorefrontService } from "@congacommerce/ecommerce";
import { AlertComponent, RevalidateCartService } from "@congacommerce/elements";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { CART } from "./data/data-manager";

describe('AlertComponent', () => {
    let component: AlertComponent;

    const cartServiceSPy = jasmine.createSpyObj<CartService>(['getCartPriceStatus', 'priceCart', 'createNewCart']);
    cartServiceSPy.getCartPriceStatus.and.returnValue(of(true));
    cartServiceSPy.priceCart.and.callThrough();
    cartServiceSPy.createNewCart.and.returnValue(of(CART));
    const cartRevalidateServiceSPy = jasmine.createSpyObj<RevalidateCartService>(['openRevalidateModal']);
    cartRevalidateServiceSPy.openRevalidateModal.and.callThrough();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AlertComponent],
            imports: [],
            providers: [
                { provide: CartService, useValue: cartServiceSPy },
                { provide: StorefrontService, useValue: {} },
                { provide: RevalidateCartService, useValue: cartRevalidateServiceSPy },
            ]
        });
    });
    it('check component loaded', () => {
        const fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('call ngOnInit() method', () => {
        const fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        component.priceError$.pipe(take(1)).subscribe((res) => {
            expect(cartServiceSPy.getCartPriceStatus).toHaveBeenCalledTimes(1);
            expect(res).toEqual(true);
        })
    });

    it('call ngDoCheck() method', () => {
        const fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        component['record'] = CART
        component.ngDoCheck();
        expect(component.errorList.length).toEqual(0);
    });

    it('call openRevalidateCartModal() method', () => {
        const fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        component.openRevalidateCartModal();
        expect(cartRevalidateServiceSPy.openRevalidateModal).toHaveBeenCalledTimes(1);
    });

    it('call cartReprice() method', () => {
        const fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        component.cartReprice();
        expect(cartServiceSPy.priceCart).toHaveBeenCalledTimes(1);
    });

    it('call createCart() method', () => {
        const fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        component.createCart();
        expect(cartServiceSPy.createNewCart).toHaveBeenCalledTimes(1);
    });
});