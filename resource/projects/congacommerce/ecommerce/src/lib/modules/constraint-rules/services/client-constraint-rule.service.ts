import { Injectable } from '@angular/core';
import { ProductOptionComponent, Product } from '../../catalog/classes/index';
import { ProductOptionService } from '../../catalog/services/product-option.service';
import { ConstraintRuleService } from './constraint-rule.service';
import { ConstraintRule, ConstraintRuleCondition, AppliedRuleActionInfo } from '../classes/index';
import { filter, set, get, forEach, uniqBy, includes, cloneDeep, isEmpty, first, map as _map, uniq, isNil, intersection, difference, flatMap, concat, some, compact } from 'lodash';
import { BehaviorSubject, Observable, of, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { PerformAction, ConstraintActionsMode, ConstraintActionsType, ConstraintActionsIntent, ActionToPerform } from '../interfaces/constraint-rule-interface';
import { CartItem } from '../../cart/classes/cart-item.model';

/**@ignore */
@Injectable({
  providedIn: 'root'
})
export class ClientConstraintRuleService {

  ruleMessages$: BehaviorSubject<Array<AppliedRuleActionInfo>> = new BehaviorSubject<Array<AppliedRuleActionInfo>>(null);

  performAction$: BehaviorSubject<PerformAction> = new BehaviorSubject<PerformAction>(null);

  currentSelections: Array<ProductOptionComponent> = [];

  appliedRuleActionInfoRec: Array<AppliedRuleActionInfo> = [];

  constructor(private productOptionService: ProductOptionService,
    private crService: ConstraintRuleService) { }

  /**
   * validates the Constraint rule condition based on the scope.
   * @param condition Consttraint rule condition.
   * @param product instance of product.
   * @param selectedComponents List of omponent already configured for the complex product.
   * @returns boolean value stating the conditionrule is satisfied or not.
   * @ignore
   */
  validateCRCondition(condition: ConstraintRuleCondition, product: Product, selectedComponents: Array<ProductOptionComponent>): boolean {
    /* Condition to be checked on scope product. It then checks for  matchInOptions or  matchInPrimaryLines.
     Also, checks if the condition is already part of selectedComponents if the condition is satisfied then return true.
     Similary, perform the check if the condition scope is product family or product group.*/

    // condition Scope as Product
    return (condition.ProductScope === 'Product' && ((get(condition, 'MatchInOptions') && !get(condition, 'MatchInPrimaryLines')
      && get(filter(selectedComponents, (r) => r.ComponentProduct.Id === condition.Product.Id), 'length') > 0)
      || (get(condition, 'MatchInPrimaryLines') && !get(condition, 'MatchInOptions') && get(product, 'Id') === get(condition, 'Product.Id'))
      || (get(condition, 'MatchInOptions') && get(condition, 'MatchInPrimaryLines') && get(filter(selectedComponents, (r) => r.ComponentProduct.Id === condition.Product.Id), 'length') > 0
        && product.Id === condition.Product.Id)))
      ||

      // condition Scope as ProductFamily
      (condition.ProductScope === 'Product Family' && ((get(condition, 'MatchInOptions') && !get(condition, 'MatchInPrimaryLines')
        && get(uniq(filter(selectedComponents, (r) => r.ComponentProduct.Family === condition.ProductFamily)), 'length') > 0)
        || (get(condition, 'MatchInPrimaryLines') && !get(condition, 'MatchInOptions')
          && get(difference([get(condition, 'ProductFamily')], [get(product, 'Family')]), 'length') === 0)
        || (get(condition, 'MatchInPrimaryLines') && get(condition, 'MatchInOptions')
          && get(uniq(filter(selectedComponents, (r) => r.ComponentProduct.Family === condition.ProductFamily)), 'length') > 0
          && get(difference([get(condition, 'ProductFamily')], [get(product, 'Family')]), 'length') === 0)))
      ||

      // condition Scope as ProductGroup
      (condition.ProductScope === 'Product Group' && ((get(condition, 'MatchInOptions') && !get(condition, 'MatchInPrimaryLines')
        && filter(filter(flatMap(selectedComponents.map(r => get(r.ComponentProduct, 'ProductGroups', [])).map(groupMember => groupMember)), (groupMember) => groupMember !== null), (r) => r.ProductGroup.Id === condition.ProductGroup.Id).length > 0)
        || (get(condition, 'MatchInPrimaryLines') && !get(condition, 'MatchInOptions')
          && filter(get(product, 'ProductGroups', []), groupMember => groupMember.ProductGroup.Id === condition.ProductGroup.Id).length > 0)
        || (get(condition, 'MatchInPrimaryLines') && get(condition, 'MatchInOptions')
          && filter(filter(flatMap(selectedComponents.map(r => r.ComponentProduct.ProductGroups).map(groupMember => groupMember)), (groupMember) => groupMember !== null), (r) => r.ProductGroup.Id === condition.ProductGroup.Id).length > 0
          && filter(get(product, 'ProductGroups', []), groupMember => groupMember.ProductGroup.Id === condition.ProductGroup.Id).length > 0)));
  }

  /**
   * To fetch the constraint rule for the given Bundle product.
   * @param bundleProduct instance of bundle product.
   * @param cartItem instance of cartItem.
   * @returns Observable of array of constraint rule.
   * @ignore
   */
  getConstraintRulesForProducts(bundleProduct: Product, cartItem: CartItem): Observable<Array<ConstraintRule>> {
    this.loadAlertMessages([]);
    this.appliedRuleActionInfoRec = [];
    if (!isNil(get(cartItem, 'AssetLineItem'))) return of([]);
    let _productList = [bundleProduct];
    if (bundleProduct.HasOptions) {
      const options = _map(this.productOptionService.getProductOptions(bundleProduct), c => get(c, 'ComponentProduct'));
      _productList = concat(bundleProduct, options);
    }
    const rules$ = this.crService.getConstraintRulesForProducts(uniqBy(_productList, 'Id'), true, true);

    return rules$
      .pipe(
        map(rules => {
          return filter(compact(uniqBy(rules, 'Id')), rule => {
            if (isEmpty(get(rule, 'ConstraintRuleActions')) || isNil(get(rule, 'ConstraintRuleActions')))
              return false;
            else {
              let valid = false;
              _productList.forEach(product => {
                const conditions = (isNil(get(rule, 'ConstraintRuleConditions'))) ? [] : get(rule, 'ConstraintRuleConditions', []);
                const actions = (isNil(get(rule, 'ConstraintRuleActions'))) ? [] : get(rule, 'ConstraintRuleActions', []);
                const productValid = conditions.filter(condition =>
                  (condition.ProductScope === 'Product' && product.Id === condition.ProductId)
                  || (condition.ProductScope === 'Product Family' && product.Family === condition.ProductFamily)
                  || (condition.ProductScope === 'Product Group' && filter(get(product, 'ProductGroups', []), groupMember => groupMember.ProductGroupId === condition.ProductGroupId).length > 0)
                ).length > 0;
                if (productValid) {
                  valid = true;
                  const ruleProducts = get(rule, '_metadata.productList', []);
                  ruleProducts.push(product);
                  rule.set('productList', ruleProducts);
                }
                const actionProductValid = actions.filter(action =>
                  (action.ProductScope === 'Product' && product.Id === action.ProductId)
                  || (action.ProductScope === 'Product Family' && product.Family === action.ProductFamily)
                  || (action.ProductScope === 'Product Group' && filter(get(product, 'ProductGroups', []), groupMember => groupMember.ProductGroupId === action.ProductGroupId).length > 0)
                ).length === actions.length;
                if (actionProductValid) {
                  valid = true;
                  const ruleProducts = get(rule, '_metadata.actionProductList', []);
                  ruleProducts.push(product);
                  rule.set('actionProductList', ruleProducts);
                }
              });
              return valid;
            }
          });
        }),
        map(rules => filter(rules, r => r.get('actionProductList')))
      );
  }

  /**
  * Method is invoked after processing the rules to validate them. And perform appropriate actions.
  * Auto includes the option when 'AutoInclude' is set and remove option when disable selection is set. Also throws success message.
  * shows error or warning messages for prompt/showMessage.
  * @param ruleList list of constraint rules
  * @param product  instance of Product.
  * @param arg  instance of component List.
  * @returns An Object of actions to be performed.
  * @ignore
  **/
  validateRules(ruleList: Array<ConstraintRule>, product: Product, arg: ComponentList): ActionToPerform {
    const actionToPerform: ActionToPerform = { addOption: [], removeOption: [], disableOrHideOption: [] };

    const loadRuleMessages: Array<ActionInfo> = [];
    forEach(ruleList, (rule: ConstraintRule) => {
      // applyAction return boolean value which states the condition is satisfied or not.
      const applyAction: boolean = rule.ConstraintRuleConditions.filter(condition =>
        // checks for condition is selected ad it satisfies the rule.
        this.validateCRCondition(condition, product, arg.selectedComponents)
      ).length === rule.ConstraintRuleConditions.length;
      // List of rule action with autoInclude as actionIntent.
      const autoInclusionRules = uniqBy(rule.ConstraintRuleActions
        .filter(r => get(r, 'ActionType') === ConstraintActionsType.INCLUSION && get(r, 'ActionIntent') === ConstraintActionsIntent.AUTO_INCLUDE), 'Id');
      // List of rule action other than autoInclude and disable selection.
      const genricRules = uniqBy(rule.ConstraintRuleActions
        .filter(r => get(r, 'ActionIntent') !== ConstraintActionsIntent.DISABLE_SELECTION && get(r, 'ActionIntent') !== ConstraintActionsIntent.AUTO_INCLUDE
          && get(r, 'ActionIntent') !== ConstraintActionsIntent.HIDE), 'Id');
      // List of rule action with disable selection as actionIntent.
      const disableSelectionRules = uniqBy(rule.ConstraintRuleActions
        .filter(r => get(r, 'ActionType') === ConstraintActionsType.EXCLUSION && get(r, 'ActionIntent') === ConstraintActionsIntent.DISABLE_SELECTION), 'Id');
      // List of rule action with hide selection as actionIntent.
      const hideExclusionRules = uniqBy(rule.ConstraintRuleActions
        .filter(r => get(r, 'ActionType') === ConstraintActionsType.EXCLUSION && get(r, 'ActionIntent') === ConstraintActionsIntent.HIDE), 'Id');

      let actionProdList = [];
      if (!rule.get('actionProductList')) {
        actionProdList = actionProdList.concat(rule.ConstraintRuleActions.filter(p => p.Product != null && p.Product.Id !== null).map(p => p.Product.Id));
      } else {
        actionProdList = rule.get('actionProductList');
      }
      // let comps = [];
      // forEach(actionProdList, actionProd => {
      //   comps = comps.concat(arg.allComponents.filter(r => r.ComponentProduct.Id === actionProd.Id));
      // });
      const comps = filter(arg.allComponents, op => actionProdList.filter(actionProd => op.ComponentProduct.Id === actionProd.Id).length > 0);

      // applyAction when flag is set to true.
      if (applyAction) {

        // disable selection / hide exclusion rule
        if (get(disableSelectionRules, 'length') > 0 || get(hideExclusionRules, 'length') > 0) {
          // condition option of DisabelExclusionRules is selected then disable the action option and remove the selection of that option. Also, display the error message
          if (!isNil(comps)) {
            forEach(comps, c => {
              if (get(disableSelectionRules, 'length') > 0 && !get(c, 'ComponentProduct.ProductOptionGroup.IsHidden')) {
                c.set('disabled', true);
                actionToPerform.removeOption.push(c.ComponentProduct);
                actionToPerform.disableOrHideOption.push(c);
              }
              if (get(hideExclusionRules, 'length') > 0 && intersection(comps, arg.selectedComponents).length === 0) {
                c.set('hidden', true);
                actionToPerform.disableOrHideOption.push(c);
                actionToPerform.removeOption.push(c.ComponentProduct);
              }
              c.set('selected', false);
            });

            if ((get(disableSelectionRules, 'length') > 0 && intersection(actionToPerform.removeOption.map(p => p.Id), comps.map(c => c.ComponentProduct.Id)).length > 0)
              || (get(hideExclusionRules, 'length') > 0 && intersection(comps, arg.selectedComponents).length > 0))
              loadRuleMessages.push({ rule: rule, pending: true });
          } else {
            // condition option of DisableExclusionRules is not seelcted then enable the option and remove the error message if displayed.
            forEach(comps, (comp) => {
              comp.set('disabled', false);
              actionToPerform.disableOrHideOption.push(comp);
              comp.set('ruleAction', null);
            });
            if (get(disableSelectionRules, 'length') > 0) loadRuleMessages.push({ rule: rule, pending: false });
          }
        }

        // auto include inclusion rule
        if (autoInclusionRules.length > 0) {
          if (!isNil(comps)) {
            forEach(comps, (comp) => {
              if (!this.isProductSelected(comp.ComponentProduct.Id)) {
                const group = get(comp, 'ProductOptionGroup');
                if (isEmpty(get(group, 'Options'))) set(group, 'Options', this.productOptionService.getProductOptionsForGroup(product, group));
                actionToPerform.addOption.push(comp.ComponentProduct);
              }
            });
            loadRuleMessages.push({ rule: rule, pending: true });
          }
        }

        // show or remove messages when actions is not satisfied for prompt and show message actionIntent.
        if (genricRules.length > 0) {
          if (get(actionProdList, 'length') > 0) {
            const errormsg = !this.validateCRActionForPrompt([rule], null);
            if (genricRules.find(r => r.ActionType === ConstraintActionsType.INCLUSION)) {
              if (errormsg) {
                loadRuleMessages.push({ rule: rule, pending: true });
              } else {
                loadRuleMessages.push({ rule: rule, pending: false });
              }
            } else if (genricRules.find(r => r.ActionType === ConstraintActionsType.EXCLUSION)) {
              if (errormsg) {
                loadRuleMessages.push({ rule: rule, pending: true });
              } else {
                loadRuleMessages.push({ rule: rule, pending: false });
              }
            }
          }
        }
      } else {
        let allowAction = true;
        if (rule.ConstraintRuleConditions.filter(r => r.MatchInPrimaryLines === true).length > 0) allowAction = this.checkMatchInPrimaryLine(rule, product);
        // when apply rule apply action flag is false
        // removes the alert messages if condition is unchecked.
        if (allowAction) {
          forEach(comps, (comp) => {
            if (disableSelectionRules.length > 0) { comp.set('disabled', false); actionToPerform.disableOrHideOption.push(comp); }
            if (hideExclusionRules.length > 0) { comp.set('hidden', false); actionToPerform.disableOrHideOption.push(comp); }
          });
          if (disableSelectionRules.length > 0 || autoInclusionRules.length > 0 || hideExclusionRules.length > 0) loadRuleMessages.push({ rule: rule, pending: false });

          if (genricRules.length > 0) {
            if (genricRules.find(r => r.ActionType === ConstraintActionsType.INCLUSION)) {
              loadRuleMessages.push({ rule: rule, pending: false });
            } else if (genricRules.find(r => r.ActionType === ConstraintActionsType.EXCLUSION)) {
              loadRuleMessages.push({ rule: rule, pending: false });
            }
          }
        }
      }
    }, this);

    this.appliedRuleActionInfoRec = this.loadAlertMessages(loadRuleMessages, product);
    return actionToPerform;
  }

  /** @ignore */
  setCurrentSelection(options, flag: boolean = false) {
    if (flag) this.currentSelections = [];
    this.currentSelections = options;
  }

  /** @ignore */
  getCurrentSelection() {
    return this.currentSelections;
  }

  /** @ignore */
  isProductSelected(Id: string): boolean {
    return filter(this.getCurrentSelection(), (item) => get(item, 'ComponentProduct.Id') === Id).length > 0;
  }

  /**
   * This method generates the Aplied Rule actionInfo record.
   * @param rule  instance of ConstraintRule.
   * @param rulePending boolean value
   * @param product instance of product.
   * @returns Applied ruleAction info record.
   * @ignore
   */

  generateRuleActionInfo(rule: ConstraintRule, rulePending: boolean, product: Product): AppliedRuleActionInfo {
    const appliedRule = new AppliedRuleActionInfo();
    appliedRule.Pending = rulePending;
    if (first(rule.ConstraintRuleActions).ActionIntent !== ConstraintActionsIntent.AUTO_INCLUDE && first(rule.ConstraintRuleActions).ActionIntent !== ConstraintActionsIntent.DISABLE_SELECTION) {
      appliedRule.MessageType = first(rule.ConstraintRuleActions).ActionDisposition === 'Error' || first(rule.ConstraintRuleActions).ActionDisposition === 'Warning' ? first(rule.ConstraintRuleActions).ActionDisposition : null;
    }
    const primaryProd = this.checkMatchInPrimaryLine(rule, product);
    appliedRule.ConstraintRuleAction = first(rule.ConstraintRuleActions);
    appliedRule.TriggeringProductIds = _map(rule.get('productList'), 'Id');
    if (primaryProd) appliedRule.TriggeringProductIds = appliedRule.TriggeringProductIds.concat(product.Id);
    appliedRule.ActionProductIds = _map(rule.get('actionProductList'), 'Id');
    appliedRule.Message = first(rule.ConstraintRuleActions).Message;
    appliedRule.IsTargetOption = true;
    return appliedRule;
  }

  /**
   * @ignore
   */
  checkMatchInPrimaryLine(rule: ConstraintRule, product: Product): boolean {
    return filter(rule.ConstraintRuleConditions, (r) => r.MatchInPrimaryLines && (r.ProductId === product.Id || r.ProductFamily === product.Family || filter(get(product, 'ProductGroups', []), groupMember => groupMember.ProductGroupId === r.ProductGroupId).length > 0)).length > 0;
  }

  /**
   * Loads the Rule messages to display it as error or warning if condition is not satisfied.
   * @param ruleMsgs instance of Array of ActioInfo
   * @param product  instanc eof Bundle Product
   * @returns aaray of applied rule action Info record.
   * @ignore
   */
  loadAlertMessages(ruleMsgs: Array<ActionInfo>, product?: Product): Array<AppliedRuleActionInfo> {
    const rules: Array<AppliedRuleActionInfo> = [];
    forEach(ruleMsgs, (item) => {
      rules.push(this.generateRuleActionInfo(item.rule, item.pending, product));
    });
    this.ruleMessages$.next(rules);
    return rules;
  }
  /**
   * @ignore
   */
  assignAction(action: PerformAction) {
    this.performAction$.next(action);
  }

  /** @ignore */
  validateCRActionForPrompt(rulelist: Array<ConstraintRule>, product: Product, flag: boolean = false, isPrompt: boolean = false): boolean {
    let rules = rulelist;
    if (isPrompt) {
      const promptRules = filter(rules, (r) => get(r, 'ActionIntent') === ConstraintActionsIntent.PROMPT);
      rules = filter(promptRules, (r) => includes(_map(r.get('actionProductList'), 'Id'), product.Id));
      if (flag) rules = filter(promptRules, (r) => includes(_map(r.get('productList'), 'Id'), product.Id));
    }

    let isValid: boolean = false;
    forEach(rules, rule => {
      isValid = false;
      let count = 0;
      filter(rule.get('actionProductList'), (p) => {
        if (this.isProductSelected(p.Id)) count += 1;
      });
      if (first(rule.ConstraintRuleActions).IncludeMatchRule === ConstraintActionsMode.INCLUDEALL && count === get(rule.get('actionProductList'), 'length')) {
        isValid = true;
      } else if (first(rule.ConstraintRuleActions).IncludeMatchRule === ConstraintActionsMode.INCLUDEANY && count === 1) {
        isValid = true;
      } else if (first(rule.ConstraintRuleActions).IncludeMatchRule === ConstraintActionsMode.INCLUDEMINMAX && first(rule.ConstraintRuleActions).IncludeMinProducts >= first(rule.ConstraintRuleActions).IncludeMaxProducts) {
        if (count >= first(rule.ConstraintRuleActions).IncludeMinProducts && count === first(rule.ConstraintRuleActions).IncludeMaxProducts) isValid = true;
      } else if (first(rule.ConstraintRuleActions).IncludeMatchRule === ConstraintActionsMode.EXCLUDEALL && count === 0) {
        isValid = true;
      } else if (first(rule.ConstraintRuleActions).IncludeMatchRule === ConstraintActionsMode.EXCLUDEAFTERONE && count < get(rule.get('actionProductList'), 'length')) {
        isValid = true;
      } else if (first(rule.ConstraintRuleActions).IncludeMatchRule === ConstraintActionsMode.EXCLUDEAFTERMAX && count <= first(rule.ConstraintRuleActions).IncludeMaxProducts) {
        isValid = true;
      } else if (first(rule.ConstraintRuleActions).ActionType === ConstraintActionsType.INCLUSION && count === get(rule.get('actionProductList'), 'length') && first(rule.ConstraintRuleActions).IncludeMatchRule !== ConstraintActionsMode.INCLUDEANY && first(rule.ConstraintRuleActions).IncludeMatchRule !== ConstraintActionsMode.INCLUDEMINMAX) {
        isValid = true;
      } else if (first(rule.ConstraintRuleActions).ActionType === ConstraintActionsType.EXCLUSION && count === 0) {
        isValid = true;
      }
    });
    return isValid;
  }
}

/**@ignore */
interface ComponentList {
  allComponents: Array<ProductOptionComponent>;
  selectedComponents: Array<ProductOptionComponent>;
}
/**@ignore */
interface ActionInfo {
  rule: ConstraintRule;
  pending: boolean;
}