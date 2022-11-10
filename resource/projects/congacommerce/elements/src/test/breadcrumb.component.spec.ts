import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AObjectService, CacheService } from "@congacommerce/core";
import { Category, CategoryService, Order, Product } from "@congacommerce/ecommerce";
import { BreadcrumbComponent } from "@congacommerce/elements";
import { TranslateService } from "@ngx-translate/core";
import { plainToClass } from "class-transformer";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { BREADCRUMB_LINK, MOCK_CATEGORY, ORDER, PRODUCT, TranslatePipeMock } from "./data/data-manager";

describe('BreadCrumbComponent', () => {

    const categoryServiceSpy = jasmine.createSpyObj<CategoryService>(['getCategoryBranch', 'getCategoryBranchForProduct']);
    categoryServiceSpy.getCategoryBranchForProduct.and.returnValue(of(MOCK_CATEGORY));
    categoryServiceSpy.getCategoryBranch.and.returnValue(of(MOCK_CATEGORY));
    const aObjectServiceSpy = jasmine.createSpyObj<AObjectService>(['describe']);
    const translateServiceSpy = jasmine.createSpyObj<TranslateService>(['stream']);
    translateServiceSpy.stream.and.returnValue(of('string'));
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BreadcrumbComponent, TranslatePipeMock],
            imports: [RouterTestingModule],
            providers: [
                { provide: CategoryService, useValue: categoryServiceSpy },
                { provide: AObjectService, useValue: aObjectServiceSpy },
                { provide: TranslateService, useValue: translateServiceSpy },
            ]
        }).compileComponents();
    });

    it('check component loaded', () => {
        const fixture = TestBed.createComponent(BreadcrumbComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    describe('call ngOnChanges() method', () => {

        it('Should call getAObjectBreadcrumbs() method', () => {
            const fixture = TestBed.createComponent(BreadcrumbComponent);
            const app = fixture.componentInstance;
            app.sobject = plainToClass(Order, ORDER, { ignoreDecorators: true });
            const mySpy = spyOn(app, 'getAObjectBreadcrumbs').and.returnValue(of(BREADCRUMB_LINK));
            app.ngOnChanges();
            expect(mySpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('call ngOnChanges() method', () => {
        it('Should call getCategoryBranchForProduct() method', () => {
            const fixture = TestBed.createComponent(BreadcrumbComponent);
            const app = fixture.componentInstance;
            app.sobject = plainToClass(Product, PRODUCT, { ignoreDecorators: true });
            app.ngOnChanges();
            expect(categoryServiceSpy.getCategoryBranchForProduct).toHaveBeenCalledTimes(1);
        });
    });

    describe('call ngOnChanges() method', () => {
        it('Should call getCategoryBranch() method', () => {
            const fixture = TestBed.createComponent(BreadcrumbComponent);
            const app = fixture.componentInstance;
            app.sobject = plainToClass(Category, MOCK_CATEGORY[0], { ignoreDecorators: true });
            app.ngOnChanges();
            expect(categoryServiceSpy.getCategoryBranch).toHaveBeenCalledTimes(1);
        });
    });

    describe('call ngOnChanges() method', () => {
        it('Should return null', () => {
            const fixture = TestBed.createComponent(BreadcrumbComponent);
            const app = fixture.componentInstance;
            app.sobject = null;
            app.ngOnChanges();
            app.breadcrumbs$.pipe(take(1)).subscribe((res) => {
                expect(res).toEqual(null);
            });
        });
    });

    it('call mapCategories() method', () => {
        const fixture = TestBed.createComponent(BreadcrumbComponent);
        const app = fixture.componentInstance;
        app.sobject = null;
        const result = app.mapCategories([MOCK_CATEGORY[0]]);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
});