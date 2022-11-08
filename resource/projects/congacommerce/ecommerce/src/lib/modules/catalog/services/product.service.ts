import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { get, isEmpty, first, isNil, map as _map, filter as _filter, defaultTo, find, isBoolean } from 'lodash';
import { MemoizeAll } from 'lodash-decorators';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { switchMap, map, filter, take } from 'rxjs/operators';
import * as moment from 'moment';
import { AObject, AObjectService } from '@congacommerce/core';
import { Product, ProductResult } from '../classes/product.model';
import { ChargeType } from '../../pricing/enums/charge-type.enum';
import { ProductFilter } from '../../../interfaces/product-filter.interface';
import { PriceListService } from '../../pricing/services/price-list.service';
import { PriceListItemService } from '../../pricing/services/price-list-item.service';
import { TranslatorLoaderService } from '../../../services/translator-loader.service';
import { CategoryService, ProductCategoryService } from './category.service';
import { TurboApiService } from '../../../services/turbo-api.service';
import { AssetService } from '../../abo/services/asset.service';
import { PriceListItem } from '../../pricing/classes';

/** @ignore */
const _moment = moment;
/**
 * Products are the goods for buy /sell with its detailed information. The service provides methods for interacting with the products.
 * 
 * <h3>Usage</h3>
 *
 ```typescript
 import { ProductService, AObjectService } from '@congacommerce/ecommerce';

 constructor(private productService: ProductService) {}

 // or

 export class MyService extends AObjectService {
     private productService: ProductService = this.injector.get(ProductService);
  }
 ```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductService extends AObjectService {

    type = Product;

    protected plService: PriceListService = this.injector.get(PriceListService);
    protected pliService: PriceListItemService = this.injector.get(PriceListItemService);
    protected categoryService: CategoryService = this.injector.get(CategoryService);
    protected translatorService: TranslatorLoaderService = this.injector.get(TranslatorLoaderService);
    protected turboApiService: TurboApiService = this.injector.get(TurboApiService);
    protected assetService: AssetService = this.injector.get(AssetService);
    protected productCategoryService = this.injector.get(ProductCategoryService, 'productCategoryService');
    state: BehaviorSubject<PreviousState> = new BehaviorSubject<PreviousState>(null);
    eventback: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * @ignore
     * 
     */
    //  Filter products with invalid effective/expiration dates as turbo APIs don't handle it.
    filterInvalidProducts(products: Array<Product>): Array<Product> {
        let productList: Array<Product> = [];
        if (get(products, 'length') > 0) {
            const today = _moment(new Date()).valueOf();
            productList = _filter(products, p => {
                const pli: PriceListItem= defaultTo(find(get(p, 'PriceLists', []), (item) => item.ChargeType === ChargeType.StandardPrice || item.ChargeType === ChargeType.Subscription), get(p, 'PriceLists[0]'));
                const isProductExpired = (!isNil(p.ExpirationDate) && p.ExpirationDate.valueOf() < today) || (!isNil(p.EffectiveDate) && p.EffectiveDate.valueOf() > today);

                const isPliExpired = isNil(pli) || isNil(pli.ListPrice) || (!isNil(pli.ExpirationDate) && pli.ExpirationDate.valueOf() < today) || (!isNil(pli.EffectiveDate) && pli.EffectiveDate.valueOf() > today);
                if (!isProductExpired && !isPliExpired) return p;
            }) as Array<Product>;
        }
        return productList;
    }

    /**
     * This method is used to search products by search string
     * ###Example :
     ```typescript
        import { ProductService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    products: Array<Product>;
    products$: Observable<Array<Product>>;
    constructor(private productService: ProductService){}
    ngOnInit(){
        this.productService.searchProducts(searchString: string).subscribe(products => {...});
        // or
        this.products$ = this.productService.searchProducts(searchString: string);
    }
}
```
    * 
    * @override
    * @param searchString string to search the products with. Minimum characters in the search string must be 3.
    * @param limit a number representing the number of product records expected in the result set.
    * @param fetchTranslations boolean to fetch translations for the records searched. Default value is true.(<i>Work in progress</i>))
    * @return Observable<Array<Product>> returns an observable list of product records.
    */
    searchProducts(searchString: string, limit: number = 5, fetchTranslations: boolean = true): Observable<Array<Product>> {
        // Turbo API supports search with minimum 3 characters in the search string.
        if (searchString && searchString.length > 2) {
            return this.apiService.get(`/catalog/v1/products?limit=${limit}&query=${searchString}`);
        }
        else
            return of(null);
    }

    /**
    * This method can be used to get the fetch the list of products by product code.
    * ### Example:
```typescript
import { Product, ProductService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    products: Array<Product>;
    products$: Observable<Array<Product>>;
    constructor(private productService: ProductService){}
    ngOnInit(){
        this.productService.getProductsByCode(productCodeList: Array<string>).subscribe(products => {...});
        // or
        this.products$ = this.productService.getProductsByCode(productCodeList: Array<string>);
    }
}
```
    * @override
    * @param productCodeList Array of string represnting the list of product codes.
    * @return Observable<Array<Product>> returns an observable list of product records.
    * 
    * @ignore
    */
    getProductsByCode(productCodeList: Array<string>): Observable<Array<Product>> {
        // return this.where([
        //     new ACondition(this.type, 'ProductCode', 'In', productCodeList.map(code => code))
        // ]
        // ).pipe(flatMap(productList => this.translatorService.translateData(productList)));
        return null;
    }

    /**
    * This method can be used to get the fetch the list of ProductResults
    * including total product count, for a given price list and category.
    * ### Example:
```typescript
import { Product, ProductService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    products: Array<Product>;
    products$: Observable<Array<Product>>;
    constructor(private productService: ProductService){}
    ngOnInit(){
        this.productService.getProducts(categories: Array<string>,
            pageSize: number,
            pageNumber: number,
            orderBy: string,
            orderDirection: 'ASC' | 'DESC',
            searchString: string,
            adtlConditions: Array<ACondition>
            ).subscribe(products => {...});
        // or
        this.products$ = this.productService.getProducts(categories: Array<string>,
            pageSize: number,
            pageNumber: number,
            orderBy: string,
            orderDirection: 'ASC' | 'DESC',
            searchString: string,
            adtlConditions: Array<ACondition>
            );
    }
}
```
    * @override
    * @param categories List of categories the products belong to.
    * @param pageSize
    * @param pageNumber
    * @param orderBy string representing the sort field on result set. 
    * @param orderDirection to sort the result sets. Default value is Asending.
    * @param searchString to search products matching the string.
    * @param adtlConditions list of additional AConditions to filter the product list.
    * @param fetchProductFeatures boolean to fetch product feature values. Defaulted to true.(<i>Work in progress</i>)
    * @param fetchTranslations boolean to fetch product translations. Default value is true.(<i>Work in progress</i>)
    * @param filter ProductFilter record to filter products based on filter condition.
    * @return Observable<Array<ProductResult>> returns an observable list of ProductResult.
    */
    getProducts(
        categories: Array<string>,
        pageSize: number = 10,
        pageNumber: number = 1,
        orderBy: string = null,
        orderDirection: 'ASC' | 'DESC' = null,
        searchString = null,
        adtlConditions: Array<any> = null,
        fetchProductFeatures = true,
        fetchTranslations = true,
        filter: ProductFilter = null
    ): Observable<ProductResult> {
        let queryparam = new URLSearchParams();
        orderBy && queryparam.append('sort', `${defaultTo(orderDirection, 'ASC')}(${orderBy})`);
        searchString && queryparam.append('query', searchString);
        filter && queryparam.append('filters', `${filter.filterOperator}(${filter.field}:'${filter.value.join("','")}')`);
        const params = isEmpty(queryparam.toString()) ? '' : `&${queryparam.toString()}`;
       if(this.plService.isPricelistId()){ // Handles scenarios when switching is done between accounts without pricelist  
        if (isEmpty(adtlConditions) && (isEmpty(categories) || isNil(categories))) {
            return this.plService.getPriceListId().pipe(
                switchMap(pl => this.apiService.get(`/catalog/v1/products?includes=options&includes=attributes&includes=prices${params}&page=${pageNumber}&limit=${pageSize}`)),
                switchMap(result => {
                    const productList = plainToClass(Product, result, { excludeExtraneousValues: true }) as unknown as Array<Product>;
                    return combineLatest([of(productList), of(get(result, 'TotalCount'))]);
                }),
                map(([products, totalCount]) => {
                    return {
                        Products: products,
                        TotalCount: totalCount
                    } as ProductResult;
                })
            )
        } else if (!isEmpty(adtlConditions) || get(categories, 'length') > 1) {
            // TODO: Add implementation when RLP API to fetch products for multiple categories is available. For now this always returns Totalcount as 0.
            return of(null).pipe(  
            map((products) => {
                return {
                    Products: products,
                    TotalCount: 0
                } as ProductResult;
            }))

        } else {
            return this.plService.getPriceListId().pipe(
                switchMap(pl => this.apiService.get(`/catalog/v1/categories/${first(categories)}/products?includes=attributes&includes=options&includes=prices${params}&page=${pageNumber}&limit=${pageSize}`)),
                switchMap(result => {
                    const productList = plainToClass(Product, result, { excludeExtraneousValues: true }) as unknown as Array<Product>;
                    return combineLatest([of(productList), of(get(result, 'TotalCount'))]);
                }),
                map(([products, totalCount]) => {
                    return {
                        Products: products,
                        TotalCount: totalCount
                    } as ProductResult;
                })
            )
        }
    }
    else{ // Handles scenarios when switching is done between accounts without pricelist  
        return of(
            {
                Products: [],
                TotalCount: 0
            } as ProductResult);
    }
    }

    /**
    * This method can be used to get the fetch the product details for a given product identifier.
    * It will return all the configurations of a bundle including option and attribute groups.
    * ### Example:
```typescript
import { Product, ProductService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    product: Product;
    product$: Observable<Product>;
    constructor(private productService: ProductService){}
    ngOnInit(){
        this.productService.fetch(id: string).subscribe(product => {...});
        // or
        this.product$ = this.productService.fetch(id: string);
    }
}
```
    * @override
    * @param id represnting the product identifier.
    * @return Observable<Product> returns an observable of product record.
    */

    @MemoizeAll()
    fetch(Id: string): Observable<AObject> {
        const subject = new BehaviorSubject<Product>(null);

        this.apiService.get(`/catalog/v1/products/${Id}?includes=options&includes=attributes&includes=prices&inlcudes=categories`, Product, false)
            .pipe(
                take(1)
            )
            .subscribe(
                product => {
                    subject.next(product as Product)
                }
            );

        return subject.pipe(filter(r => r != null));
    }

    /**
     * This method returns the picklist values for a given field from product object.
     * ### Example:
```typescript
import { Product, ProductService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    product: Array<string>;
    product$: Observable<Array<string>>;
    constructor(private productService: ProductService){}
    ngOnInit(){
        this.productService.getFieldPickList(fieldName).subscribe(product => {...});
        // or
        this.product$ = this.productService.getFieldPickList(fieldName);
    }
}
```
     * @param fieldName Product field name to fetch picklist values for.
     * @returns observable containing list of string picklist values.
     */
    getFieldPickList(fieldName = null): Observable<Array<string>> {
        return this.describe(this.type, fieldName, true)
            .pipe(map(res => _map(res, item => item.Value as string)));
    }

    /**
     * This method returns the previous state of the catalog page containing sortfield and page number.
     * ### Example:
```typescript
import { PreviousState, ProductService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    state: PreviousState;
    constructor(private productService: ProductService){}
    ngOnInit(){
        this.state = this.productService.getState();
    }
}
```
     * @returns PreviousState objcet containing the sort order and page number values
     */
    getState(): PreviousState {
        return this.state.value;
    }

    /**
     * This method records the prevoius state of the catalog page and updates the state.
     * ### Example:
```typescript
import { PreviousState, ProductService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private productService: ProductService){}
    updateState(pagestates: PreviousState){
        this.productService.publish(pagestates);
    }
}
```
     */
    publish(pagestates: PreviousState) {
        this.eventback.next(false)
        this.state.next(pagestates)
    }

    /**
     * The Static method updates the values such as page size, view etc in local storage.
     * ### Example:
```typescript
import { ProductService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    cartId: string;

    setValue(key: string, pageValue: string){
        ProductService.setValue(key, pageValue);
    }
}
```
    **/ 
    static setValue(key: string, pageValue: string) {
        localStorage.setItem(key, pageValue);
    }

    /**
     * The Static method fetches the values from the local storage.
     * ### Example:
```typescript
import { ProductService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    value: string;

    getValue(key){
        this.value = ProductService.getValue(key);
    }
}
```
    **/ 
    static getValue(key): string {
        if (localStorage.getItem(key))
            return localStorage.getItem(key);
        else return null;
    }
}

export interface PreviousState {
    sort: string;
    page: number;
}