import { Injectable } from '@angular/core';
import { ConstraintRule, ConstraintActionsType, ClientConstraintRuleService, ConstraintActionsIntent, Product } from '@congacommerce/ecommerce';
import { filter, map as _map, flatten, get, cloneDeep, includes, first, find, isNil, forEach, compact } from 'lodash';
import { ConstraintRuleMessageService } from '../../constraint-rule/services/constraint-rule-message.service';


/**
 * Service that is used by the constraint rule popover  component.
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class ConstraintPopoverService {

    constructor(private constraintRuleMessageService: ConstraintRuleMessageService,
        private clientConstraintRuleService: ClientConstraintRuleService) {

    }

    renderRuleForOption(rules: Array<ConstraintRule>, parentProduct: Product, product: Product): PromptActionItems {
        const ruleList = cloneDeep(rules);
        const promptActionList: PromptActionItems = {};
        const promptRules: Array<ConstraintRule> = filter(filter(ruleList, (r) => includes(_map(get(r, '_metadata.productList', []), 'Id'), product.Id) && first(r.ConstraintRuleActions).ActionIntent === 'Prompt'), (rule) => {
            const conditionRule = filter(rule.ConstraintRuleConditions, (condition) => {
                // checks for condition with product scope as Product/ product Family/ product Group and
                // then checks for condition with only matchInOptions/ only matchInPrimaryLines or both are selected.
                let isvalid = false;
                if (condition.MatchInPrimaryLines)
                    isvalid = ((condition.ProductScope === 'Product' && condition.ProductId === parentProduct.Id) ||
                        (condition.ProductScope === 'Product Family' && condition.Product.Family === parentProduct.Family) ||
                        (condition.ProductScope === 'Product Group' && filter(get(parentProduct, 'ProductGroups', []), groupMember => groupMember.ProductGroupId === condition.ProductGroupId).length > 0));
                else
                    isvalid = includes(_map(get(rule, '_metadata.productList', []), 'Id'), product.Id);
                return isvalid;
            }).length === rule.ConstraintRuleConditions.length;
            return conditionRule === true;
        });
        const actionRule = flatten(promptRules.map(r => r.ConstraintRuleActions))
            .filter(action => get(action, 'MatchInOptions') === true && get(action, 'ActionIntent') === ConstraintActionsIntent.PROMPT);
        if (!isNil(actionRule)) {
            const products = compact(flatten(_map(promptRules, '_metadata.actionProductList')));
            promptActionList.Rule = promptRules;
            promptActionList.Messages = [];
            forEach(actionRule, r => {
                promptActionList.Messages.push(
                    this.constraintRuleMessageService.beautifyMessage(get(r, 'Message', ''), flatten(_map(promptRules, '_metadata.productList')), flatten(_map(promptRules, '_metadata.actionProductList')), false));
            });
            promptActionList.ActionItem = [];
            forEach(products, p => {
                const rule = find(promptRules, (r) => includes(_map(r._metadata.actionProductList, 'Id'), p.Id));
                if (!isNil(rule)) {
                    promptActionList.ActionItem.push({
                        Product: p,
                        ActionType: first(rule.ConstraintRuleActions).ActionType === ConstraintActionsType.INCLUSION ? ConstraintActionsType.INCLUSION : ConstraintActionsType.EXCLUSION
                    });
                }
            });
        }
        return promptActionList;
    }

    handlePopover(ruleList: Array<ConstraintRule>,parentProduct: Product, product: Product, promptActionList:PromptActionItems ): boolean {
    let popoverClose = false;
          // open the popover if the rule condition is satisfied.
    if (get(ruleList, 'length') > 0 && this.clientConstraintRuleService.isProductSelected(product.Id)) {

        const promptRules = filter(ruleList, (r) => includes(_map(get(r, '_metadata.productList', []), 'Id'), product.Id) && first(r.ConstraintRuleActions).ActionIntent === 'Prompt');
        // if not prompt rule then close the popover.
        if (promptRules.length === 0) return popoverClose = true;
        const crActionList = [];
        filter(promptRules, rule => {
          const applyAction: boolean = filter(rule.ConstraintRuleConditions, (condition) =>
            // checks for condition with product scope as Product/ product Family/ product Group and
            // then checks for condition with only matchInOptions/ only matchInPrimaryLines or both are selected.
            this.clientConstraintRuleService.validateCRCondition(condition, condition.MatchInPrimaryLines ? parentProduct : product, this.clientConstraintRuleService.getCurrentSelection())
          ).length === rule.ConstraintRuleConditions.length;
          if (applyAction) crActionList.push(rule);
        });
        // if condition is satisfied applyAction flag is true.
        // creating temporary array which has list of rule condition got satisfied for single selected option.
        if (crActionList.length > 0) {
          // checks for the rule action is not satisfied close popover
          if (this.clientConstraintRuleService.validateCRActionForPrompt(promptActionList.Rule, product, true)) {
            return popoverClose = true;
          } else {
            // checks for the rule action is satisfied close popover
            return popoverClose = false;
          }
        } else {
            return popoverClose = true;
        }
      } else {
        return popoverClose = true;
      }
    }
}


interface PromptActionItems {
    ActionItem?: Array<ActionItem>;
    Messages?: Array<string>;
    Rule?: Array<ConstraintRule>;
}

interface ActionItem {
    Product?: Product;
    ActionType?: 'Inclusion' | 'Exclusion';
}