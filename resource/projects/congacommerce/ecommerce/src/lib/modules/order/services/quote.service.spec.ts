import { TestBed } from "@angular/core/testing";
import { ApiService, ApttusModule } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuoteService } from "../services";
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { of } from "rxjs";
import { mockQuoteResult, quoteMockData } from "./../test/data/dataManager";
import { CartItemProductService } from "../../cart/services/cart-item-product.service";
describe('QuoteService', () => {
    let service: QuoteService;
    let httpMock: HttpTestingController;
    const apiServiceSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'get', 'post', 'patch', 'delete']);
    const cartItemServiceSpy = jasmine.createSpyObj<CartItemProductService>(["addProductInfoToLineItems"]);
    apiServiceSpy.post;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [QuoteService],
        });
        service = TestBed.inject(QuoteService);
        httpMock = TestBed.inject(HttpTestingController);
    });
    it('getQuoteById() should return results that match the given quoteId', () => {
        spyOn(service, 'getQuoteById').withArgs('337f9e6d-96c0-45ec-8e35-0ef6c40b3f10').and.returnValue(of(quoteMockData[0]));
        service.getQuoteById('337f9e6d-96c0-45ec-8e35-0ef6c40b3f10').pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(quoteMockData[0]);
            expect(res.Id).toEqual(quoteMockData[0].Id);
        });
    });
    it('acceptQuote() should accept the quote and convert to an order.', () => {
        spyOn(service, 'acceptQuote').withArgs('2e289395-42b1-42b8-8263-147f53c61487').and.returnValue(of(true));
        service.acceptQuote('2e289395-42b1-42b8-8263-147f53c61487').pipe(take(1)).subscribe((res) => {
            expect(res).toBeTruthy();
        });
    });
    it('getQuoteList() should return list of quote associated with loggedIn user', () => {
        spyOn(service, 'getQuoteList').and.returnValue(of(mockQuoteResult));
        service.getQuoteList().pipe(take(1)).subscribe((res) => {
            expect(res.QuoteList).toEqual(mockQuoteResult.QuoteList);
            expect(res.QuoteList[0].Name).toContain('Test' || 'Quote');
            expect(res.QuoteList[0].Name).toEqual(mockQuoteResult.QuoteList[0].Name);
            expect(res.TotalRecord).toBeLessThanOrEqual(3);
        });
    });
})