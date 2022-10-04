import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map as rmap } from 'rxjs/operators';
import { isEmpty, isNil, map, find, get } from 'lodash';
import { plainToClass } from 'class-transformer';
import { MemoizeAll } from 'lodash-decorators';
import { AObjectService } from '@congacommerce/core';
import { Product } from '../../catalog/classes/product.model';
import { CartItem } from '../classes/cart-item.model';
import { OrderLineItem, QuoteLineItem } from '../../order/classes';
import { PriceListService } from '../../pricing/services/price-list.service';

/**
 * @ignore
 */
@Injectable({ providedIn: 'root' })
export class CartItemProductService extends AObjectService {
    type = Product;
    protected priceListService: PriceListService = this.injector.get(PriceListService);

    @MemoizeAll
    addProductInfoToLineItems(items: Array<CartItem | OrderLineItem | QuoteLineItem>): Observable<Array<CartItem | OrderLineItem | QuoteLineItem>> {
        const productIds = map(items, item => {
            if (item.Product && isNil(item.Product.IsActive)) return item.Product.Id
        });
        if (!isEmpty(productIds)) {
            if (this.priceListService.isPricelistId()) { // Added this condition to avoid extra callouts when pricelist is undefined
                return this.apiService.get(`/catalog/v1/products?filters=in(Id:'${productIds.join("','")}')&includes=prices`, this.type, true).pipe(
                    rmap(res => {
                        const products = plainToClass(this.type, res) as unknown as Array<Product>;
                        map(items, item => item.Product = find(products, products => products.Id === get(item, 'Product.Id')))
                        return items;
                    })
                )
            }
        }
        return of(items);
    }
}