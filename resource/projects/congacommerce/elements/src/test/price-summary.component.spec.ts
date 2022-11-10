import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { StorefrontService, UserService, CartService, ConstraintRuleService, AccountService, OrderService, QuoteService, Quote, Cart, Order } from "@congacommerce/ecommerce";
import { ExceptionService, PriceSummaryComponent } from "@congacommerce/elements";
import { plainToClass } from "class-transformer";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { accountValue, CART, ORDER_MOCK_DATA, QUOTE_MOCK_DATA, STOREFRONT } from "./data/data-manager";

describe('PriceSummaryComponent', () => {

    const storefrontServiceSpy = jasmine.createSpyObj<StorefrontService>(['getStorefront']);
    storefrontServiceSpy.getStorefront.and.callFake(() => of(STOREFRONT));
    const userServiceSpy = jasmine.createSpyObj<UserService>(['isLoggedIn']);
    userServiceSpy.isLoggedIn.and.returnValue(of(true))
    const constrintRuleServiceSpy = jasmine.createSpyObj<ConstraintRuleService>(['hasPendingErrors']);
    constrintRuleServiceSpy.hasPendingErrors.and.returnValue(of(false));
    const accountServiceSpy = jasmine.createSpyObj<AccountService>(["getCurrentAccount"]);
    accountServiceSpy.getCurrentAccount.and.returnValue(of(accountValue));
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const modalServiceSpy = jasmine.createSpyObj<BsModalService>(['show', 'hide']);
    const cartServiceSpy = jasmine.createSpyObj<CartService>(['getMyCart', 'abandonCart', 'createNewCart', 'setCartActive', 'isPricePending']);
    cartServiceSpy.getMyCart.and.returnValue(of(CART));
    cartServiceSpy.abandonCart.and.returnValue(of(true));
    cartServiceSpy.createNewCart.and.returnValue(of(CART));
    cartServiceSpy.setCartActive.and.returnValue(of(CART));
    cartServiceSpy.isPricePending.and.returnValue(false);
    let modalValue = jasmine.createSpyObj('discardChangesModal', ['show', 'hide']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PriceSummaryComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: StorefrontService, useValue: storefrontServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ExceptionService, useValue: {} },
                { provide: CartService, useValue: cartServiceSpy },
                { provide: ConstraintRuleService, useValue: constrintRuleServiceSpy },
                { provide: BsModalService, useValue: modalServiceSpy },
                { provide: QuoteService, useValue: {} },
                { provide: OrderService, useValue: {} },
                { provide: AccountService, useValue: accountServiceSpy },
                { provide: BsModalRef, useValue: modalValue },
            ]
        }).compileComponents();
    });

    it('check component loaded', () => {
        const fixture = TestBed.createComponent(PriceSummaryComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('Open estimate tax popup', () => {
        const fixture = TestBed.createComponent(PriceSummaryComponent);
        const app = fixture.componentInstance;
        app.openEstimateTaxPopup();
        expect(app.showTaxPopup).toEqual(true);
    });

    it('Call setLoading() method', () => {
        const fixture = TestBed.createComponent(PriceSummaryComponent);
        const app = fixture.componentInstance;
        app.setLoading(true);
        app.view$.pipe(take(1)).subscribe((res) => {
            expect(res.loading).toEqual(true);
        });
    });

    it('Open discard changes modal popup', () => {
        const fixture = TestBed.createComponent(PriceSummaryComponent);
        const app = fixture.componentInstance;
        app.openDiscardChangeModals();
        expect(modalServiceSpy.show).toHaveBeenCalled();
    });

    describe('Call confirmOrderChanges() method', () => {
        it('To save order after editing', () => {
            const fixture = TestBed.createComponent(PriceSummaryComponent);
            const app = fixture.componentInstance;
            app.confirmOrderChanges();
            expect(app.calculateTaxForOrder).toEqual(false);
        });
    });

    describe('Call confirmOrderChanges() method', () => {
        it('should return true', () => {
            const fixture = TestBed.createComponent(PriceSummaryComponent);
            const app = fixture.componentInstance;
            app.record = ORDER_MOCK_DATA;
            const result = app.disableButton();
            expect(result).toEqual(true);
        });
    });

    describe('Call onDiscardChanges() method', () => {  /*  Need to check */
        it('Discard the changes', () => {
            const fixture = TestBed.createComponent(PriceSummaryComponent);
            const app = fixture.componentInstance;
            app.record = ORDER_MOCK_DATA;
            app.discardChangesModal = modalValue;
            const result = app.onDiscardChanges();
            expect(cartServiceSpy.createNewCart).toHaveBeenCalled();
            expect(cartServiceSpy.setCartActive).toHaveBeenCalled();
        });
    });

    describe('Call ngOnChanges() method', () => {
        it('Discard the changes', () => {
            const fixture = TestBed.createComponent(PriceSummaryComponent);
            const app = fixture.componentInstance;
            app.record = plainToClass(Order, ORDER_MOCK_DATA);
            const result = app.ngOnChanges();
            expect(cartServiceSpy.isPricePending).toHaveBeenCalled();
            expect(app.view$.value.accountId).toEqual(accountValue.Id);
        });
    });

    describe('Call isQuoteOnCart() method', () => {
        it('Should return false ', () => {
            const fixture = TestBed.createComponent(PriceSummaryComponent);
            const app = fixture.componentInstance;
            app.record = CART;
            const result = app.isQuoteOnCart();
            expect(result).toEqual(false);
        });
    });

    describe('Call showEstimatedTaxLink() method', () => {
        it('Should return false ', () => {
            const fixture = TestBed.createComponent(PriceSummaryComponent);
            const app = fixture.componentInstance;
            app.page = null;
            const result = app.showEstimatedTaxLink();
            expect(result).toEqual(false);
        });
    });

    describe('Call showEstimatedTaxLink() method', () => {
        it('Should return true ', () => {
            const fixture = TestBed.createComponent(PriceSummaryComponent);
            const app = fixture.componentInstance;
            app.page = 'orders';
            const result = app.showEstimatedTaxLink();
            expect(result).toEqual(true);
        });
    });
});