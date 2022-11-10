import { Injectable } from '@angular/core';
import { Observable, combineLatest, of, BehaviorSubject } from 'rxjs';
import { switchMap, map, catchError, take } from 'rxjs/operators';
import {
  filter,
  map as _map,
  concat,
  set as _set,
  cloneDeep,
  get,
  compact,
  sum,
  size,
  replace,
  first,
  split,
  flatten,
  uniq,
  includes,
  each,
  join,
  forEach,
  isNil
} from 'lodash';
import { ConstraintRuleService, CartService, ProductService, PriceListItemService, PerformAction, Product, AppliedRuleActionInfo, ClientConstraintRuleService } from '@congacommerce/ecommerce';
import { ConstraintRuleGroups, ConstraintRuleDetail, ConstraintRuleInfoDetail, ActionItem } from '../interfaces/constraint-rule.interface';
import { ExceptionService } from '../../../shared/services/exception.service';
import { ProductConfigurationService } from '../../product-configuration/services/product-configuration.service';

/**
 * Service that is used by the constraint rule sidebar and constraint rule alert components.
 * @ignore
 * TO DO: verify
 */
@Injectable({
  providedIn: 'root'
})
export class ConstraintRuleMessageService {
  /**
   * Groups of cart level constraint rules.
   */
  cartRuleGroups$: BehaviorSubject<ConstraintRuleGroups>;
  /**
   * Groups of product configuration level constraint rules.
   */
  configRuleGroups$: BehaviorSubject<ConstraintRuleGroups>;

  constructor(
    private constraintRuleService: ConstraintRuleService,
    private cartService: CartService,
    private productService: ProductService,
    private exceptionService: ExceptionService,
    private clientConstraintRuleService: ClientConstraintRuleService,
    private productConfigurationService: ProductConfigurationService
  ) { }
  /**
   * Refreshes the cart level constraint rules behavior subject.
   */
  refreshCartRules() {
    combineLatest([
      this.productConfigurationService.configurationChange, this.constraintRuleService.getPendingActionsForCart()
    ])
      .pipe(
        switchMap(([configState, rules]) => {
          if (rules) {
            return this.getConstraintRuleGroups(rules);
          }
          return of(null);
        })
      ).subscribe(res => {
        this.cartRuleGroups$.next(res)
      });
  }
  /**
   * Refreshes the product configuration level constraint rules behavior subject.
   */
  refreshConfigRules() {
    combineLatest([
      this.productConfigurationService.configurationChange, this.clientConstraintRuleService.ruleMessages$
    ])
      .pipe(
        switchMap(([configState, response]) => {
          if (response) {
            return this.getConstraintRuleGroups(response);
          }
          return of(null);
        })
      ).subscribe(res => this.configRuleGroups$.next(res));
  }
  /**
   * Returns an observable of the cart level rule groups.
   */
  getCartRuleGroups(): Observable<ConstraintRuleGroups> {
    if (!this.cartRuleGroups$) {
      this.cartRuleGroups$ = new BehaviorSubject<ConstraintRuleGroups>(null);
      this.refreshCartRules();
    }

    return this.cartRuleGroups$;
  }
  /**
   * Returns an observable of the product configuration level rule groups.
   */
  getConfigurationRuleGroups(): Observable<ConstraintRuleGroups> {
    if (!this.configRuleGroups$) {
      this.configRuleGroups$ = new BehaviorSubject<ConstraintRuleGroups>(null);
      this.refreshConfigRules();
    }

    return this.configRuleGroups$;
  }

  /**
   * @ignore
   * Generates constraint error message
   */
  generateRuleActionMessage(message: string, actionProducts: Array<Product>, triggeringProducts: Array<Product>): string {
    if (message.indexOf('{') !== -1) {
      const replacedActions = replace(message, '{1}', `<strong>${join(_map(actionProducts, product => product.Name))}</strong>`);
      return replace(replacedActions, '{0}', `<strong>${join(_map(triggeringProducts, product => product.Name))}</strong>`);
    }
    else if (message && triggeringProducts && actionProducts) {
      each(uniq(concat(actionProducts, triggeringProducts)), product => {
        message = replace(
          message,
          product.Name,
          `<strong>${product.Name}</strong>`
        );
      });
      return message;
    }
    return message;
  }

  /**
   * Adds a product to the cart based on the associated constraint rule.
   * @param ruleDetail Constraint rule detail object related to the action product to add to cart.
   * @param product Action product to add for the associated constraint rule.
   * @param quantity Quantity of the given product to add to the cart.
   * @fires cartService.addOptionToBundle()
   * @fires cartService.addProductToCart()
   */
  addProductToCartFromRule(ruleDetail: ConstraintRuleDetail, product: Product, quantity: number = 1): Observable<void> {
    if (product) {
      if (ruleDetail.isOption) {
        return this.cartService.getMyCart().pipe(
          take(1),
          switchMap(cart => {
            const cartItemId = get(
              first(
                filter(cart.LineItems, cartItem => get(cartItem, 'PrimaryLineNumber') === get(ruleDetail, 'targetBundleNumber'))
              ), 'Id'
            );
            if (cartItemId) {
              return this.cartService.addOptionToBundle(cartItemId, {
                ProductId: get(product, 'Id'),
                Quantity: quantity
              });
            }
            else
              return of(null);
          }),
          switchMap(res => {
            return of(this.exceptionService.showSuccess('SUCCESS.CART.ITEM_ADDED_TOASTR_MESSAGE', 'SUCCESS.CART.ITEM_ADDED_TOASTR_TITLE', { productName: get(product, 'Name') }));
          }),
          catchError(error => {
            return of(this.exceptionService.showError(error));
          })
        );
      }
      else {

        return this.cartService.addProductToCart(product, quantity)
          .pipe(
            switchMap(res => {
              return of(this.exceptionService.showSuccess('SUCCESS.CART.ITEM_ADDED_TOASTR_MESSAGE', 'SUCCESS.CART.ITEM_ADDED_TOASTR_TITLE', { productName: get(product, 'Name') }));
            }),
            catchError(error => {
              return of(this.exceptionService.showError(error));
            })
          );
      }
    }
    return of();
  }
  /**
   * Removes a product from the cart based on the given constraint rule detail object.
   * @param ruleDetail Constraint rule detail object pertaining to the product to remove from the cart.
   */
  deleteProductFromCart(ruleDetail: ConstraintRuleDetail): Observable<void> {
    if (ruleDetail.actionItems) {
      return this.cartService.getMyCart().pipe(
        switchMap(cart => {
          return of(
            filter(
              cart.LineItems,
              cartItem => includes(
                _map(ruleDetail.actionItems, item => get(item, 'product.Id')), (ruleDetail.isOption ? get(cartItem, 'OptionId') : cartItem.LineType === 'Product/Service' ? get(cartItem, 'ProductId') : null)
              )
                && get(cartItem, 'IsPrimaryLine')
            )
          );
        }),
        switchMap(cartItems => {
          return this.cartService.removeCartItems(cartItems);
        }),
        catchError(error => {
          return of(this.exceptionService.showError(error));
        })
      );
    }
    else of();
  }
  /**
   * Adds the given option product to the specified bundle product during configuration.
   * @param product Product to add to the configuration.
   * @param quantity Quantity of the given product to add to the configuration.
   * @param bundleProduct Parent product that will be to add the given option product to.
   */
  addProductToConfiguration(product: Product, quantity: number, targetBundleNumber: number): Observable<void> {

    this.clientConstraintRuleService.assignAction({
      prod: product,
      quantity: quantity,
      type: 'Inclusion'
    } as PerformAction);
    return of(null);
  }
  /**
   * Removes the given product from the current configuration that hasn't been added to the cart.
   * @param product Product to remove from the current configuration.
   */
  removeOptionFromConfiguration(product: Product, bundleProduct: Product): Observable<void> {

    this.clientConstraintRuleService.assignAction({
      prod: product,
      type: 'Exclusion'
    } as PerformAction);
    return of(null);
  }
  /**
  * Formats the standard message received from the api response to add links and bold highlighting.
  */
  beautifyMessage = (actionMessage: string, triggeringProducts: Array<Product>, suggestedProduct: Array<Product>, attachLink: boolean = true): string => {
    let message = cloneDeep(actionMessage);
    suggestedProduct = compact(suggestedProduct);
    triggeringProducts = compact(triggeringProducts);
    if (message && triggeringProducts && suggestedProduct) {
      message = replace(
        message,
        '{0}',
        join(_map(triggeringProducts, product => product.Name), ', ')
      );
      message = replace(
        message,
        '{1}',
        join(_map(suggestedProduct, product => product.Name), ', ')
      );
      if (attachLink) {
        each(suggestedProduct, product => {
          message = replace(
            message,
            product.Name,
            `<a href="/products/${product.Id}" target="_blank">${product.Name}</a>`
          );
        });
        each(triggeringProducts, product => {
          message = replace(
            message,
            product.Name,
            `<strong>${product.Name}</strong>`
          );
        });
      }
      return message;
    }
    else return message;
  }

  /**
   * Returns an array of ActionItem objects from the given array of products.
   */
  private getActionItems = (products: Array<Product>): Array<ActionItem> => {
    const actionItems = [];
    each(products, (product, index) => {
      actionItems[index] = {
        product: product,
        chargeType: get(PriceListItemService.getPriceListItemForProduct(product), 'ChargeType')
      };
    });
    return actionItems;
  }

  /**
   * Returns formatted groups of constraint rules to be presented in the UI.
   * @param actionInfo Array of AppliedRuleActionInfo objects used to create the appropriate constraint rule groups.
   */
  private getConstraintRuleGroups(actionInfo: Array<AppliedRuleActionInfo>): Observable<ConstraintRuleGroups> {
    const relatedProductIds = uniq(flatten(concat(_map(actionInfo, rule => split(get(rule, 'TriggeringProductIds'), ', ')), _map(actionInfo, rule => split(get(rule, 'ActionProductIds'), ', ')))));
    return combineLatest([
      of(actionInfo),
      // this.productService.query({
      //   conditions: [new ACondition(Product, 'Id', 'In', relatedProductIds)],
      //   children: [{ field: 'PriceLists' }]
      // TO DO:
      // })
      of(null) as unknown as Array<Product>
    ])
      .pipe(
        map(([rules, relatedProducts]) => {
          const success = filter(rules, rule => (rule.ConstraintRuleAction.ActionIntent === 'Auto Include' || rule.ConstraintRuleAction.ActionIntent === 'Disable Selection') && rule.Pending);
          const errors = filter(rules, rule => rule.MessageType === 'Error' && rule.Pending);
          const warnings = filter(rules, rule => rule.MessageType === 'Warning' && rule.Pending);
          const info = filter(rules, rule => rule.MessageType === 'Info' && rule.Pending);
          const totalRules = sum([size(errors), size(warnings), size(info)]);
          return {
            errors: _map(errors, error => {
              return {
                triggeringProducts: filter(relatedProducts, product => includes(get(error, 'TriggeringProductIds'), get(product, 'Id'))),
                actionItems: this.getActionItems(filter(relatedProducts, product => includes(get(error, 'ActionProductIds'), get(product, 'Id')))),
                actionType: get(error, 'ConstraintRuleAction.ActionType'),
                message: get(error, 'Message'),
                messageHtml: this.beautifyMessage(
                  get(error, 'Message'),
                  filter(relatedProducts, product => includes(get(error, 'TriggeringProductIds'), get(product, 'Id'))),
                  filter(relatedProducts, product => includes(get(error, 'ActionProductIds'), get(product, 'Id')))
                ),
                isOption: get(error, 'IsTargetOption'),
                targetBundleNumber: get(error, 'TargetBundleNumber')
              } as unknown as ConstraintRuleDetail;
            }),
            warnings: _map(warnings, warning => {
              return {
                triggeringProducts: filter(relatedProducts, product => includes(get(warning, 'TriggeringProductIds'), get(product, 'Id'))),
                actionItems: this.getActionItems(filter(relatedProducts, product => includes(get(warning, 'ActionProductIds'), get(product, 'Id')))),
                actionType: get(warning, 'ConstraintRuleAction.ActionType'),
                message: get(warning, 'Message'),
                messageHtml: this.beautifyMessage(
                  get(warning, 'Message'),
                  filter(relatedProducts, product => includes(get(warning, 'TriggeringProductIds'), get(product, 'Id'))),
                  filter(relatedProducts, product => includes(get(warning, 'ActionProductIds'), get(product, 'Id')))
                ),
                isOption: get(warning, 'IsTargetOption'),
                targetBundleNumber: get(warning, 'TargetBundleNumber')
              } as ConstraintRuleDetail;
            }),
            info: _map(info, datum => {
              return {
                actionType: get(datum, 'ConstraintRuleAction.ActionType'),
                message: get(datum, 'Message')
              } as ConstraintRuleInfoDetail;
            }),
            success: _map(success, datum => {
              return {
                message: this.generateRuleActionMessage(
                  get(datum, 'Message'),
                  filter(relatedProducts, product => includes(get(datum, 'ActionProductIds'), get(product, 'Id'))),
                  filter(relatedProducts, product => includes(get(datum, 'TriggeringProductIds'), get(product, 'Id')))
                )
              } as ConstraintRuleInfoDetail;
            }),
            totalRules: totalRules
          } as ConstraintRuleGroups;
        })
      );
  }
}
