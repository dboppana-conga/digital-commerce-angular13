import { TestBed } from "@angular/core/testing";
import { ApiService, ApttusModule } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuoteService } from "../services";
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { of } from "rxjs";
import { quoteMockData, quoteWithLineItem } from "./../test/data/dataManager";
import { CartItemProductService } from "../../cart/services/cart-item-product.service";
import { AccountService, UserService } from "@congacommerce/ecommerce";
import { accountValue } from "../../crm/tests/mock";
describe('QuoteService', () => {
    let service: QuoteService;
    let httpMock: HttpTestingController;
    const quoteId = quoteMockData[0].Id;
    const invalidQuoteId = "Axc123bhgG";

    const apiServiceSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'get', 'post', 'patch', 'delete']);
    const cartItemServiceSpy = jasmine.createSpyObj<CartItemProductService>(["addProductInfoToLineItems"]);
    const accountServiceSpy = jasmine.createSpyObj<AccountService>(["getCurrentAccount"]);
    accountServiceSpy.getCurrentAccount.and.returnValue(of(accountValue));
    const userServiceSpy = jasmine.createSpyObj<UserService>(["refresh"]);
    userServiceSpy.refresh();
    apiServiceSpy.refreshToken.and.returnValue(of(null));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [
                QuoteService,
                { provide: ApiService, useValue: apiServiceSpy },
                { provide: CartItemProductService, useValue: cartItemServiceSpy },
                { provide: AccountService, useValue: accountServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
            ],
        });
        service = TestBed.inject(QuoteService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('getQuoteById() should return results that match the given quoteId', () => {
        apiServiceSpy.get.and.returnValue(of(quoteMockData[0]));
        cartItemServiceSpy.addProductInfoToLineItems.and.returnValue(of([quoteWithLineItem]))
        service.getQuoteById(quoteId).pipe(take(1)).subscribe((res) => {
            expect(res).toBeTruthy();
            expect(res['Items'][0].Id).toEqual(quoteWithLineItem.Id);
        });
    });

    it('getQuoteById() should not return results for invalid quoteId', () => {
        apiServiceSpy.get.and.returnValue(of([]));
        cartItemServiceSpy.addProductInfoToLineItems.and.returnValue(of([]))
        service.getQuoteById(invalidQuoteId).pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(jasmine.objectContaining({
                length: 0
            }));
        });
    });

    it('acceptQuote() should accept the quote and convert to an order.', () => {
        apiServiceSpy.post.and.returnValue(of(true));
        service.acceptQuote(quoteId).pipe(take(1)).subscribe((res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(true);
        });
    });

    xit('finalizeQuote() should finalize the quote.', () => { /* TO DO: Add back once API implemented */
        apiServiceSpy.post.and.returnValue(of(true));
        service.finalizeQuote(quoteId).pipe(take(1)).subscribe((res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(true);
        });
    });

    it('getQuoteList() should return list of quote associated with loggedIn user', () => {
        apiServiceSpy.get.and.returnValue(of(quoteMockData));
        service.getQuoteList().pipe(take(1)).subscribe((res) => {
            expect(res.QuoteList[0].Name).toContain('Test' || 'Quote');
            expect(res.QuoteList[0].Name).toEqual(quoteMockData[0].Name);
            expect(res.QuoteList.length).toBeLessThanOrEqual(3);
        });
    });

    it('getQuoteList() should return blank list of quote since user does not have Quotes.', () => {
        apiServiceSpy.get.and.returnValue(of(null));
        service.getQuoteList().pipe(take(1)).subscribe((res) => {
            expect(res.TotalRecord).toEqual(undefined);
            expect(res.QuoteList).toEqual(null);
        });
    });
})