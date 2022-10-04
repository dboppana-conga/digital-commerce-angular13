import { AttributeRuleResult } from '../interfaces/attribute-rule.interface';
import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';
import * as _ from 'lodash';
import { Observable, zip, of, BehaviorSubject } from 'rxjs';
import { Product, ProductAttributeRule, ProductAttributeValue } from '../../catalog/classes/index';

import { map, flatMap, mergeMap, take, filter } from 'rxjs/operators';
import { memoize, MemoizeAll } from 'lodash-decorators';
import { ProductService } from '../../catalog/services';

/**
 * @ignore
 * Attribute rules is  a powerful feature when configuring products. 
 * They allow you to 'Allow', 'Default','Hidden','Disabled', 'Required' actions on the product attributes
 * based on business logic.
 */
@Injectable({
    providedIn: 'root'
})
export class AttributeRuleService extends AObjectService {
    type = ProductAttributeRule;

    protected productService: ProductService = this.injector.get(ProductService);

    onInit() {
    }

    /**@ignore */
    getActionFlag(action: string, actionName: string): boolean {
        return action === actionName;
    }
    /**@ignore */
    getResetFlag(action: string, resetValues: Array<string>): boolean {
        return action === 'Reset' && resetValues.length > 0;
    }

    /**
     * Process the ABC constraint rule action, given attribute rule and matrix constraints.
     * @param productList instance of Array of product object or list of product ids of type string.
     * @returns Observable array of processed attribute rules for the given product.
     * TO Do:
     */
    @MemoizeAll()
    getAttributeRulesForProducts(productList: Array<string> | Array<Product>): Observable<Array<AttributeRuleResult>> {
        const subject = new BehaviorSubject<Array<AttributeRuleResult>>(null);
        // if (productList) {
        //     // First query retrieves list of potential rules that the product list is a member of
        //     productList = (<any>productList).filter(p => p != null);
        //     const product$ = ((<Array<any>>productList).every((item: any) => typeof (<any>item) === 'string')) ? this.productService.get(<Array<string>>productList) : of(<Array<Product>>productList);
        //     product$
        //     .pipe(
        //         mergeMap((_productList: Array<Product>) => {
        //         const familyList = _productList.map(p => _.get(p, 'Family')).filter(r => r != null);
        //         const groupList = _.flatten(_productList.map(p => _.get(p, 'ProductGroups', []))).map(group => _.get(group, 'ProductGroupId')).filter(x => x != null);
        //         let filters = [];

        //         filters = [
        //             new AFilter(this.type, [
        //                 new ACondition(this.type, 'ProductScope', 'In', ['', 'All']),
        //                 new ACondition(this.type, 'ProductScope', 'Includes', _productList.map(p => p.Id))
        //             ], null, 'OR')];

        //         if (_.get(familyList, 'length') > 0) {
        //             filters.push(new AFilter(this.type, [
        //                 new ACondition(this.type, 'ProductFamilyScope', 'In', ['', 'All']),
        //                 new ACondition(this.type, 'ProductFamilyScope', 'Includes', familyList)
        //             ], null, 'OR'));
        //         }
        //         if (_.get(groupList, 'length') > 0)
        //             filters.push(new AFilter(this.type, [
        //                 new ACondition(this.type, 'ProductGroupScope', 'In', ['', 'All']),
        //                 new ACondition(this.type, 'ProductGroupScope', 'Includes', groupList)
        //             ], null, 'OR'));

        //         return zip(this.where([new ACondition(this.type, 'Active', 'Equal', true)], 'AND', filters, null, new APageInfo(50, 1), null), this.describe(ProductAttributeValue))
        //             .pipe(
        //                 map(([attrRules, attrMetadata]) => {
        //                     _productList.forEach(product => {
        //                         const mergeActionResult = {};
        //                         _.forEach(attrRules, attrRule => {
        //                             const ruleActions = attrRule.ProductAttributeRuleActions;
        //                             _.forEach(ruleActions, (ruleAction, index, list) => {
        //                                 const apiName = ruleAction.Field.indexOf('.') > -1 ? ruleAction.Field.split('.').pop() : ruleAction.Field;
        //                                 const fieldType = attrMetadata.fields.find(r => r.name === apiName).type;
        //                                 const isSelectType = (fieldType === 'multipicklist') || (fieldType === 'picklist');

        //                                 if (ruleAction.Action === 'Allow' && !isSelectType) {
        //                                     list.splice(index, 1);
        //                                 } else {
        //                                     if (mergeActionResult.hasOwnProperty(apiName) && _.get(mergeActionResult, `${apiName}`)) {
        //                                         const attributeResult: AttributeRuleResult = mergeActionResult[apiName];
        //                                         attributeResult.isHiddenAction = attributeResult.isHiddenAction ? attributeResult.isHiddenAction : this.getActionFlag(ruleAction.Action, 'Hidden');
        //                                         attributeResult.isReadOnlyAction = attributeResult.isReadOnlyAction ? attributeResult.isReadOnlyAction : this.getActionFlag(ruleAction.Action, 'Disabled');
        //                                         attributeResult.isRequiredAction = attributeResult.isRequiredAction ? attributeResult.isRequiredAction : this.getActionFlag(ruleAction.Action, 'Required');

        //                                         if (this.getActionFlag(ruleAction.Action, 'Allow') && !attributeResult.isConstraintAction) {
        //                                             attributeResult.isConstraintAction = true;
        //                                             attributeResult.values = ruleAction.Values;
        //                                         }

        //                                         if (this.getActionFlag(ruleAction.Action, 'Default') && !attributeResult.isDefaultAction) {
        //                                             attributeResult.isDefaultAction = true;
        //                                             attributeResult.defaultValue = ruleAction.Values;
        //                                         }

        //                                         if (this.getActionFlag(ruleAction.Action, 'Reset') && !attributeResult.isReset && ruleAction.Values.length > 0) {
        //                                             attributeResult.isReset = true;
        //                                             attributeResult.resetValues = ruleAction.Values;
        //                                         }
        //                                     } else {
        //                                         const attributeResult: AttributeRuleResult = {
        //                                             field: apiName,
        //                                             isConstraintAction: this.getActionFlag(ruleAction.Action, 'Allow'),
        //                                             isDefaultAction: this.getActionFlag(ruleAction.Action, 'Default'),
        //                                             isHiddenAction: this.getActionFlag(ruleAction.Action, 'Hidden'),
        //                                             isReadOnlyAction: this.getActionFlag(ruleAction.Action, 'Disabled'),
        //                                             isRequiredAction: this.getActionFlag(ruleAction.Action, 'Required'),
        //                                             isReset: this.getResetFlag(ruleAction.Action, ruleAction.Values),
        //                                             values: this.getActionFlag(ruleAction.Action, 'Default') ? [] : ruleAction.Values,
        //                                             sfDefaultValue: SalesforceUtils.getDefaultValue(_.find(attrMetadata.fields, (field) => field.name === apiName)),
        //                                             defaultValue: ruleAction.Values,
        //                                             resetValues: this.getResetFlag(ruleAction.Action, ruleAction.Values) ? ruleAction.Values : []
        //                                         };
        //                                         mergeActionResult[apiName] = attributeResult;
        //                                     }
        //                                 }
        //                             });
        //                         });
        //                         _.set(product, '_metadata.rules', Object.values(mergeActionResult) as Array<AttributeRuleResult>);
        //                     });
        //                     return _productList;
        //                 }),
        //                 map(results => _.flatten(_.map(results, r => _.get(r, '_metadata.rules')))));
        //     }),
        //     take(1)
        //     )
        //     .subscribe(
        //         results => subject.next(results)
        //     );
        // }

        return subject.pipe(filter(r => r != null));
    }
}
