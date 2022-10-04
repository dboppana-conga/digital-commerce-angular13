import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';
import { of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { flatten, compact } from 'lodash';
import { ProductAttributeGroup } from '../classes/product-attribute-group.model';
import { ProductAttributeGroupMember } from '../classes/product-attribute-group-member.model';
import { Product } from '../classes/product.model';
import { ProductAttributeService } from './product-attribute.service';
import { TranslatorLoaderService } from '../../../services/translator-loader.service';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * ProductAttributeGroupService contains method to get the list of product attribute groups for the list of products/product Ids passed.
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductAttributeGroupService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private productAttributeGroupService: ProductAttributeGroupService)
}
// or
export class MyService extends AObjectService {
     private productAttributeGroupService: ProductAttributeGroupService = this.injector.get(ProductAttributeGroupService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductAttributeGroupService extends AObjectService {
    type = ProductAttributeGroup;

    protected productAttributeService: ProductAttributeService = this.injector.get(ProductAttributeService);
    protected translatorService: TranslatorLoaderService = this.injector.get(TranslatorLoaderService);
    protected productAttributeGrpMemberService: ProductAttributeGroupMemberService = this.injector.get(ProductAttributeGroupMemberService);

    /**
     * Method returns an observable containing array of product attribute groups for the list of products/product Ids passed.
     * ### Example:
```typescript
import { ProductAttributeGroupService, Product, ProductAttributeGroup } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    attributeGroupList: Array<ProductAttributeGroup>;
    attributeGroupList$: Observable<Array<ProductAttributeGroup>>;

    constructor(private productAttributeGroupService: ProductAttributeGroupService){}

    getProductAttributeGroups(productList: Array<string | Product>){
        this.productAttributeGroupService.getProductAttributeGroups(productList).subscribe(attributeGroups => this.attributeGroupList = attributeGroups);
        // or
        this.attributeGroupList$ = this.productAttributeGroupService.getProductAttributeGroups(productList);
    }
}
```
     * @param productList An array of products or a string of product Ids for which the product attribute group information needs to be acquired.
     * @returns An observable containing array of product attribute groups.
     * 
     */
    getProductAttributeGroups(productList: Array<string | Product> = []): Observable<Array<ProductAttributeGroup>> {
        let obsv$ = of([]);
        if (productList.every(item => typeof item === 'string')) {
            // To DO:
            // obsv$ = this.where(null, 'AND', null, null, null, [
            //     new AJoin(this.productAttributeGrpMemberService.type, 'Id', 'AttributeGroupId', [
            //         new ACondition(this.productAttributeGrpMemberService.type, 'ProductId', 'In', productList)
            //     ])
            // ]);
            return null;
        } else {
           // obsv$ = this.get(uniq(flatten(productList.map((p: Product) => get(p, 'AttributeGroups', []).map(g => g.AttributeGroup.Id)))));
            return null;
        }
        return obsv$.pipe(
            switchMap(productAttributeGroupList => this.translatorService.translateData(productAttributeGroupList)),
            switchMap(translatedProductAttributeGroupList => {
                const productAttributes = compact(flatten(translatedProductAttributeGroupList.map(group => group.ProductAttributes)));
                return this.productAttributeService.setDescribeInformationOnProductAttributes(productAttributes).pipe(map(attrs => translatedProductAttributeGroupList));
            })
        )
    }
}
 /**
  *  @ignore 
 */
@Injectable({
    providedIn: 'root'
})
export class ProductAttributeGroupMemberService extends AObjectService {
    type = ProductAttributeGroupMember;
}