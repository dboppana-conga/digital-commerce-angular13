
import { EventEmitter, Injectable } from '@angular/core';
import { throwError as observableThrowError, of, Observable } from 'rxjs';
import { map, take, mergeMap, switchMap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { get, every, uniq, flatten, map as _map, values, filter, split, isEmpty, compact, uniqBy, concat } from 'lodash';
import { MemoizeAll } from 'lodash-decorators';
import { AObjectService, ConfigurationService } from '@congacommerce/core';
import { ConstraintRule } from '../classes/constraint-rules/constraint-rule.model';
import { AppliedRuleActionInfo } from '../classes/index';
import { Product } from '../../catalog/classes/product.model';
import { Cart } from '../../cart/classes/cart.model';
import { AppliedRuleActionInfoService } from './applied-rule-action-info.service';
import { ProductService, ProductOptionService } from '../../catalog/services';
import { CartService } from '../../cart/services/cart.service';
import { PriceListItemService } from '../../pricing/services/price-list-item.service';
import { AssetService } from '../../abo/services/asset.service';
import { ConstraintRuleActionService } from './constraint-rule-action.service';

/**
 * @ignore
 * Constraint rules are a powerful feature when configuring products. They allow you to include, excludes, recommend, validate and replace products based on business logic.
 */
@Injectable({
    providedIn: 'root'
})
export abstract class ConstraintRuleService extends AObjectService {
    type = ConstraintRule;

    protected productService: ProductService = this.injector.get(ProductService);
    protected cartService: CartService = this.injector.get(CartService);
    protected araiService: AppliedRuleActionInfoService = this.injector.get(AppliedRuleActionInfoService);
    protected pliService: PriceListItemService = this.injector.get(PriceListItemService);
    protected productOptionService: ProductOptionService = this.injector.get(ProductOptionService);
    protected configService = this.injector.get(ConfigurationService);
    protected assetService = this.injector.get(AssetService);
    protected constraintRuleActionService = this.injector.get(ConstraintRuleActionService);

    onConstraintRuleError: EventEmitter<string> = new EventEmitter<string>();

    /**
     * @ignore
     */
    // globalFilter(): Observable<AFilter[]> {
    //     return of([
    //         new AFilter(
    //             this.type,
    //             [
    //                 new ACondition(this.type, 'EffectiveDate', 'LessEqual', 'Today'),
    //                 new ACondition(this.type, 'EffectiveDate', 'Equal', null)
    //             ],
    //             null,
    //             'OR'
    //         ),
    //         new AFilter(
    //             this.type,
    //             [
    //                 new ACondition(this.type, 'ExpirationDate', 'GreaterThan', 'Today'),
    //                 new ACondition(this.type, 'ExpirationDate', 'Equal', null)
    //             ],
    //             null,
    //             'OR'
    //         ),
    //         new AFilter(
    //             this.type,
    //             [
    //                 new ACondition(this.type, 'Active', 'Equal', true)
    //             ]
    //         )
    //     ]);
    // }

    /**
     * @ignore
     * To DO:
     */
    associateAndApplyRules(finalize: boolean = false, cart?: Cart): Observable<void> {
        // const obsv = (cart) ? of(cart) : this.cartService.getMyCart(true).pipe(take(1));
        // return obsv.pipe(switchMap((_cart: Cart) =>
        //     this.araiService.deleteRulesForCart(_cart).pipe(
        //         mergeMap(() => this.associateConstraintRules(_cart)),
        //         mergeMap(() => this.applyConstraintRules(finalize, _cart))
        //     )
        // ));
        return of(null);
    }

    /**
     * This method can be used to fetch the list of constraint rules for the given list of productIds.
     * It will return all the configurations of a constraint rules with constraint rule conditon and constraint rule action.
     * ### Example:
        ```typescript
        import { ConstraintRule, ConstraintRuleService } from '@congacommerce/ecommerce';

        export class MyComponent implements OnInit{
        rule: Array<ConstraintRule>;
        rule$: Observable<Array<ConstraintRule>>;

        constructor(private crService: ConstraintRuleService){}

        ngOnInit(){
            this.crService.getConstraintRulesForProducts(productList: Array<string> | Array<Product>).subscribe(rulesList => {rule = rulesList;});
            // or
            this.rule$ = this.crService.getConstraintRulesForProducts(productList: Array<string> | Array<Product>);
        }
        }
        ```
        * @override
        * @param productList represnting the list of product Id as  string or  list of product instance of product object.
        * @param matchInPrimaryLines represnting the matchInPrimaryLines flag is a boolean value for a rule.
        * @param matchInOptions represnting the matchInOptions flag is a boolean value for a rule.
        * @return Observable<Array<ConstraintRule>> returns an observable of Array<ConstraintRule> records.
   */
    @MemoizeAll()
    getConstraintRulesForProducts(productList: Array<string> | Array<Product>, matchInPrimaryLines: boolean = true, matchInOptions: boolean = false): Observable<Array<ConstraintRule>> {
        /* TO DO : */
        return of(null);
        // if (!matchInPrimaryLines && !matchInOptions)
        //     return observableThrowError('matchInPrimaryLines or matchInOptions must be set to true');
        // if (get(productList, 'length') > 0) {
        //     let productIdList;
        //     if (every(productList, (item) => typeof (<any>item) === 'string'))
        //         productIdList = _map(productList, (productId) => ({ Id: productId }));
        //     else
        //         productIdList = _map(productList, (product) => ({ Id: get(product, 'Id') }));

        //     return this.apiService.post(`/products/rules?matchInPrimaryLines=${matchInPrimaryLines}&matchInOptions=${matchInOptions}`, productIdList, this.type)
        //         .pipe(map(productRuleMap => {
        //             return flatten(values(productRuleMap));
        //         }),
        //             map(rules => plainToClass(this.type, rules, { ignoreDecorators: true }) as unknown as Array<ConstraintRule>));
        // } else {
        //     return of(null);
        // }
    }

    /**
     * This method can be used to fetch the list of product for the given cart which has recommended rules set.
     * ### Example:
        ```typescript
        import { ConstraintRule, ConstraintRuleService } from '@congacommerce/ecommerce';

        export class MyComponent implements OnInit{
        products: Array<Product>;
        products$: Observable<Array<Product>>;

        constructor(private crService: ConstraintRuleService){}

        ngOnInit(){
            this.crService.getRecommendationsForCart().subscribe(products => {products = products;});
            // or
            this.products$ = this.crService.getRecommendationsForCart();
        }
        }
        ```
        * @override
        * @param cart represnting the cart record is optional, if cart record is not passed fetches the active cart.
        * @return Observable<Array<Product>> returns an observable of Array<Product> records.
   */
    getRecommendationsForCart(cart?: Cart): Observable<Array<Product>> {
        return of(null);
        //To Do:
        //this.araiService.getAppliedActionsForCart()
        //     .pipe(
        //         map(actions => filter(actions, action => action.ConstraintRuleAction.ActionType === 'Recommendation')),
        //         switchMap(actions => {
        //             const productIds = uniq(flatten(map(actions, split('SuggestProductIds', ','))));
        //             return this.productService.query({
        //                 conditions: [new ACondition(this.productService.type, 'Id', 'In', productIds)]
        //             });
        //         })
        //     );
    }

    /**
      * This method can be used to fetch the list of product which has recommended rules set for the list of product passed as argument.
      * ### Example:
         ```typescript
         import { ConstraintRule, ConstraintRuleService } from '@congacommerce/ecommerce';

         export class MyComponent implements OnInit{
         products: Array<Product>;
         products$: Observable<Array<Product>>;

         constructor(private crService: ConstraintRuleService){}

         ngOnInit(){
             this.crService.getRecommendationsForProducts(productList: Array<Product> | Array<string>).subscribe(products => {products = products;});
             // or
             this.products$ = this.crService.getRecommendationsForProducts(productList: Array<Product> | Array<string>);
         }
         }
         ```
         * @override
         * @param productList represnting the list of product record.
         * @return Observable<Array<Product>> returns an observable of Array<Product> records.
    */
    getRecommendationsForProducts(productList: Array<Product> | Array<string>): Observable<Array<Product>> {
        if (get(productList, 'length', 0) > 0) {
            //To Do:
            return of([]);
            // return this.getConstraintRulesForProducts(productList).pipe(
            //     map(rules => compact(uniqBy(rules, 'Id'))),
            //     mergeMap(rules => {
            //         if (isEmpty(compact(rules)))
            //             return of(null);
            //         else {
            //             return this.productService.query({
            //                 children: [
            //                     {
            //                         field: 'Apttus_Config2__AssetLineItems__r',
            //                         filters: [
            //                             new AFilter(
            //                                 this.assetService.type,
            //                                 [new ACondition(this.assetService.type, 'LineType', 'NotEqual', 'Option'),
            //                                 new ACondition(this.assetService.type, 'Product.ConfigurationType', 'NotEqual', 'Option'),
            //                                 new ACondition(this.assetService.type, 'IsPrimaryLine', 'Equal', true),
            //                                 new ACondition(this.assetService.type, 'AssetStatus', 'Equal', 'Activated')]
            //                             )
            //                         ],
            //                         lookups: [
            //                             {
            //                                 field: 'Product'
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         field: 'Apttus_Config2__PriceLists__r'
            //                     }
            //                 ],
            //                 joins: [
            //                     new AJoin(this.constraintRuleActionService.type, 'Id', 'ProductId', [
            //                         new ACondition(this.constraintRuleActionService.type, 'ActionType', 'Equal', 'Recommendation'),
            //                         new ACondition(this.constraintRuleActionService.type, 'ConstraintRuleId', 'In', rules.map(rule => rule.Id)
            //                         )
            //                     ])
            //                 ]
            //             });
            //         }
            //     })
            // );
        } else
            return of(null);
    }

    /**
     * This method can be used to fetch the list of Applied rule action info records for active cart.
     * It returns AppliedRuleActionInfo record having constraint rule action, actionType as Exclusion.
     * ### Example:
        ```typescript
        import { AppliedRuleActionInfo, ConstraintRuleService } from '@congacommerce/ecommerce';

        export class MyComponent implements OnInit{
        rule: Array<AppliedRuleActionInfo>;
        rule$: Observable<Array<AppliedRuleActionInfo>>;

        constructor(private crService: ConstraintRuleService){}

        ngOnInit(){
            this.crService.getExclusionProductActionsForCart().subscribe(rule => {rule = rule;});
            // or
            this.rule$ = this.crService.getExclusionProductActionsForCart();
        }
        }
        ```
        * @override
        * @return Observable<Array<AppliedRuleActionInfo>> returns an observable of Array<AppliedRuleActionInfo> records.
   */
    getExclusionProductActionsForCart(): Observable<Array<AppliedRuleActionInfo>> {
        // TO Do: RLP integartion
        return of(null);
        // return this.araiService.getAppliedActionsForCart()
        //     .pipe(
        //         map(actions => filter(actions, action => action.ConstraintRuleAction.ActionType === 'Exclusion'))
        //     );
    }
    /**
    * This method can be used to fetch the list of Applied rule action info records for active cart.
    * It returns  applied rule action info records have pending flag as true.
    * ### Example:
       ```typescript
       import { AppliedRuleActionInfo, ConstraintRuleService } from '@congacommerce/ecommerce';

       export class MyComponent implements OnInit{
       rule: Array<AppliedRuleActionInfo>;
       rule$: Observable<Array<AppliedRuleActionInfo>>;

       constructor(private crService: ConstraintRuleService){}

       ngOnInit(){
           this.crService.getPendingActionsForCart().subscribe(rule => {rule = rule;});
           // or
           this.rule$ = this.crService.getPendingActionsForCart();
       }
       }
       ```
       * @override
       * @return Observable<Array<AppliedRuleActionInfo>> returns an observable of Array<AppliedRuleActionInfo> records.
  */
    getPendingActionsForCart(): Observable<Array<AppliedRuleActionInfo>> {
        /* TO DO : */
        return of(null);
        // return this.araiService.getAppliedActionsForCart()
        //     .pipe(
        //         map(actions => {
        //             let filteredAppliedRuleAction = filter(actions, action => action.Pending === true && !isEmpty(concat(get(action, 'ActionProductIds'))));
        //             filteredAppliedRuleAction = this.getDistinctAppliedRules(filteredAppliedRuleAction);
        //             return filteredAppliedRuleAction;
        //         }));
    }

    /**
    * This method can be used to fetch the list of ConstraintRule records for given product identifier.
    * It do not fetch the constraint rule record if SkipRule flag is true.
    * ### Example:
       ```typescript
       import { ConstraintRule, ConstraintRuleService } from '@congacommerce/ecommerce';

       export class MyComponent implements OnInit{
       rule: Array<ConstraintRule>;
       rule$: Observable<Array<ConstraintRule>>;

       constructor(private crService: ConstraintRuleService){}

       ngOnInit(){
           this.crService.getRuleByProductId(productId: string).subscribe(rule => {rule = rule;});
           // or
           this.rule$ = this.crService.getRuleByProductId(productId: string);
       }
       }
       ```
       * @override
       * @param productId represnting the product identifier.
       * @return Observable<Array<ConstraintRule>> returns an observable of Array<ConstraintRule> records.
  */
    getRuleByProductId(productId: string): Observable<Array<ConstraintRule>> {
        // Don't fetch product rules if skipRules flag is set to true in the configuration.
        // return (this.configService.get('skipRules')) ? of(null) : this.cacheService.buffer(
        //     'constraint-rules',
        //     productId,
        //     (data) => {
        //         return this.apiService.post(`products/rules?matchInPrimaryLines=true&matchInOptions=false`, _map(uniq(data), r => ({ Id: r })));
        //     },
        //     (dataMap) => {
        //         return plainToClass(this.type, get(dataMap, productId), { ignoreDecorators: true });
        //     }
        // );
        return of(null);
    }

    /**
    * This method returns boolean value for  active cart's applied rule action record based on pending flag.
    * ### Example:
       ```typescript
       import { ConstraintRule, ConstraintRuleService } from '@congacommerce/ecommerce';

       export class MyComponent implements OnInit{
       haserror: boolean;
       haserror: Observable<boolean>;

       constructor(private crService: ConstraintRuleService){}

       ngOnInit(){
           this.crService.hasPendingErrors().subscribe(err => {haserror = err;});
           // or
           this.haserror$ = this.crService.hasPendingErrors();
       }
       }
       ```
       * @override
       * @param cart representing the cart record is an optional parameter, if cart record is not passed fetched the active cart.
       * @return Observable<boolean> returns an observable of boolean value.
  */
    hasPendingErrors(cart?: Cart): Observable<boolean> {
        return of(false);
        // return this.getPendingActionsForCart().pipe(
        //     map(rules => rules.filter(rule => rule.MessageType === 'Error').length > 0));
    }

    /**
     * Method used to distinct primary line level rules.
     * @ignore
    */
    getDistinctAppliedRules(appliedRules: Array<AppliedRuleActionInfo>): Array<AppliedRuleActionInfo> {
        /* TO DO : */
        return null;
        // let resp: Array<AppliedRuleActionInfo> = [];
        // let cartRule = filter(appliedRules, (elem) => elem.IsTargetPrimaryLine);
        // cartRule = uniqBy(cartRule, 'ConstraintRuleActionId');
        // const optionRule = filter(appliedRules, (elem) => elem.IsTargetOption);
        // resp = [...cartRule, ...optionRule]
        // return resp;
    }
}
