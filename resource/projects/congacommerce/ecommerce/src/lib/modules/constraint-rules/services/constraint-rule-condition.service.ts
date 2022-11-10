import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';
import { ConstraintRuleCondition } from '../classes/index';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { Product } from '../../catalog/classes';

/**
 * @ignore
 * Constraint rules are a powerful feature when configuring products. They allow you to include, excludes, recommend, validate and replace products based on business logic.
 */
@Injectable({
    providedIn: 'root'
})
export class ConstraintRuleConditionService extends AObjectService {
    type = ConstraintRuleCondition;

    /**
     * getConstraintRuleConditionsForProduct method returns all the constraint conditions matching a given product
     * ### Example:
```typescript
import { ConstraintRuleConditionService, Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    constraintRuleConditions: Array<ConstraintRuleCondition>;
    constraintRuleConditions$: Observable<Array<ConstraintRuleCondition>>;

    constructor(private constraintRuleConditionService: ConstraintRuleConditionService){}

    getConstraintRuleConditionsForProduct(product: Product){
        this.constraintRuleConditionService.getConstraintRuleConditionsForProduct(product)
            .subscribe(conditions => this.constraintRuleConditions = conditions);
        // or
        this.constraintRuleConditions$ = this.constraintRuleConditionService.getConstraintRuleConditionsForProduct(product);
    }
}
```
     * @param product the instance of the product to get the constraint rules for
     * @returns an array of constraint rule conditions in an observable matching the given product
     * TO DO:
     */
    getConstraintRuleConditionsForProduct(product: Product): Observable<Array<ConstraintRuleCondition>> {
        /* TO DO : */
        // let productGroupIds = [];
        // if (_.get(product, 'ProductGroups[0].Id')) {
        //     productGroupIds = Object.keys(product.ProductGroups).map(key => product.ProductGroups[key].ProductGroupId);
        // }
        // if (productGroupIds) {
        //     return this.where([new ACondition(this.type, 'ProductId', 'Equal', product.Id), new ACondition(this.type, 'ProductGroupId', 'In', productGroupIds)], 'OR');
        // }
        // return this.where([new ACondition(this.type, 'Product.Id', 'Equal', product.Id)]);
        return of(null);
    }
}
