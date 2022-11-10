import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CartService, PricingModule, ProductOptionService, ProductService, PromotionService, StorefrontService, UserService } from '@congacommerce/ecommerce';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BatchSelectionService, DotsComponent, ExceptionService, ProductCardComponent, ProductConfigurationSummaryComponent } from '@congacommerce/elements';
import { ActivatedRoute, Router } from '@angular/router';
import { AObjectService, ConfigurationService } from '@congacommerce/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { PRODUCT_MOCK, STOREFRONT } from './data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';

describe('ProductCardComponent: ', () => {
    let component: ProductCardComponent;
    let fixture: ComponentFixture<ProductCardComponent>;
    const productConfiguration = jasmine.createSpyObj('ProductConfigurationSummaryComponent', ['show']);

    const storefrontServiceSpy = jasmine.createSpyObj<StorefrontService>(['getStorefront']);
    storefrontServiceSpy.getStorefront.and.callFake(() => of(STOREFRONT));
    const userServiceSpy = jasmine.createSpyObj<UserService>(['isLoggedIn']);
    const productServiceSpy = jasmine.createSpyObj<ProductService>(['fetch']);
    const configServiceSpy = jasmine.createSpyObj<ConfigurationService>(['get']);
    const batchSelectionServiceSpy = jasmine.createSpyObj<BatchSelectionService>(['addProductToSelection', 'getSelectedProducts', 'isProductSelected', 'removeProductFromSelection']);
    batchSelectionServiceSpy.getSelectedProducts.and.returnValue(of([PRODUCT_MOCK]));
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']); // create a router spy

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalModule.forRoot(), TranslateModule.forRoot(), PricingModule],
            declarations: [ProductCardComponent, ProductConfigurationSummaryComponent, DotsComponent],
            providers: [
                { provide: StorefrontService, useValue: storefrontServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
                { provide: ProductService, useValue: productServiceSpy },
                { provide: BatchSelectionService, useValue: batchSelectionServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ConfigurationService, useValue: configServiceSpy },
                { provide: PromotionService, useValue: {} },
                { provide: ActivatedRoute, useValue: {} },
                { provide: ExceptionService, useValue: {} },
                { provide: AObjectService, useValue: {} },
                { provide: ToastrService, useValue: {} },
                { provide: ProductOptionService, useValue: {} },
                { provide: CartService, useValue: {} },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ProductCardComponent);
        component = fixture.componentInstance;
        component.product = PRODUCT_MOCK;
        fixture.detectChanges();
    });

    it('Fetch product quantity', () => {
        const qty = 1;
        spyOn(component, 'fetchQuantity').withArgs(qty);
        expect(component.quantity).toEqual(qty);
    });

    it('return product is not selected in product drawer', () => {
        component.selected$ = of(false);
        spyOn(component, 'onProduct');
        component.selected$.subscribe(res => {
            expect(component['BatchSelectionService'].getSelectedProducts).toHaveBeenCalled();
            expect(res).toEqual(false);
        });
    });

    it('return product is selected in product drawer', () => {
        component.selected$ = of(true);
        fixture.detectChanges();
        component.selected$.subscribe(res => {
            expect(res).toEqual(true);
        });
    });

    it('Add product from selection drawer', fakeAsync(() => {
        const mockEvent = {
            target: {
                checked: true
            }
        }
        component.handleCheckbox(mockEvent);
        tick();
        fixture.detectChanges();
        expect(component['BatchSelectionService'].addProductToSelection).toHaveBeenCalled();
    }));

    describe('Call handleCheckbox() method', () => {
        let component: ProductCardComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductCardComponent);
            component = fixture.componentInstance;
            component.product = PRODUCT_MOCK;
            fixture.detectChanges();
        });
        it('Remove product from selection drawer', fakeAsync(() => {
            const mockEvent = {
                target: {
                    checked: false
                }
            }
            component.handleCheckbox(mockEvent);
            tick();
            fixture.detectChanges();
            expect(component['BatchSelectionService'].removeProductFromSelection).toHaveBeenCalled();
        }));
    });

    describe('Call handleCheckbox() method', () => {
        let component: ProductCardComponent;
        let router: Router;

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductCardComponent);
            router = TestBed.inject(Router);  
            component = fixture.componentInstance;
            component.product = PRODUCT_MOCK;
            fixture.detectChanges();
        });
        it('Navigate to product details page', fakeAsync(() => {
            component._product = PRODUCT_MOCK;
            component._product.HasAttributes = false;
            component._product.HasOptions = false;
            component.showProductConfiguration();
            const spy = router.navigate as jasmine.Spy; 
            const navArgs = spy.calls.first().args[0]; 
            expect(navArgs[0]).toBe('/products');
        }));
    });

    it('Show configuration modal for bundle prodcut', fakeAsync(() => {
        component._product = PRODUCT_MOCK;
        component._product.HasAttributes = true;
        component._product.HasOptions = true;
        component.quantity = 1;
        component.productConfiguration = productConfiguration;
        component.showProductConfiguration();
        tick();
        fixture.detectChanges();
        expect(component.productConfiguration.show).toHaveBeenCalledTimes(1);
    }));

    describe('Call removeProduct() method', () => {
        let component: ProductCardComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductCardComponent);
            component = fixture.componentInstance;
            component.product = PRODUCT_MOCK;
            fixture.detectChanges();
        });

        it('Remove product from drawer', fakeAsync(() => {
            component.removeProduct();
            tick();
            fixture.detectChanges();
            expect(component['BatchSelectionService'].removeProductFromSelection).toHaveBeenCalled(); /* Need to */
        }));
    });

    describe('Call ngOnInit() method', () => {
        let component: ProductCardComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductCardComponent);
            component = fixture.componentInstance;
            component.product = PRODUCT_MOCK;
            fixture.detectChanges();
        });

        it('Load product data card', fakeAsync(() => {
            userServiceSpy.isLoggedIn.and.returnValue(of(true));
            storefrontServiceSpy.getStorefront;
            spyOn(component, 'onProduct');
            component.ngOnInit();
            tick();
            fixture.detectChanges();
            expect(component.onProduct).toHaveBeenCalledTimes(1);
        }));
    });

    describe('Call onChanges() method', () => {
        let component: ProductCardComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductCardComponent);
            component = fixture.componentInstance;
            component.product = PRODUCT_MOCK;
            fixture.detectChanges();
        });

        it('Handle checkbox with unchecked', fakeAsync(() => {
            const mockEvent = {
                target: {
                    checked: false
                }
            }
            component.handleCheckbox(mockEvent);
            tick();
            fixture.detectChanges();
            expect(component['BatchSelectionService'].removeProductFromSelection).toHaveBeenCalled();
        }));

        it('Handle checkbox with checked', fakeAsync(() => {
            const mockEvent = {
                target: {
                    checked: true
                }
            }
            component.handleCheckbox(mockEvent);
            tick();
            fixture.detectChanges();
            expect(component['BatchSelectionService'].addProductToSelection).toHaveBeenCalled();
        }));
    });

});
