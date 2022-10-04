import { TestBed } from "@angular/core/testing";
import { AObject, ApttusModule } from "@congacommerce/core";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { of } from "rxjs";
import { CartItemProductService } from "./cart-item-product.service";
import { CommerceModule } from "@congacommerce/ecommerce";
import { CART_ITEMS } from "../../../test/data-manager";

describe('CartItemProductService', () => {
    let service: CartItemProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [CartItemProductService],
        });
        service = TestBed.inject(CartItemProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('addProductInfoToLineItems() should return all the line item info for the given cartItem', () => {
        spyOn(service, 'addProductInfoToLineItems').withArgs([CART_ITEMS[3]]).and.returnValue(of(CART_ITEMS));
        service.addProductInfoToLineItems([CART_ITEMS[3]]).pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(CART_ITEMS);
        });
    });
})