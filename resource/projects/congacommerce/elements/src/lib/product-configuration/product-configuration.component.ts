import { Component, Input, ViewChildren, QueryList, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, combineLatest, of, Subscription, BehaviorSubject } from 'rxjs';
import { take, map, switchMap, filter, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { get, set, isNil, defaultTo, cloneDeep, forEach, find, lowerCase, each, isEmpty, filter as _filter, isEqual, pickBy, pick, flatten, compact, uniqBy, remove, identity, includes, map as _map } from 'lodash';
import { debounce } from 'lodash-decorators';

import { AObject } from '@congacommerce/core';
import { ProductOptionService, PerformAction, ProductOptionComponent, CartItem, CartItemService, Product, CartService, Cart, ProductOptionGroup, ProductAttributeValue, LineStatus, ActionToPerform, ConstraintRule, ProductAttributeGroupMember, ClientConstraintRuleService } from '@congacommerce/ecommerce';

import { CRPopoverComponent } from '../constraint-popover/constraint-popover.component';
import { ConfigurationState } from '../../shared/interfaces/configuration-state.interface';
import { ProductConfigurationService } from './services/product-configuration.service';

/**
 * 
 * Product configuration component is used to show the hierarchical view of the configurations for a given product or cart line item.
* 
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/productConfiguration.png" style="max-width: 100%">
 * 
 * This component is responsible for loading configuration of product
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductConfigurationModule } from '@congacommerce/elements';

@NgModule({
  imports: [ProductConfigurationModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-product-configuration
*               [product]="product.Id"
*               [relatedTo]="parent"
                [accordion]="true"
* ></apt-product-configuration>
```
*/
@Component({
    selector: 'apt-product-configuration',
    templateUrl: './product-configuration.component.html',
    styleUrls: ['./product-configuration.component.scss']
})
export class ProductConfigurationComponent implements OnChanges, OnDestroy {

    // The primitive id of the product to render the configuration for.
    @Input() product: string | Product;

    // The primitive id of the line item that should be used to render the configuration for.
    @Input() relatedTo: CartItem;

    // Accordion value for expand/collapse
    @Input() accordion: boolean = true;

    /** @ignore */
    @ViewChildren('childConfiguration') childConfigurationComponents: QueryList<ProductConfigurationComponent>;
    /** @ignore */
    @ViewChildren('popover') popover: CRPopoverComponent;
    /**
     * The view object used to hold information for rendering the view,
     * of type ConfigurationView.
     */
    view$: BehaviorSubject<ConfigurationView> = new BehaviorSubject<ConfigurationView>(null);
    /** Search query to filter configuration.*/
    searchText: string = null;
    /** Flag determines config change.*/
    onConfigChange: boolean = false;
    /** Flag determines changes in attribute.*/
    attributeChanged: boolean = false;
    /** Used to hold quantity of product.*/
    productQuantity: number = 1;
    /** Used for all configuration accordian collapse.*/
    collapseAll: boolean = true;
    /** @ignore */
    private subscriptions: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef, private productOptionService: ProductOptionService,
        private cartItemService: CartItemService, private cartService: CartService,
        private clientConstraintRuleService: ClientConstraintRuleService,
        private productConfigurationService: ProductConfigurationService) { }

    ngOnChanges() {
        this.ngOnDestroy();
        this.accordion = true;
        this.collapseAll = true;

        this.view$.next(null);
        const cartItems = !isNil(get(this, 'view$')) ? this.getItems(get(this, 'view$.value.product'), get(this, 'view$.value')) : undefined;
        this.subscriptions.push(this.productOptionService.getProductOptionTree(get(this, 'product.Id', this.product), this.relatedTo, 'none', defaultTo(cartItems, []))
            .pipe(
                switchMap(Product => combineLatest([
                    //this.clientConstraintRuleService.getConstraintRulesForProducts(Product, this.relatedTo),// TODO: Add this back when server side rules are integrated
                    of(null),
                    this.cartService.getMyCart()
                ])
                    .pipe(
                        map(([ruleList, cart]) => {
                            const view = {
                                product: Product,
                                cart: cart,
                                ruleList: ruleList
                            };
                            this.accordion = Product.get('expandAll');
                            return view;
                        })
                    )
                ),
                filter(view => !isNil(get(view, 'product')))
            ).subscribe(view => {
                //   this.clientConstraintRuleService.setCurrentSelection(this.getSelectedComponents(view), true); // TODO: Add this back when server side rules are integrated
                //   this.loadCRForOptions(view); // TODO: Add this back when server side rules are integrated
                this.attributeChanged = false;
                this.onConfigChange = false;
                this.emitChange(view);
                this.view$.next(view);
            }));
    }

    ngOnDestroy() {
        this.clientConstraintRuleService.loadAlertMessages([]);
        this.clientConstraintRuleService.performAction$.next(null);
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    /** @ignore */
    trackById(index, record: AObject): string {
        return get(record, 'Id');
    }
    /** @ignore */
    onAttributeChange(attrValue: ProductAttributeValue, view: ConfigurationView): void {
        this.emitChange(view);
    }
    /** @ignore */
    handleAttributeValueChange(attrValue: boolean): void {
        this.attributeChanged = attrValue;
    }

    /**
     * Method returns a flat array of components and their children of the product option
     * @param component it is an object type of ProductOptionComponent
     */
    getComponentArray(component: ProductOptionComponent): Array<ProductOptionComponent> {
        const items = [component];

        const handleComponent = (c: ProductOptionComponent) => {
            items.push(c);
            forEach(get(c, 'ComponentProduct.OptionGroups', []), handleGroup);
        };

        const handleGroup = (g: ProductOptionGroup) => {
            forEach(get(g, 'ChildOptionGroups', []), handleGroup);
            forEach(get(g, 'Options'), handleComponent);
        };
        handleComponent(component);
        return items;
    }
    /**
     * Method traverses the component and its children and assigns the cart items to their corresponding component
     *
     * @param component The input component
     * @param parentBundleNumber The starting components parent bundle number
     * @param cartItems Array of cart items to assign
     */
    assignCartItems(component: ProductOptionComponent, parentBundleNumber: number, cartItems: Array<CartItem>): void {
        const handleComponent = (c: ProductOptionComponent, parent: number) => {
            const item = find(cartItems, i => i.Option && i.Option.Id === c.ComponentProduct.Id && i.ParentBundleNumber === parent);
            set(c, 'ComponentProduct._metadata.item', item);
            forEach(get(c, 'ComponentProduct.OptionGroups', []), g => handleGroup(g, get(item, 'PrimaryLineNumber')));
        };

        const handleGroup = (g: ProductOptionGroup, parent: number) => {
            forEach(get(g, 'ChildOptionGroups', []), cg => handleGroup(cg, parent));
            forEach(get(g, 'Options'), o => handleComponent(o, parent));
        };
        handleComponent(component, parentBundleNumber);
    }

    /** @ignore */
    searchChange() {
        if (get(this.searchText, 'length') > 2) {
            // Hide attribute groups that don't have names matching the search text.
            each(this.view$.value.product.AttributeGroups, (group) => {
                let lowercaseSearchTerm = lowerCase(get(group, 'AttributeGroup.Name'));
                if (lowercaseSearchTerm) {
                    if (lowercaseSearchTerm.indexOf(lowerCase(this.searchText)) > -1) {
                        group.set('hide', false);
                    }
                    else {
                        group.set('hide', true);
                    }
                }
            });

            // Hide option groups that don't have options matching the search text.
            each(this.view$.value.product.OptionGroups, (group: ProductOptionGroup) => {
                group.set(
                    'hide',
                    isEmpty(_filter(group.Options, (option: ProductOptionComponent) => {
                        let lowercaseSearchTerm = lowerCase(get(option, 'ComponentProduct.Name'));
                        if (lowercaseSearchTerm) {
                            // Hide options that don't match the search term.
                            if (lowercaseSearchTerm.indexOf(lowerCase(this.searchText)) > -1) {
                                option.set('hide', false);
                                return true;
                            }
                            else {
                                option.set('hide', true);
                                return false;
                            }
                        }
                        return false;
                    }))
                );
            });
        }
        else {
            // Set all the hide flags back to false.
            each(this.view$.value.product.AttributeGroups, (group) => {
                group.set('hide', false);
                this.cdr.detectChanges();
            });
            this.view$.next(this.view$.value);
            each(this.view$.value.product.OptionGroups, (group: ProductOptionGroup) => {
                group.set('hide', false);
                each(group.Options, option => option.set('hide', false));
            });
        }
    }

    /** @ignore */
    getItems(product: Product, view: ConfigurationView): Array<CartItem> {
        if (!isNil(product) && product.get('item')) {
            const primaryItem: CartItem = plainToClass(CartItem, product.get('item'), { ignoreDecorators: true });
            set(primaryItem, 'Quantity', this.productConfigurationService.productQuantity);
            set(primaryItem, 'Product', product);
            // Add cart error for danger validation messages
            const constraintErrors = _filter(this.clientConstraintRuleService.appliedRuleActionInfoRec, rule => rule.MessageType === 'Error' && rule.Pending);
            if (!isEmpty(constraintErrors))
                view.product.setError('ERROR.PRODUCT.CONSTRAINT_RULES');
            else
                view.product.clearError();
            const items = [primaryItem];
            const handleComponent = (c: ProductOptionComponent) => {
                if (!isNil(get(c, 'ComponentProduct._metadata.item'))) {
                    const item = get(c, 'ComponentProduct._metadata.item');
                    // Mark the item amended if the cart item doesn't match the asset item
                    if (!isNil(get(item, 'AssetLineItem')) && get(item, 'LineStatus') !== LineStatus.Cancel) {
                        const attributeFields = _map(flatten(_map(get(c, 'ComponentProduct.AttributeGroups'), 'AttributeGroup.Attributes')), 'Field');
                        if (
                            get(item, 'Quantity') !== get(item, 'AssetLineItem.Quantity')
                            || !isEqual(
                                pickBy(pick(get(item, 'AssetLineItem.AttributeValue'), attributeFields), identity)
                                , pickBy(pick(get(item, 'AttributeValue'), attributeFields)))
                        ) {
                            set(item, 'LineStatus', LineStatus.Amend);
                        } else if (get(item, 'LineStatus') === LineStatus.Amend) {
                            set(item, 'LineStatus', LineStatus.Existing);
                        }
                    }
                    set(item, 'PricingStatus', 'Pending');
                    set(item, 'Option', get(c, 'ComponentProduct'));
                    items.push(item);
                }
                forEach(get(c, 'ComponentProduct.OptionGroups', []), g => handleGroup(g));
            };

            const handleGroup = (g: ProductOptionGroup) => {
                forEach(get(g, 'ChildOptionGroups', []), handleGroup);
                forEach(get(g, 'Options'), handleComponent);
            };

            forEach(get(product, 'OptionGroups'), handleGroup);
            const cartItems = compact(uniqBy(items, i => get(i, 'PrimaryLineNumber')));
            forEach(cartItems, (c: CartItem) => c.PricingStatus = 'Pending');
            return cartItems;
        } else
            return new Array<CartItem>();
    }
    /** @ignore */
    getParentComponent(component: ProductOptionComponent, product: Product): ProductOptionComponent {
        let parentComponent;
        const handleComponent = (c: ProductOptionComponent, p: ProductOptionComponent) => {
            if (c.Id === component.Id)
                parentComponent = p;
            else {
                forEach(get(c, 'ComponentProduct.OptionGroups', []), g => handleGroup(g, c));
            }
        };

        const handleGroup = (g: ProductOptionGroup, p?: ProductOptionComponent) => {
            forEach(get(g, 'ChildOptionGroups', []),g => handleGroup(g));
            forEach(get(g, 'Options'), c => handleComponent(c, p));
        };

        forEach(get(product, 'OptionGroups'),(g) => handleGroup(g));
        return parentComponent;
    }
    /** @ignore */
    removeComponent(component: ProductOptionComponent, view: ConfigurationView): Observable<ConfigurationView> {
        const selectedList = this.getSelectedComponents(view);
        const selectedComplist = _filter(selectedList, (comp) => comp.ComponentProduct.Id === get(component, 'ComponentProduct.Id') && get(comp, 'ProductOptionGroup.Id') === component.ProductOptionGroup.Id && get(comp, 'ComponentProduct._metadata.item.ParentBundleNumber') === get(component, 'ComponentProduct._metadata.item.ParentBundleNumber'));
        remove(selectedList, (item) => item.ComponentProduct.Id === component.ComponentProduct.Id);
        this.productConfigurationService.removeOption([component.ComponentProduct._metadata.item], component);
        forEach(selectedComplist, (c) => {
          if (!isNil(get(c, 'ComponentProduct._metadata.item.AssetLineItemId')))
            set(c, 'ComponentProduct._metadata.item.LineStatus', LineStatus.Cancel);
          else {
            set(c, 'ComponentProduct._metadata.item', null);
            set(c, 'ComponentProduct._metadata.selected', null);
          }
        });
        return of(view);
    }

    /** @ignore */
    addComponent(
        component: ProductOptionComponent,
        quantity: number = 1,
        group: ProductOptionGroup,
        view: ConfigurationView
      ): Observable<ConfigurationView> {
        let selectedList = this.getSelectedComponents(view);
        selectedList = selectedList.concat(component);
        set(component, 'ComponentProduct._metadata.loading', true);
        // this.clientConstraintRuleService.setCurrentSelection(selectedList);
        // Add the component
        const allItems = compact(this.getItems(view.product, view));
        const parentComponent = this.getParentComponent(component, get(view, 'product'));
        const parentBundleNumber = defaultTo(get(parentComponent, 'ComponentProduct._metadata.item.PrimaryLineNumber'), get(view, 'product._metadata.item.PrimaryLineNumber'));
        const lineNumber = defaultTo(get(this, 'relatedTo.LineNumber'), get(view, 'product._metadata.item.LineNumber'));
        let lineStatus = !isNil(get(view, 'product._metadata.item.AssetLineItemId')) && get(group, 'MaxOptions') === 1 ? LineStatus.Upgrade : LineStatus.New;
        if (!isNil(get(component, 'ComponentProduct._metadata.item.AssetLineItemId'))) {
            set(component, 'ComponentProduct._metadata.item.LineStatus', LineStatus.Existing);
          return of(view);
        } else {
            return this.cartItemService.getCartItemsForProduct(view.product
                , quantity
                , get(view, 'cart')
                , allItems
                , component
                , parentBundleNumber
                , lineNumber
                , lineStatus
            )
            .pipe(
              take(1),
              switchMap((items) => {
                  const item = items.find(
                    (r) =>
                      r.ProductOption.ComponentProduct.Id ===
                      component.ComponentProduct.Id
                  );
                  set(component, 'ComponentProduct._metadata.selected', item);
                  return this.productConfigurationService.addOption([item])
              }),
              map((items) => {
                this.assignCartItems(component, parentBundleNumber, items);
                set(component, 'ComponentProduct._metadata.loading', false);
                return view;
              })
            );
        }
    }
    /** 
     * This function allows you to add or remove options for a product.
     * @param component object of type ProductOptionComponent required for add /remove on toggling.
     * @param group Product option group of type ProductOptionGroup of the option toggled.
     * @param view An interface Object of type ConfigurationView which consist product, cart, rule list.
     * @param evt Optional Parameters for events of type any.
     */
    toggleOption(component: ProductOptionComponent, group: ProductOptionGroup, reference: string, view: ConfigurationView, evt?: any): void {
        if (evt) evt.preventDefault();
        if (!get(group, '_metadata.summary.disabled')) {
            const obsv$ = (this.isItemSelected(component)) ? this.removeComponent(component, view) : this.addComponent(component, 1, group, view);

            this.subscriptions.push(obsv$.pipe(take(1))
                .subscribe(v => {
                    this.onConfigChange = true;
                    this.emitChange(v);
                    this.processRules(v);
                }));
        }
    }

    /** @ignore */
    isItemSelected(component: ProductOptionComponent): boolean {
        return (!isNil(get(component, 'ComponentProduct._metadata.item')) && get(component, 'ComponentProduct._metadata.item.LineStatus') !== LineStatus.Cancel) || !isNil(get(component, 'ComponentProduct._metadata.selected'));
    }
    /**
     * This method will triggered on the change of option, quantity, or quantity and emit the behaviour subject of type ConfigurationState.
     * @param view instance of ConfigurationView
     * @ignore
     */
    @debounce(100)
    emitChange(view: ConfigurationView): void {
        this.cartService.getMyCart().pipe(take(1)).subscribe(cart => {
            const primaryItem = this.productConfigurationService.getPrimaryItem(
                view.product
            );
            const items = this.getItems(view.product, view);
            if (primaryItem) view.product.set('item', primaryItem);
            if (view.product) view.product.set('cartItems', items);
          this.productConfigurationService.onChangeConfiguration({
            product: view.product,
            itemList: items,
            configurationChanged: this.onConfigChange || this.attributeChanged,
          } as ConfigurationState);
        });
      }

    /**
     * This method will return list of option product
     */
    getAllComponents(view: ConfigurationView): Array<ProductOptionComponent> {
        return this.productOptionService.getProductOptions(view.product);
    }
    /** @ignore */
    getSelectedComponents(view: ConfigurationView): Array<ProductOptionComponent> {
        return _filter(this.productOptionService.getProductOptions(view.product), c => !isNil(get(c, 'ComponentProduct._metadata.item')) && get(c, 'ComponentProduct._metadata.item.LineStatus') !== LineStatus.Cancel);
    }

    /**
     * Method returns an instance of product option component for the product Id passed.
     * @param productId String value representing the product Id.
     */
    getProductOptionComponent(productId: string, view: ConfigurationView): ProductOptionComponent {
        return find(this.getAllComponents(view), (c) => c.ComponentProduct.Id === productId);
    }

    /**
      * constraint rule stuff
      */

    /**
     * The on load fetched constraint rule is executed on options to show the error or warning.
     * @param view instance of ConfigurationView
     * @ignore
     */
    loadCRForOptions(view: ConfigurationView): void {
        this.processRules(view);
        /**
         * This get's subscribed when option is selected/deselected from side-menu.
         */
        this.subscriptions.push(this.clientConstraintRuleService.performAction$.subscribe((res: PerformAction) => {
            if (!isNil(res)) {
                this.selectDeselectOption(get(res, 'prod'), get(res, 'type'), view, get(res, 'quantity'));
                this.processRules(view);
                this.emitChange(view);
            }
        }));
    }

    changeItemQuantity(cartItem: CartItem, component:ProductOptionComponent) {
        if (!cartItem.Quantity || cartItem.Quantity <= 0) {
          cartItem.Quantity = 1;
        } else {
            this.productConfigurationService.updateOption([cartItem], component);
        }
      }

    /**
     * Method invoked from side-menu it invokes adds/remove component method based on type Inclusion/Exclusion..
     * @param product product option to be added/removed from the selected product configuration.
     * @param type Type of constraint rule action.
     * @param action list of constraint rule actions for the given product.
     * @ignore
     */
    selectDeselectOption(product: Product, type: string, view: ConfigurationView, quantity?: number) {
        const components = this.getAllComponents(view).filter(r => r.ComponentProduct.Id === get(product, 'Id'));
        if (!isNil(components) && type === 'Inclusion') {
            forEach(components, (component) => {
                const group = get(component, 'ProductOptionGroup');
                if (isEmpty(get(group, 'Options'))) set(group, 'Options', this.productOptionService.getProductOptionsForGroup(view.product, group));
                this.subscriptions.push(this.addComponent(component, quantity, group, view).subscribe());
            });
        } else if (!isNil(components) && type === 'Exclusion') {
            forEach(components, (component) => {
                this.subscriptions.push(this.removeComponent(component, view).subscribe());
            });
        }
    }

    /**
     * Method process the rules by validating  the scope and condition of the rule.
     * If the condition is satisfied add or remove the options. Also, Shows the error or warning messages.
     * @param view  instance of ConfigurationView.
     * @ignore
     */
    private processRules(view: ConfigurationView): void {
        const optionRules = get(view, 'ruleList');
        const allComponents = this.getAllComponents(view);
        const selectedComponents = this.getSelectedComponents(view);
        const options: ActionToPerform = this.clientConstraintRuleService.validateRules(optionRules, view.product, { allComponents: allComponents, selectedComponents: selectedComponents });
        forEach(options.addOption, (opt) => {
            if (!includes(_map(selectedComponents, 'ComponentProduct.Id'), opt.Id))
                this.selectDeselectOption(opt, 'Inclusion', view, 1);
        });
        forEach(options.removeOption, (opt) => {
            if (includes(_map(selectedComponents, 'ComponentProduct.Id'), opt.Id))
                this.selectDeselectOption(opt, 'Exclusion', view);
        });
        forEach(options.disableOrHideOption, (opt) => {
            const comp = find(allComponents, c => c.Id === opt.Id);
            comp.set('disabled', opt.get('disabled'));
            comp.set('hidden', opt.get('hidden'));
        });
        this.emitChange(view);
    }

}

/** 
 * Holds the information of configuration view.
 */
interface ConfigurationView {
    /* The product contains product information. */
    product: Product;
    /* The cart contains information about the items in the cart. */
    cart: Cart;
    /* The ruleList contains the constraint rules for products. */
    ruleList: Array<ConstraintRule>;
}
