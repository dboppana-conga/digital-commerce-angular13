import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ProductAttribute, Product, ProductAttributeValue } from '../classes/index';
import { of } from 'rxjs';
import { get, flatten, map, isNil, forEach, set, find } from 'lodash';
import { ProductAttributeGroupMemberService } from './product-attribute-group.service';

/**
 * <strong>This service is a work in progress.</strong> 
 * 
 * Product attributes represent a characteristic of a product that can have different values like color, vendor etc.
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductAttributeService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private productAttributeService: ProductAttributeService)
}
// or
export class MyService extends AObjectService {
     private productAttributeService: ProductAttributeService = this.injector.get(ProductAttributeService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductAttributeService extends AObjectService {
    type = ProductAttribute;

    protected productAttributeGrpMemberService: ProductAttributeGroupMemberService = this.injector.get(ProductAttributeGroupMemberService);

    /**
     * Method gets a list of product attributes for a given product. Can further filter the list by a group.
     * ### Example:
```typescript
import { ProductAttributeService, ProductAttribute, Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    productAttributeList: Array<ProductAttribute>;
    productAttributeList$: Observable<Array<ProductAttribute>>;

    constructor(private productAttributeService: ProductAttributeService){}

    getProductAttributes(product: Product){
        this.productAttributeService.getProductAttributes(product).subscribe(attributeList => this.productAttributeList = attributeList);
        // or
        this.productAttributeList$ = this.productAttributeService.getProductAttributes(product);
    }
}
```
     * @param product the instance of the product for which to get the attributes for
     * @param attributeGroupName an optional argument of a specific group name with which to get attributes for.
     * @returns A hot observable containing list of product attributes for the given product.
     * 
     */
    getProductAttributes(product: Product, attributeGroupName?: string): Observable<Array<ProductAttribute>> {
       // To Do:
        // const conditions = [];
        // if (isNil(product))
        //     return of([]);
        // else {
        //     conditions.push(new ACondition(this.productAttributeGrpMemberService.type, 'ProductId', 'Equal', product.Id));
        //     if (attributeGroupName != null)
        //         conditions.push(new ACondition(this.productAttributeGrpMemberService.type, 'AttributeGroup.Name', 'Equal', attributeGroupName));
        //     return this.where(null, 'AND', null, [new ASort(this.type, 'Sequence', 'ASC')], null, [new AJoin(this.productAttributeGrpMemberService.type, 'AttributeGroupId', 'AttributeGroupId', conditions)]);
        // }
        return null;
    }

    /**
     * Method returns ProductAttributeValue with default attribute values for a given list of ProductAttributes.
     * ### Example:
```typescript
import { ProductAttributeService, ProductAttributeValue } from '@congacommerce/ecommerce';
import { Observable, of } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    pav: ProductAttributeValue;
    pav$: Observable<ProductAttributeValue>;

    constructor(private productAttributeService: ProductAttributeService){}

    getAttributeValueDefaults(product: Product){
        this.productAttributeService.getAttributeValueDefaults(attributeList).subscribe(result => this.pav$ = result);
        // or
        this.pav$$ = of(this.productAttributeService.getAttributeValueDefaults(attributeList));
    }
}
```
     * @param productAttributeList accepts an array of ProductAttributes.
     * @returns object of instance of an ProductAttributeValue.
     * 
     */

     getAttributeValueDefaults(productAttributeList: Array<ProductAttribute>): ProductAttributeValue {
    //    To Do:
    //     const attributeValue = new ProductAttributeValue();
    //     productAttributeList.forEach(attribute => attributeValue[attribute.Field] = SalesforceUtils.getDefaultValue(get(attribute, '_describe')));
    //     return attributeValue;
        return null;
     }

    /**
    * Method returns an array of product attributes.
    * Adds an additional property to all attributes returned called '_.describe'. This property contains metadata information about the attribute.
    * ### Example:
```typescript
import { ProductAttributeService, ProductAttribute, Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    productAttributeList: Array<ProductAttribute>;
    productAttributeList$: Observable<Array<ProductAttribute>>;

    constructor(private productAttributeService: ProductAttributeService){}

    setDescribeInformationOnProductAttributes(attributes: Array<ProductAttribute>){
        this.productAttributeService.setDescribeInformationOnProductAttributes(attributes).subscribe(attributeList => this.productAttributeList = attributeList);
        // or
        this.productAttributeList$ = this.productAttributeService.setDescribeInformationOnProductAttributes(attributes);
    }
}
```
    * @param attributes An array of products attributes for which '_describe' property with metadata information needs to be added.
    * @returns An array of product attributes with metadata information for each attribute.
    */
    setDescribeInformationOnProductAttributes(attributes: Array<ProductAttribute>): Observable<Array<ProductAttribute>> {
        return of(null);
    }

    /**
    * Method returns an array of product attributes.
    * ### Example:
```typescript
import { ProductAttributeService, ProductAttribute, Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    productAttributeList: Array<ProductAttribute>;
    productAttributeList$: Observable<Array<ProductAttribute>>;

    constructor(private productAttributeService: ProductAttributeService){}

    getAttributeGroupIdsForFields(attributes: Array<ProductAttribute>){
        this.productAttributeService.getAttributeGroupIdsForFields(attributes).subscribe(attributeList => this.productAttributeList = attributeList);
        // or
        this.productAttributeList$ = this.productAttributeService.getAttributeGroupIdsForFields(attributes);
    }
}
```
    * @param attributes An array of products attributes.
    * @returns An array of product attribute in an observable.
    * 
    */
    getAttributeGroupIdsForFields(attributes: Array<ProductAttribute>): Observable<Array<ProductAttribute>> {
        // To Do:
        // const fields = attributes.map(r => r.Field);
        // const filterList: Array<AFilter> = [];
        // filterList.push(new AFilter(this.type, [new ACondition(this.type, 'Field', 'In', fields)]));
        // return this.where(null, 'AND', filterList);
        return null;
    }
}

/**
 * @ignore
 * Placeholder service for the product attribute values
 */
@Injectable({
    providedIn: 'root'
})
export class ProductAttributeValueService extends AObjectService {

    type = ProductAttributeValue;
   
    getInstanceWithDefaults(product: Product, objectMetadata): ProductAttributeValue {
      const instance: ProductAttributeValue = this.getInstance() as ProductAttributeValue;
        const attributeMemberList = flatten(map(get(product, 'AttributeGroups', []), group => get(group.AttributeGroup, 'AttributeGroupMembers')));
        if (!isNil(objectMetadata)) {
            forEach(attributeMemberList,
                memeber => {
                    if (!isNil(memeber.Attribute))
                        set(instance, memeber.Attribute.Name, memeber.Attribute.DefaultValue);
                });
        }
        return instance;
    }
}