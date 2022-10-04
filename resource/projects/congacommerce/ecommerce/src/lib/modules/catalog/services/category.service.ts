import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map, mergeMap, filter, switchMap, take } from 'rxjs/operators';
import { get, isNil, find, includes } from 'lodash';
import { Delay, MemoizeAll } from 'lodash-decorators';
import { plainToClass } from 'class-transformer';
import { AObjectService, TreeUtils } from '@congacommerce/core';
import { Category, Product, ProductCategory, ProductOptionGroup } from '../classes/index';
import { PriceListService } from '../../pricing/services/price-list.service';
import { TranslatorLoaderService } from '../../../services/translator-loader.service';
import { TurboApiService } from '../../../services/turbo-api.service';

/**
 * Category allows in organizing products in a way that makes it easy for visitors to find out what they're looking for
 * <h3>Usage</h3>
 *
 ```typescript
import { CategoryService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private categoryService: CategoryService)
}
// or
export class MyService extends AObjectService {
     private categoryService: CategoryService = this.injector.get(CategoryService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class CategoryService extends AObjectService {

    type = Category;

    protected turboService = this.injector.get(TurboApiService);
    protected plService = this.injector.get(PriceListService, 'priceListService');
    protected translatorService = this.injector.get(TranslatorLoaderService, 'translatorService');
    protected productCategoryService = this.injector.get(ProductCategoryService, 'productCategoryService');

    private state: BehaviorSubject<Array<Category>> = new BehaviorSubject<Array<Category>>(null);

    /**
    * @ignore
    */
    onInit() {
        this.refresh();
    }

    /**
    * @ignore
    */
    refresh(): void {
        this.plService.refreshPriceList();
        this.plService.getPriceListId()
            .pipe(
                switchMap(() => this.apiService.get(`/catalog/v1/categories?page=1&limit=1000`)),
                switchMap(data => {
                    const categoryList = plainToClass(this.type, data, { excludeExtraneousValues: true }) as unknown as Array<Category>;
                    return of(categoryList);
                }), take(1)
            ).subscribe((categories) => this.state.next(categories));
    }

    /**
        * The  Primary method to get all the categories based on pricelist. This is a hot observable that will be updated when the state of the category changes.
        *
        * ### Example:
        ```typescript
       import { CategoryService } from '@congacommerce/ecommerce';

       export class MyComponent implements OnInit{
       categories: Array<Category>;
       categories$: Observable<Category>; // can be used in the template with {{(categories$ | async) as categories}}

       constructor(private categoryService: CategoryService){}

           ngOnInit(){
               this.categoryService.getCategories().subscribe(result => this.categories = category);
               // or
               this.cart$ = this.categoryService.getCategories();
           }
       }
       ```
       * @override
       * @returns A hot observable containing the Array of categories
       */

    getCategories(): Observable<Array<Category>> {
        return this.state
    }
    /**
     * The  method to get the Category By Name. This is a hot observable that will be updated when the state of the category changes.
     *
     * ### Example:
     ```typescript
    import { CategoryService } from '@congacommerce/ecommerce';

    export class MyComponent implements OnInit{
    category: Category;
    category$: Observable<Category>; // can be used in the template with {{(category$ | async)?.Label}}

    constructor(private categoryService: CategoryService){}

        ngOnInit(){
            this.categoryService.getCategoryByName('Electronics').subscribe(category => this.category = category);
            // or
            this.cart$ = this.categoryService.getCategoryByName();
        }
    }
    ```
    * @override
    * @returns A hot observable containing the single category instance
    * @param categoryName the name of the category to be passed as string.
    */

    getCategoryByName(categoryName: string): Observable<Category> {
        return this.getCategories().pipe(filter(r => !isNil(r)),map(categoryList => find(categoryList, (c) => c.Name === categoryName)));
    }

    /**
     * @ignore
     */
    @MemoizeAll()
    getCategoriesByProductId(productId: string): Observable<Category> {
        return this.apiService.get(`Apttus_Config2__ProductClassification__c?condition[0]=ProductId,Equal,${productId}&lookups=Classification`, this.productCategoryService.type);
    }

    /**
     * @ignore
     */
    getCategoryTree(): Observable<Array<Category>> {
        return this.getCategories().pipe(filter(r => !isNil(r)),map(data => {
            const tree = TreeUtils.arrayToTree(data, {
                parentProperty: 'AncestorId',
                childrenProperty: 'Children',
                customID: 'Id'
            });
            return tree;
        }));
    }

    /**
     *
     * @ignore
     */
    getOptionCategories(productOptionGroups: Array<ProductOptionGroup>): Observable<Array<Category>> {
        const rootCategoryIds = productOptionGroups.map(optionGroup => get(optionGroup, 'RootOptionGroup.Id'));

        // To DO:
        // const obsv$ = this.where(null, 'AND', [
        //     new AFilter(this.type, [
        //         new ACondition(this.type, 'PrimordialId', 'In', rootCategoryIds)
        //         , new ACondition(this.type, 'Id', 'In', rootCategoryIds)
        //     ], null, 'OR')
        // ]);

        // return obsv$.pipe(mergeMap(categories => this.translatorService.translateData(categories) as Observable<Array<Category>>));
        return null;
    }

    /**
     * @ignore
     */
    getCategoryBranch(categoryId: string): Observable<Array<Category>> {
        return this.getCategories().pipe(filter(r => !isNil(r)),map(data => this.getCategoryBranchSync(categoryId, data)));
    }

    /**
     * @ignore
     */
    getCategoryBranchSync(categoryId: string, categoryList: Array<Category>): Array<Category> {
        let categoryArray = new Array<Category>();
        let list = categoryList;
        let recursive = (_categoryId) => {
            for (let category of list) {
                if (category.Id === _categoryId) {
                    categoryArray.unshift(category);
                    if (category.AncestorId)
                        recursive(category.AncestorId);
                }
            }
        };
        recursive(categoryId);
        return categoryArray;
    }


    /** 
    * This method fetches all the children categories recursively for the categoryIds.
    * ### Example:
     ```typescript
    import { CategoryService, Category } from '@congacommerce/ecommerce';

    export class MyComponent implements OnInit{
    category: Array<Category>;
    category$: Observable<Array<Category>>; 

    constructor(private categoryService: CategoryService){}

        getCategoryBranchChildren(categoryIdList: Array<string>){
            this.categoryService.getCategoryBranchChildren(categoryIdList).subscribe(category => this.category = category);
            // or
            this.cart$ = this.categoryService.getCategoryBranchChildren(categoryIdList);
        }
    }
    ```
    * @param categoryIdList is an Array of categoryId's of type string.
    * @returns an  observable containing the array of categories
    */
    getCategoryBranchChildren(categoryIdList: Array<string>): Observable<Array<Category>> {
        const isIdList = [];// To Do: categoryIdList.every(SalesforceUtils.isValid);

        return this.getCategories().pipe(filter(r => !isNil(r)),
            map(data => {
                let categoryArray = data.filter(d => includes(categoryIdList, (isIdList) ? d.Id : d.Name));
                let recursive = (_categoryId: string) => {
                    const children = data.filter(category => category.AncestorId === _categoryId);
                    categoryArray = categoryArray.concat(children);
                    const nonLeafs = children.filter(child => child.IsLeaf !== 'Yes');
                    if (get(nonLeafs, 'length', 0) > 0)
                        nonLeafs.forEach(child => recursive(child.Id));
                };
                categoryIdList.forEach(c => recursive(c));
                return categoryArray;
            })
        );
    }

    /**
     * @ignore
     */
    getCategoryBranchForProduct(product: Product): Observable<Array<Category>> {
        if (get(product, 'Categories.length', 0) > 0) {
            const validCategories = product.Categories.filter(r => r.Classification.PrimordialId != null || r.Classification.AncestorId != null);
            if (validCategories && validCategories.length > 0) {
                let category: ProductCategory = validCategories[0];
                return this.getCategoryBranch(category.Classification.Id);
            } else
                return of(null);

        } else
            return of(null);
    }

    /**
     * @ignore
     */
    @Delay(1)
    getCategoryBranchForProductSync(product): Array<Category> {
        if (get(product, 'Categories.length', 0) > 0) {
            const validCategories = product.Categories.filter(r => r.Classification.PrimordialId != null || r.Classification.AncestorId != null);
            if (validCategories && validCategories.length > 0) {
                let category: ProductCategory = validCategories[0];
                return this.getCategoryBranchSync(get(category, 'Classification.Id'), this.state.value);
            } else
                return null;

        } else
            return null;
    }

    /**
     * @ignore
     */
    getSubcategories(categoryId: string, limit: number = 1000): Observable<Array<Category>> {
        if (categoryId) {
            return this.getCategories().pipe(filter(r => !isNil(r)),map(data =>
                data
                //To Do: data.filter((d) => SalesforceUtils.isEqual(d.AncestorId, categoryId)).slice(0, limit)
            ));
        } else
            return of(null);
    }


    /**
     * @ignore
     */
    getRelatedCategories(categoryId: string, limit: number = 1000): Observable<Array<Category>> {
        return this.getCategories().pipe(filter(r => !isNil(r)),map(data => {
            const category = find(data, (d) => d.Id === categoryId);
            return data.filter(d => d.Id === categoryId || d.AncestorId === category.AncestorId).slice(0, limit);
        }));
    }
    /**
     * @ignore
     */
    getRootCategories(): Observable<Array<Category>> {
        return this.getCategories().pipe(filter(r => !isNil(r)),map(data => data.filter(c => c.AncestorId == null)));
    }
}
/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class ProductCategoryService extends AObjectService {
    type = ProductCategory;
}