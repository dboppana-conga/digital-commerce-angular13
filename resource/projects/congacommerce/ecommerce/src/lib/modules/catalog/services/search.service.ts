
import {combineLatest,  Observable, of } from 'rxjs';
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

    }
