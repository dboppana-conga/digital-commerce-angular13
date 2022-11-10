import { TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { Category, CategoryService } from "@congacommerce/ecommerce";
import { CategoryFilterComponent } from "@congacommerce/elements";
import { TranslateService } from "@ngx-translate/core";
import { plainToClass } from "class-transformer";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { MOCK_CATEGORY, TranslatePipeMock } from "./data/data-manager";
import { forEach } from 'lodash';

describe('CategoryFilterComponent', () => {

    const categoryServiceSpy = jasmine.createSpyObj<CategoryService>(['getSubcategories', 'getRelatedCategories', 'getRootCategories', 'getCategoryBranchChildren']);
    categoryServiceSpy.getCategoryBranchChildren.and.returnValue(of(MOCK_CATEGORY));
    categoryServiceSpy.getSubcategories.and.returnValue(of(MOCK_CATEGORY));
    categoryServiceSpy.getRelatedCategories.and.returnValue(of([MOCK_CATEGORY[4]]));
    categoryServiceSpy.getRootCategories.and.returnValue(of([MOCK_CATEGORY[2]]));
    const translateServiceSpy = jasmine.createSpyObj<TranslateService>(['stream', 'get']);
    translateServiceSpy.stream.and.returnValue(of('string'));
    translateServiceSpy.get.and.returnValue(of('string'));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CategoryFilterComponent, TranslatePipeMock],
            imports: [RouterTestingModule],
            providers: [
                { provide: CategoryService, useValue: categoryServiceSpy },
                { provide: TranslateService, useValue: translateServiceSpy },
            ]
        }).compileComponents();
    });

    it('check component loaded', () => {
        const fixture = TestBed.createComponent(CategoryFilterComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('Call onCheckChange() method', () => {
        const fixture = TestBed.createComponent(CategoryFilterComponent);
        const app = fixture.componentInstance;
        app.filterGroup = new FormGroup({});
        let mockCategory = forEach(MOCK_CATEGORY, category => {
            app.filterGroup.addControl(category.Id, new FormControl());
        })
        app.categoryList$ = of(mockCategory);
        const mockEvent = null;
        app.onCheckChange(mockEvent);
        expect(categoryServiceSpy.getCategoryBranchChildren).toHaveBeenCalled();
    });

    it('Call getTranslatedTitle() method should return title', () => {
        const fixture = TestBed.createComponent(CategoryFilterComponent);
        const app = fixture.componentInstance;
        app.getTranslatedTitle('key');
        expect(translateServiceSpy.stream).toHaveBeenCalled();
    });

    describe('Call ngOnChanges() method', () => {
        it('Should call getSubcategories() method', () => {
            const fixture = TestBed.createComponent(CategoryFilterComponent);
            const app = fixture.componentInstance;
            app.category = plainToClass(Category, MOCK_CATEGORY[0]);
            app.relationship = 'children';
            app.ngOnChanges();
            app.categoryList$.pipe(take(1)).subscribe((res) => {
                expect(res.length).toBeGreaterThanOrEqual(MOCK_CATEGORY.length);
            });
        });

        it('Should call getRelatedCategories() method', () => {
            const fixture = TestBed.createComponent(CategoryFilterComponent);
            const app = fixture.componentInstance;
            app.category = plainToClass(Category, MOCK_CATEGORY[0]);
            app.relationship = 'peers';
            app.ngOnChanges();
            app.categoryList$.pipe(take(1)).subscribe((res) => {
                expect(res[0].Id).toEqual(MOCK_CATEGORY[4].Id);
                expect(res.length).toBeGreaterThanOrEqual([MOCK_CATEGORY[4]].length);
            });
        });

        it('Should call getRelatedCategories() method', () => {
            const fixture = TestBed.createComponent(CategoryFilterComponent);
            const app = fixture.componentInstance;
            app.category = null;
            app.relationship = 'peers';
            app.ngOnChanges();
            app.categoryList$.pipe(take(1)).subscribe((res) => {
                expect(res[0].Id).toEqual(MOCK_CATEGORY[2].Id);
                expect(res.length).toBeGreaterThanOrEqual([MOCK_CATEGORY[2]].length);
            });
        });

        it('Should return formcontrol for category list', () => {
            const fixture = TestBed.createComponent(CategoryFilterComponent);
            const app = fixture.componentInstance;
            app.category = null;
            app.relationship = 'children';
            app.categoryList$ = of(MOCK_CATEGORY);
            app.ngOnChanges();
            app.categoryList$.pipe(take(1)).subscribe((res) => {
                expect(res.length).toBeGreaterThanOrEqual(MOCK_CATEGORY.length);
            });
        });
    })
});