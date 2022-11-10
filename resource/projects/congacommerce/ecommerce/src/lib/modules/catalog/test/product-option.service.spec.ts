import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApttusModule } from "@congacommerce/core";
import { ProductAttributeService, ProductOptionService } from "../services";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { CommerceModule } from '@congacommerce/ecommerce';
import { TranslateModule } from '@ngx-translate/core';
import { BUNDLE_PRODUCT_METADATA, CART, CART_ITEM, PRODUCT, productMockData, PRODUCT_WITH_NO_OPTION_GROUP } from './data/dataManger';
import { Product, ProductOptionGroup } from '../classes';
import { CartService } from '../../cart';
import { plainToClass } from 'class-transformer';

describe('ProductOptionService', () => {

    let service: ProductOptionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [ProductOptionService],
        });

        service = TestBed.inject(ProductOptionService);
    });

    describe('Call getProductOptions method with no option group', () => {
        let service: ProductOptionService
        beforeEach(() => {
            service = TestBed.inject(ProductOptionService);
        });
        it('Should return empty product option', () => {
            const product: Product = productMockData[0];
            const result = service.getProductOptions(product);
            expect(result.length).toEqual(0);
        });
    });

    describe('Call getProductOptions method', () => {
        let service: ProductOptionService
        beforeEach(() => {
            service = TestBed.inject(ProductOptionService);
        });
        it('Should return product option for the given product', () => {
            const product: Product = PRODUCT;
            const result = service.getProductOptions(product);
            expect(result[0]).toEqual(jasmine.objectContaining({
                ParentProductId: product.Id
            }))
        });
    });

    describe('Call getProductOptionsForGroup method with no option group', () => {
        let service: ProductOptionService
        beforeEach(() => {
            service = TestBed.inject(ProductOptionService);
        });
        it('Should return empty option group', () => {
            const product: Product = PRODUCT_WITH_NO_OPTION_GROUP;
            const result = service.getProductOptionsForGroup(product, null);
            expect(result.length).toEqual(0);
        });
    });

    describe('Call getProductOptionsForGroup method with option group', () => {
        let service: ProductOptionService
        beforeEach(() => {
            service = TestBed.inject(ProductOptionService);
        });
        it('Should return option group', () => {
            const product: Product = PRODUCT;
            const group = PRODUCT.OptionGroups as unknown as ProductOptionGroup;
            const result = service.getProductOptionsForGroup(product, group);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].ComponentProduct.Id).not.toEqual(null);
        });
    });

    xdescribe('Call getProductOptionTree method', () => { /* TO DO: Need to revisit */
        let service: ProductOptionService;
        let cartService: CartService;
        let productAttributeService: ProductAttributeService;
        beforeEach(() => {
            service = TestBed.inject(ProductOptionService);
            cartService = TestBed.inject(CartService);
            productAttributeService = TestBed.inject(ProductAttributeService);
        });
        it('Should return product with option group', () => {
            const product = plainToClass(Product, PRODUCT, { ignoreDecorators: true });
            spyOn(service, 'fetch').and.returnValue(of(product));
            spyOn(cartService, 'getMyCart').and.returnValue(of(CART));
            spyOn(productAttributeService, 'describe').and.returnValue(of(BUNDLE_PRODUCT_METADATA));
            const result = service.getProductOptionTree(product.Id);
            result.pipe(take(1)).subscribe((res) => {
            })
        });
    });

    xdescribe('Call groupOptionGroups method', () => { /* TO DO: Need to revisit */
        let service: ProductOptionService;
        let cartService: CartService;
        let productAttributeService: ProductAttributeService;

        beforeEach(() => {
            service = TestBed.inject(ProductOptionService);
            cartService = TestBed.inject(CartService);
            productAttributeService = TestBed.inject(ProductAttributeService);
        });
        it('Should return product option tree', () => {
            const product = plainToClass(Product, PRODUCT, { ignoreDecorators: true });
            spyOn(service, 'fetch').and.returnValue(of(PRODUCT));
            spyOn(cartService, 'getMyCart').and.returnValue(of(CART));
            spyOn(productAttributeService, 'describe').and.returnValue(of(BUNDLE_PRODUCT_METADATA));
            const result = service.groupOptionGroups(product, null, CART_ITEM, 'none', null);
        });
    });
})