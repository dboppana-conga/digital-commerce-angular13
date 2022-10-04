
import {combineLatest,  Observable } from 'rxjs';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { PriceListService } from '../../pricing/services/price-list.service';
import { SearchResults } from '../../../interfaces/index';
import { AObjectService } from '@congacommerce/core';
import {  deburr } from 'lodash';
import { PriceListItemService } from '../../pricing/services';
import { TranslatorLoaderService } from '../../../services/translator-loader.service';
import { Injectable } from '@angular/core';

/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class SearchService extends AObjectService {

    protected productService = this.injector.get(ProductService);
    protected categoryService = this.injector.get(CategoryService);
    protected plService = this.injector.get(PriceListService);
    protected pliService = this.injector.get(PriceListItemService);
    protected translatorService = this.injector.get(TranslatorLoaderService);

// TO DO:
    searchProducts(searchString: string, limit: number = 10, pageNumber: number = 0, orderBy: string = null, orderDirection: 'ASC' | 'DESC' = null): Observable<SearchResults>{
        if(searchString && searchString.trim().length > 0){
            searchString = deburr(searchString);
            
            // const totalRecords$ = this.productService.query({
            //     conditions: conditions,
            //     searchString: searchString,
            //     joins: joins,
            //     aggregate: true
            // });

            // const searchRecords$ = this.productService.query({
            //     conditions: conditions,
            //     searchString: searchString,
            //     joins: joins,
            //     page: new APageInfo(limit, pageNumber)
            // });

            // return combineLatest([totalRecords$, searchRecords$])
            //     .pipe(
            //         map(([totalRecords, searchRecords]) => ({
            //             productList: searchRecords,
            //             totals: get(first(totalRecords), 'total_records')
            //         } as SearchResults))
            //     );
            return null;
        }else{
            return null;
            // return combineLatest(
            //     this.productService.query({conditions: conditions, sortOrder: [new ASort(this.productService.type, orderBy, orderDirection)], page: new APageInfo(limit, pageNumber), joins: joins, cacheStrategy: 'performance'}),
            //     this.productService.aggregate(conditions, 'AND', null, joins).pipe(map(res => get(first(res), 'total_records')))
            // ).pipe(
            //     map(res => {
            //         return {
            //             productList: res[0],
            //             totals: res[1]
            //         } as SearchResults;
            //     })
            // );
        }
    }
}
