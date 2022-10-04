import { Injectable } from '@angular/core';
import { AObjectService } from '@congacommerce/core';
import { ConstraintRuleAction } from '../classes/index';

/**
 * @ignore
 * Constraint rules are a powerful feature when configuring products. They allow you to include, excludes, recommend, validate and replace products based on business logic.
 */
@Injectable({
    providedIn: 'root'
})
export class ConstraintRuleActionService extends AObjectService {
    type = ConstraintRuleAction;
}
