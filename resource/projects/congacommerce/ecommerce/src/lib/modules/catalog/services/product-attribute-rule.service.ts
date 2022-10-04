import { AObjectService } from '@congacommerce/core';
import { Injectable } from '@angular/core';
import { ProductAttributeRule, ProductAttributeRuleView } from '../classes/product-attribute-rule.model';
import { Observable } from 'rxjs';
/**
 * <strong>This service is a work in progress.</strong>
 *  
 * Product attribute rules are a powerful feature that add a level of dynamic configuration to products a given set of product attributes.
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductAttributeRuleService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private productAttributeRuleService: ProductAttributeRuleService)
}
// or
export class MyService extends AObjectService {
     private productAttributeRuleService: ProductAttributeRuleService = this.injector.get(ProductAttributeRuleService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductAttributeRuleService extends AObjectService {
    type = ProductAttributeRule;

    protected productAttributeRuleViewService = this.injector.get(ProductAttributeRuleViewService);
    /**
     * Method returns an array of product attribute rules for a given product
     * ### Example:
```typescript
import { ProductAttributeRuleService, ProductAttributeValue } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    productAttributeRules: Array<ProductAttributeRule>;
    productAttributeRules$: Observable<Array<ProductAttributeRule>>;

    constructor(private productAttributeRuleService: ProductAttributeRuleService){}

    getRulesForProduct(productCode: string){
        this.productAttributeRuleService.getProductRules(productCode).subscribe(ruleList => this.productAttributeRules = ruleList);
        // or
        productAttributeRules$ = this.productAttributeRuleService.getProductRules(productCode);
    }
}
```
     * @param productCode the code of the product for which to retrieve attribute rules for.
     * @returns an array of attribute rules in an observable for a given product code
     * 
     */
    public getProductRules(productCode: string): Observable<Array<ProductAttributeRule>> {
       // To Do:
        // return this.where(`ID IN
        //         (SELECT Apttus_Config2__ProductAttributeRuleId__c
        //             FROM Apttus_Config2__ProductAttributeRuleView__c
        //             WHERE Apttus_Config2__ProductId__r.ProductCode = '` + productCode + `')`);

        // return this.where(null, 'AND', null, null, null, [
        //     new AJoin(
        //         this.productAttributeRuleViewService.type, 'Id', 'ProductAttributeRuleId', [
        //             new ACondition(this.productAttributeRuleViewService.type, 'Product.ProductCode', 'Equal', productCode)
        //         ]
        //     )
        // ]);
        return null;
    }
}
 /**
  *  @ignore 
 */
@Injectable({
    providedIn: 'root'
})
export class ProductAttributeRuleViewService extends AObjectService {
    type = ProductAttributeRuleView;
}