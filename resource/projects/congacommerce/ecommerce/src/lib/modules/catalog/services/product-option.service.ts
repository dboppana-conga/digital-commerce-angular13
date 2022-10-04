import { Injectable } from '@angular/core';
import { of, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MemoizeAll } from 'lodash-decorators';
import * as moment from 'moment';
import {
    get,
    find,
    isNil,
    set,
    isEmpty,
    cloneDeep,
    first,
    forEach,
    filter,
    defaultTo,
    omit,
    sortBy,
    mapValues,
    includes,
    some,
    flatten,
    concat,
    map as _map,
    sumBy,
    every,
    memoize,
    remove
} from 'lodash';
import { AObjectService, TreeUtils } from '@congacommerce/core';
import { ProductOptionComponent, ProductOptionGroup, Product, ProductAttributeValue } from '../classes/index';
import { PriceListService } from '../../pricing/services/price-list.service';
import { PriceListItemService } from '../../pricing/services/price-list-item.service';
import { ProductService } from './product.service';
import { CartItem } from '../../cart/classes/cart-item.model';
import { CartItemService } from '../../cart/services/cart-item.service';
import { CartService } from '../../cart/services/cart.service';
import { ProductAttributeService, ProductAttributeValueService } from './product-attribute.service';
import { OrderLineItemService } from '../../order/services/order-line-item.service';
import { OrderLineItem } from '../../order/classes/order-line-item.model';
import { ProductAttributeGroupService } from './product-attribute-group.service';
import { QuoteLineItem } from '../../order/classes/quote-line-item.model';
import { QuoteLineItemService } from '../../order/services/quote-line-item.service';
import { AssetLineItem } from '../../abo/classes/asset-item.model';
import { AssetService } from '../../abo/services/asset.service';
import { LineItemService } from '../../../services/line-item.service';
import { LineStatus } from '../../cart/enums';
import { TurboApiService } from '../../../services/turbo-api.service';
import { plainToClass } from 'class-transformer';

/** @ignore */
const _moment = moment;

/**
 * The service provides methods for interacting with the products and returns options components configured for the bundle product .
 * 
 * <h3>Usage</h3>
 *
 ```typescript
 import { ProductOptionService, AObjectService } from '@congacommerce/ecommerce';

 constructor(private productOptionService: ProductOptionService) {}

 // or

 export class MyService extends AObjectService {
     private productOptionService: ProductOptionService = this.injector.get(ProductOptionService);
  }
 ```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductOptionService extends ProductService {
    type = Product;

    protected productAttributeValueService = this.injector.get(ProductAttributeValueService);
    protected assetService: AssetService = this.injector.get(AssetService);
    protected lineItemService: LineItemService = this.injector.get(LineItemService);
    protected cartItemService: CartItemService = this.injector.get(CartItemService);
    protected cartService: CartService = this.injector.get(CartService);
    protected productService: ProductService = this.injector.get(ProductService);
    protected plService: PriceListService = this.injector.get(PriceListService);
    protected turboService: TurboApiService = this.injector.get(TurboApiService);

    /**
    * Method takes a bundle product record and organizes the attributes and options into it's tree structure. Will filter out any attributes or option groups
    * that are empty and associate related cart items with each option
    * ### Example:
     ```typescript
     import { ProductOptionService, Product } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           product$: Observable<Product>;

           constructor(private productOptionService: ProductOptionService){}

           ngOnInit(){
                this.product$ = this.productOptionService.getProductOptionTree(productId);
           }
      }
     ``` 
    * @param productId Id of the product is of type string
    * @param relatedTo Related primary line item
    * @param applyFilter accepts 'none' | 'items' | 'changes', By default the value is set as 'none', i.e no filter is applied. If the applyFilter is 'items' it returns
    * options are selected. If the applyFilter is 'changes' it returns the attributes/options that are changed, required for helper method 'groupOptionGroups'
    * @param changes Changes accepts list fo cartItems.
    * @returns returns an observable of Product
    */
     getProductOptionTree(productId: string, relatedTo?: CartItem | QuoteLineItem | AssetLineItem | OrderLineItem, applyFilter: 'none' | 'items' | 'changes' = 'none', changes?: Array<CartItem>): Observable<Product> {
        return combineLatest([this.fetch(productId), this.cartService.getMyCart(), this.productAttributeValueService.describe()])// TODO: Add this back when cart is available
            .pipe(
                switchMap(([product, cart, metadata]) => {
                    if (product) {
                        const cartState = cart;
                        set(product, 'ProductAttributeMatrixViews', filter(get(product, 'ProductAttributeMatrixViews'), r => r.Active));
                        remove(get(product, 'ProductAttributeMatrixViews'), r => {
                            const expiredate = _moment(r.AttributeValueMatrix.ExpirationDate).format('YYYY-MM-DD');
                            return _moment(expiredate).isBefore(_moment(new Date()).format('YYYY-MM-DD'));
                        });
                        let cartItems$: Observable<Array<CartItem | QuoteLineItem | AssetLineItem | OrderLineItem>> = this.cartItemService.getCartItemsForProduct(product as Product, 1, cart);
                        if (!isEmpty(changes))
                            cartItems$ = of(changes);
                        else if (!isNil(get(relatedTo, 'AssetLineItem')))
                            cartItems$ = this.cartItemService.getCartItemsForAsset(relatedTo as CartItem, cart);
                        else if (!isNil(relatedTo))
                            cartItems$ = this.cartItemService.getOptionsForItem(relatedTo, cart)
                                        .pipe(
                                            switchMap((res) => of(plainToClass(CartItem, res))),
                                            map((result) => {
                                                // To DO: when PAV are available need to remove this code                          
                                                // TO DO: Need to remove this code when getlineitem API is available.
                                                let cartItems = result.filter(r => r.PrimaryLineNumber === relatedTo.PrimaryLineNumber);
                                                cartItems = cartItems.concat(result.filter(r => r.ParentBundleNumber === relatedTo.PrimaryLineNumber));
                                                forEach(cartItems, (i) => {
                                                    if (i.HasAttributes)
                                                    i.AttributeValue = this.productAttributeValueService.getInstanceWithDefaults(i.Product, i)
                                                });
                                                if(cartState.LineItems.length !== result.length) {
                                                    set(cartState, 'LineItems', result);
                                                    this.cartService.publish(cartState);
                                                }
                                                return cartItems as unknown as Array<CartItem>;
                                            }));

                        return cartItems$.pipe(
                            map(cartItems => {
                                const bundleProduct: Product = cloneDeep(product);
                                const cartItem = find(cartItems, (i) => get(i, 'LineType') === 'Product/Service');
                                const attrValue = isNil(changes) ? defaultTo(defaultTo(get(relatedTo, 'AttributeValue'), get(cartItem, 'AttributeValue')), new ProductAttributeValue()) : get(cartItem, 'AttributeValue');
                                set(cartItem, 'AttributeValue', attrValue);
                                bundleProduct.set('item', cloneDeep(cartItem));
                                return this.groupOptionGroups(bundleProduct, attrValue, cartItems, applyFilter, metadata, null);
                            })
                        );
                    } else
                        return of(null);
                })
            );
    }

    /**
     * This method returns a list of product options components configured for the bundle product.
     * Uses '@MemoizeAll()' decorator imported from 'lodash-decorators', only caches items that you actually use -- but 
     * holds on to all the cached items forever.
     * ### Example:
     ```typescript
     import { ProductOptionService, ProductOptionComponent } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           product$: Array<ProductOptionComponent>;

           constructor(private productOptionService: ProductOptionService){}

           ngOnInit(){
                this.product$ = this.productOptionService.getProductOptions(product);
           }
      }
     ```
     * @param product instance of product object.
     * @returns an Array of ProductOptionComponent.
     */
    @MemoizeAll()
    getProductOptions(product: Product): Array<ProductOptionComponent> {
        const items = [];

        const handleComponent = (c: ProductOptionComponent) => {
            items.push(c);
            forEach(get(c, 'ComponentProduct.OptionGroups', []), handleGroup);
        };

        const handleGroup = (g: ProductOptionGroup) => {
            forEach(get(g, 'ChildOptionGroups', []), handleGroup);
            forEach(get(g, 'Options'), handleComponent);
        };
        forEach(get(product, 'OptionGroups', []), (og) => handleGroup(og));
        return items;
    }

    /**
    * This method returns list of ProductOptionComponent filters out ProductOptionComponent which is not associated
    * with the group parameter.
    * ### Example:
     ```typescript
     import { ProductOptionService } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           productOptionGroup$: Array<ProductOptionComponent>;

           constructor(private productOptionService: ProductOptionService){}

           ngOnInit(){
                this.productOptionGroup$ = this.productOptionService.getProductOptionsForGroup(product, group);
           }
      }
     ```

    * @param product Instance of a  product to process
    * @param group  Instance of a product option group
    * @returns an array of ProductoptionComponent.
    */
    getProductOptionsForGroup(product: Product, group: ProductOptionGroup): Array<ProductOptionComponent> {
        const items = [];

        const handleComponent = (c: ProductOptionComponent) => {
            if (group.Id === get(c, 'ProductOptionGroup.Id')) {
                items.push(c);
            }
            forEach(get(c, 'ComponentProduct.OptionGroups', []), handleGroup);
        };

        const handleGroup = (g: ProductOptionGroup) => {
            forEach(get(g, 'ChildOptionGroups', []), handleGroup);
            forEach(get(g, 'Options'), handleComponent);

        };
        forEach(get(product, 'OptionGroups', []), (og) => handleGroup(og));
        return items;
    }
    /**
     * This method is responsible for creating the tree structure by looping through attribute groups and option groups in recursive fashion and generate tree structure keeping the 
     * primary bundle product as the root.
     * ### Example:
     ```typescript
     import { ProductOptionService, ProductAttributeValue, Product, CartItem , QuoteLineItem , AssetLineItem , OrderLineItem } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           Product$: Product;

           constructor(private productOptionService: ProductOptionService){}

           ngOnInit(){
                this.Product$ = this.productOptionService.groupOptionGroups(product, attributeValue, relatedItems, applyFilter, metadata);
                    }
      }
     ```
     * @param p is an instance of product object.
     * @param attributeValue is an instance of product attribute value object.
     * @param relatedItems is a list of CartItem | QuoteLineItem | AssetLineItem | OrderLineItem object.
     * @param applyFilter accepts 'none' | 'items' | 'changes', By default the value is set as 'none', i.e no filter is applied. If the applyFilter is 'items' it returns
     * options are selected. If the applyFilter is 'changes' it returns the attributes/options that are changed.
     * @param metadata is the metadata information of the related object.
     * @param parentItem is an instance of CartItem | QuoteLineItem | AssetLineItem | OrderLineItem object.
     * @returns product object.
     */

    groupOptionGroups(p: Product
        , attributeValue: ProductAttributeValue
        , relatedItems: Array<CartItem | QuoteLineItem | AssetLineItem | OrderLineItem>
        , applyFilter: 'none' | 'items' | 'changes' = 'none'
        , metadata: any
        , parentItem?: CartItem | QuoteLineItem | AssetLineItem | OrderLineItem
    ): Product {

        let optionGroups = get(p, 'OptionGroups', []);
        let attributeGroups = get(p, 'AttributeGroups', []);
        const changedStatus = [LineStatus.Amend, LineStatus.Upgrade, LineStatus.Cancel, LineStatus.New];
        parentItem = defaultTo(parentItem, find(relatedItems, i => get(i, 'LineType') === 'Product/Service' && i.IsPrimaryLine === true));
        // sort the list of ProductAttributes with in attribute groups.
        forEach(attributeGroups, group => {
            set(group.AttributeGroup, 'AttributeGroupMembers', sortBy(get(group.AttributeGroup, 'AttributeGroupMembers'), 'Sequence'));
        });

        const assetAttributeValue = get(parentItem, 'Asset.AttributeValue', get(parentItem, 'AttributeValue'));

      if (!isEmpty(attributeGroups) && applyFilter === 'items' || applyFilter === 'changes') {
        forEach(attributeGroups, group => {
            set(group.AttributeGroup, 'AttributeGroupMembers',
                filter(get(group.AttributeGroup, 'AttributeGroupMembers'), (member) => {
                    const attribute = member.Attribute;

                    // If the passed filter is "changes" then return the attributes that are changed.
                    if (applyFilter === 'changes') {
                        return get(assetAttributeValue, attribute.Name) !== get(attributeValue, attribute.Name);
                    }

                    return (!isNil(attributeValue)
                        ? !isNil(get(attributeValue, attribute.Name))
                        : !isNil(get(attributeValue, attribute.DefaultValue))
                    );
                })
            );
        });
        set(p, 'AttributeGroups', filter(attributeGroups, (group) => get(group.AttributeGroup, 'AttributeGroupMembers.length', 0) > 0));
    }
        if (!isEmpty(optionGroups)) {
            forEach(optionGroups, group => {

                forEach(get(group, 'Options', []), (option: ProductOptionComponent) => {

                    // Add Product Option Group to Product Option Component if it's missing
                    if (isNil(get(option, 'ProductOptionGroup'))) {
                        const productOptionGrp = omit(mapValues(group), ['Options', 'OptionGroup']);
                        set(option, 'ProductOptionGroup', productOptionGrp);
                    }

                    const item = find(relatedItems, i =>
                        get(i, 'Option.Id') === get(option, 'ComponentProduct.Id')
                        && get(i, 'ParentBundleNumber') === get(parentItem, 'PrimaryLineNumber')
                        && every(flatten(_map(optionGroups, g => get(g, 'Options'))), (o) => get(o, 'ComponentProduct._metadata.item.PrimaryLineNumber') !== get(i, 'PrimaryLineNumber'))
                    );

                    option.ComponentProduct.set('item', cloneDeep(item));
                    set(option, 'ComponentProduct.ProductAttributeMatrixViews', filter(get(option, 'ComponentProduct.ProductAttributeMatrixViews'), r => r.Active));
                    remove(get(option, 'ProductAttributeMatrixViews'), r => {
                        const expiredate = _moment(r.AttributeValueMatrix.ExpirationDate).format('YYYY-MM-DD');
                        return _moment(expiredate).isBefore(_moment(new Date()).format('YYYY-MM-DD'));
                    });
                    set(option, 'ComponentProduct.ProductOptionGroup.IsHidden', group.IsHidden);
                    set(option, 'ComponentProduct', this.groupOptionGroups(
                        get(option, 'ComponentProduct')
                        , get(item, 'AttributeValue')
                        , relatedItems
                        , applyFilter
                        , metadata
                        , item
                    ));
                    // Filter Product Option Components with invalid effective/expiration dates.
                    set(option, 'ComponentProduct', first(this.productService.filterInvalidProducts([option.ComponentProduct])));
                });
                if (applyFilter === 'changes')
                    set(group, 'Options',
                        filter(
                            get(group, 'Options'), (option) => includes(changedStatus, get(option, 'ComponentProduct._metadata.item.LineStatus'))
                                || some(get(option, 'ComponentProduct.OptionGroups'), (childGroup) => get(childGroup, '_metadata.summary.changes') > 0)
                        )
                    );
                else if (applyFilter === 'items')
                    set(group, 'Options',
                        filter(
                            get(group, 'Options'), (option) => !isNil(get(option, 'ComponentProduct._metadata.item')) || some(get(option, 'ComponentProduct.OptionGroups'), (childGroup) => get(childGroup, '_metadata.summary.items') > 0)
                        )
                    );

                // Remove any options that don't have price lists
                set(group, 'Options', filter(get(group, 'Options'), (option) => get(option, 'ComponentProduct.PriceLists.length', 0) !== 0));

                // Set the option group metadata
                set(group, '_metadata.summary', {
                    changes: sumBy(get(group, 'Options')
                        , (o) => Number(includes(changedStatus, get(o, 'ComponentProduct').get('item.LineStatus')))),
                    disabled: false
                });

                // Setting expand/collapse flag based on item selection.
                group.set('expand', (filter(get(group, 'Options'), (option) => get(option, 'ComponentProduct').get('item')).length > 0) || (filter(optionGroups, (g) => get(g, 'ParentOptionGroupId') === get(group, 'OptionGroup.Id')).length > 0) ? true : false);
            });

            // check all Option groups & Attribute groups are opened
            p.set('expandAll', (optionGroups.length === filter(optionGroups, (og) => og.get('expand')).length) && attributeGroups.length <= 1)

            // Filter out any groups that don't have options and aren't a parent
            set(p, 'OptionGroups',
                filter(get(p, 'OptionGroups')
                    , (optionGroup) => !isEmpty(get(optionGroup, 'Options'))
                        || some(get(p, 'OptionGroups'), (g => !get(g, 'IsHidden') && get(g, 'ParentOptionGroup.Id') === get(optionGroup, 'OptionGroup.Id') && !isEmpty(get(g, 'Options'))))
                )
            );

            // Organize it into a tree
            const tree = memoize(TreeUtils.arrayToTree, () => `optionTree-${p.Id}-${applyFilter}`);
            set(p, 'OptionGroups', tree(get(p, 'OptionGroups', []), {
                parentProperty: 'ParentOptionGroupId',
                childrenProperty: 'ChildOptionGroups',
                customID: 'OptionGroupId'
            }));
        }
        return p;
    }

    /**
     * Function that returns all the options that are Required but selected from UI.
     * ### Example:
     ```typescript
     import { ProductOptionService, ProductOptionComponent } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           productOption$: ProductOptionComponent;

           constructor(private productOptionService: ProductOptionService){}

           ngOnInit(){
                this.productOption$ = this.productOptionService.getRequiredUncheckedOptions(allOptions);
           }
      }
     ```
     * @param allOptions All product options
     * @returns an Array of Product option Component.
     */
    getRequiredUncheckedOptions(allOptions: Array<ProductOptionComponent>): Array<ProductOptionComponent> {
        // IsHidden option groups will not be considered
        let uncheckedRequiredOptions = filter(allOptions, (o) => o.Required && !o.ComponentProduct.get('item') && !get(o, 'ProductOptionGroup.IsHidden'));
        let requiredOptionGroups = _map(uncheckedRequiredOptions, (a) => a.ProductOptionGroup.OptionGroupId);
        let reqUnCheckedOpts = filter(allOptions,
            (ao) => get(ao.ComponentProduct, 'OptionGroups.length') > 0
                && filter(ao.ComponentProduct.OptionGroups, (og) => includes(requiredOptionGroups, og.OptionGroupId)));
        if (reqUnCheckedOpts.length > 0) {
            let uncheckOptions = flatten(_map(reqUnCheckedOpts, (re) => flatten(re.ComponentProduct.get('item') && _map(re.ComponentProduct.OptionGroups, (op) => filter(op.Options, (opts) => opts.Required && !get(opts, 'ProductOptionGroup.IsHidden'))))));
            uncheckOptions = concat(filter(allOptions, (ao) => ao.Required && ao.ParentProductId === first(reqUnCheckedOpts).ParentProductId && !get(ao, 'ProductOptionGroup.IsHidden')), uncheckOptions);
            return uncheckOptions;
        }
        return uncheckedRequiredOptions;
    }

    /**
      * This method returns a list of product options components that must be checked to add
      * a bundle configuration to the cart.
      * ### Example:
     ```typescript
     import { ProductOptionService, ProductOptionComponent } from '@congacommerce/ecommerce';
     import { Observable } from 'rxjs/Observable';

     export class MyComponent implements OnInit{
           productOption$: ProductOptionComponent;

           constructor(private productOptionService: ProductOptionService){}

           ngOnInit(){
                this.productOption$ = this.productOptionService.getRequiredOptions(productOptionComponents, cartItems);
           }
      }
     ```
      * @param productOptionComponents List of all product option components in a bundle.
      * @param cartItems List of selected line items in the configuration.
      * @returns an Array of ProductOptionComponent.
      */
    getRequiredOptions(productOptionComponents: Array<ProductOptionComponent>, cartItems: Array<CartItem>): Array<ProductOptionComponent> {
        // Get a list of product option components that aren't in the cart item array
        const uncheckedOptionComponents = filter(productOptionComponents, component => !get(component, 'ProductOptionGroup.IsHidden') && !includes(_map(cartItems, 'ProductOptionId'), get(component, 'Id')));

        // Filter out the unrequired options
        const requiredUncheckedOptions = filter(uncheckedOptionComponents, { Required: true });

        // Get the list of option group ids
        const requiredUncheckedOptionGroups = _map(requiredUncheckedOptions, option => get(option, 'ProductOptionGroup.OptionGroupId'));


        const reqdOptionsNeeded = filter(productOptionComponents,
            (optionComponent) => !isEmpty(get(optionComponent, 'ComponentProduct.OptionGroups'))
                && filter(get(optionComponent, 'ComponentProduct.OptionGroups'), (optionGrp) => !optionGrp.IsHidden && includes(requiredUncheckedOptionGroups, optionGrp.OptionGroupId)));

        if (reqdOptionsNeeded.length > 0) {
            // Get all required suboptions for the bundle options.
            let reqdOptions = flatten(_map(reqdOptionsNeeded, (optionComponent) => flatten(this.isProductOptionSelected(optionComponent, cartItems) && _map(optionComponent.ComponentProduct.OptionGroups, (optionGrp) => filter(optionGrp.Options, (opts) => opts.Required && !get(opts, 'ProductOptionGroup.IsHidden'))))));
            reqdOptions = concat(filter(productOptionComponents, (optionComponent) => !get(optionComponent, 'ProductOptionGroup.IsHidden') && optionComponent.ComponentProduct.IsActive && optionComponent.Required && optionComponent.ParentProductId === first(reqdOptionsNeeded).ParentProductId), reqdOptions);
            return reqdOptions;
        }
        return requiredUncheckedOptions;
    }
    /**@ignore */
    isProductOptionSelected(productOptionComponent: ProductOptionComponent, cartItems: Array<CartItem>) {
        return (find(cartItems, item => get(item, 'LineType') === 'Option' && get(item, 'ProductOption.Id') === get(productOptionComponent, 'Id'))) ? true : false;
    }
}


/**
 * Product options are individual products that users can select from when configuring a bundle.
 * <h3>Usage</h3>
 *
 ```typescript
 import { ProductOptionComponentService } from '@congacommerce/ecommerce';
 
 constructor(private productOptionComponentService: ProductOptionComponentService) {}
 
 // or
 
 export class MyService extends AObjectService {
      private productOptionComponentService: ProductOptionComponentService = this.injector.get(ProductOptionComponentService);
  }
 ```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductOptionComponentService extends AObjectService {
    type = ProductOptionComponent;

    protected pliService = this.injector.get(PriceListItemService);
    protected productService: ProductService = this.injector.get(ProductService);
    protected cartItemService: CartItemService = this.injector.get(CartItemService);
    protected attributeService: ProductAttributeService = this.injector.get(ProductAttributeService);
    protected attributeGroupService: ProductAttributeGroupService = this.injector.get(ProductAttributeGroupService);
    protected orderLineItemService: OrderLineItemService = this.injector.get(OrderLineItemService);
    protected quoteLineItemService: QuoteLineItemService = this.injector.get(QuoteLineItemService);

    // globalFilter(): Observable<Array<AFilter>> {
    //     return of([
    //         new AFilter(this.type, [new ACondition(this.type, 'ParentProduct.IsActive', 'Equal', true), new ACondition(this.type, 'ComponentProduct.IsActive', 'Equal', true)])
    //     ]);
    // }

    // globalJoin(): Observable<Array<AJoin>> {
    //     const plService = this.injector.get(PriceListService);
    //     return plService.getPriceListId().pipe(map(plid => [new AJoin(this.pliService.type, 'ComponentProductId', 'ProductId', [new ACondition(this.pliService.type, 'PriceListId', 'Equal', plid)])]));
    // }
}


/**
 * <strong>This service is a work in progress.</strong>
 * Product option groups are a way of grouping the individual options for a product 
 * <h3>Usage</h3>
 *
 ```typescript
 import { ProductOptionGroupService, AObjectService } from '@congacommerce/ecommerce';

 constructor(private productOptionGroupService: ProductOptionGroupService) {}

 // or

 export class MyService extends AObjectService {
     private productOptionGroupService: ProductOptionGroupService = this.injector.get(ProductOptionGroupService);
  }
 ```
 */
@Injectable({
    providedIn: 'root'
})
export class ProductOptionGroupService extends AObjectService {
    type = ProductOptionGroup;

    /**
     * method gets a list of product option groups for a given product
     * ### Example:
```typescript
import { ProductOptionGroupService, ProductOptionGroup } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    optionGroupList: Array<ProductOptionGroup>;
    optionGroupList$: Observable<Array<ProductOptionGroup>>;

    constructor(private productOptionGroupService: ProductOptionGroupService){}

    getProductOptionGroupsForProduct(product: Product){
        this.productOptionGroupService.getProductOptionGroupsForProduct(product).subscribe(o => this.optionGroupList = o);
        // or
        this.optionGroupList$ = this.productOptionGroupService.getProductOptionGroupsForProduct(product);
    }
}
```
     * @param product the instance of the product with which to return option groups for
     * @returns an observable array of product option groups for a given product
     * To Do:
     */
    getProductOptionGroupsForProduct(product: Product): Observable<Array<ProductOptionGroup>> {
        // if (get(product, 'OptionGroups', []).length > 0)
        //     // return this.where(`ID IN (` + SObjectService.arrayToCsv(product.OptionGroups.records.map(res => res.Id)) + `)`);
        //     return this.where([new ACondition(this.type, 'Id', 'In', Object.keys(product.OptionGroups).map(key => product.OptionGroups[key].Id))]);
        // else
        return of([]);
    }
}
