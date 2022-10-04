import { Component, Input, ChangeDetectionStrategy, OnChanges, ElementRef, OnDestroy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from '@angular/core';
import { ConstraintRule, ConstraintRuleAction, ConstraintActionsType, CartItem, ProductOptionComponent, ClientConstraintRuleService, PerformAction } from '@congacommerce/ecommerce';
import { Product, ProductService } from '@congacommerce/ecommerce';
import { map as _map, uniqBy, flatten, get, cloneDeep, isNil, set, forEach } from 'lodash';
import { Subscription, of } from 'rxjs';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ConstraintPopoverService } from './services/constraint-popover.service';
/**
 * The constraint rule popover component creates a popover on an element based on the constraint rule list and product passed to it.
 * @ignore
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/constraintPopover.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ConstraintPopoverModule } from '@congacommerce/elements';

@NgModule({
  imports: [ConstraintPopoverModule, ...]
})
export class AppModule {}
 ```
* @example
* <button
*             [popover]="popTemplate"
*             container="body"
*             [adaptivePosition]="false"
*             [outsideClick]="true"
*             containerClass="CRPopover"
*             triggers="mouseenter:mouseleave focus:blur"
* >
*             Add to Cart
* </button>
*
* <ng-template #popTemplate>
*             <apt-cr-popover
*               [ruleList]="constraintRuleList"
*               [product]="product"
*               [message]="popoverMessage"
*               [optionRules]="hasOptionRules"
*               [triggers]="popoverTriggers"
*               [outsideClick]="closeOnOutsideClick"
*               [containerClass]="popoverWrapperClass"
*             ></apt-cr-popover>
* </ng-template>
*/
@Component({
  selector: 'apt-cr-popover',
  templateUrl: './constraint-popover.component.html',
  styleUrls: ['./constraint-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CRPopoverComponent implements OnChanges, OnDestroy {
  /**
   * The product associated with the constraint rule.
   */
  @Input() product: Product;
  /**
   * The parent bundle product.
   */
  @Input() parentProduct: Product;
  /**
   * An added message to show on the popover.
   */
  @Input() message: string;
  /**
   * Array of cart items.
   */
  @Input() items: Array<CartItem>;
  /**
   * Array of product options.
   */
  @Input() options: Array<ProductOptionComponent>;
  /**
   * Flag to check if there are option rules.
   */
  @Input() optionRules: boolean = false;
  /**
   * Special string for ngx-bootstrap to configuring events that trigger show/hide of the popover.
   */
  @Input() triggers: string = 'mouseenter:mouseleave focus:blur';
  /**
   * Closes the popover if there is mouse click outside the popover.
   */
  @Input() outsideClick: boolean = true;
  /**
   * Class to be applied to the parent of the popover.
   */
  @Input() containerClass: string = 'CRPopover';
  /**
   * Array of contraint rules.
   */
  @Input() ruleList: Array<ConstraintRule>;
  /**
   * Reference to the popover directive in the template.
   * @ignore
   */
  @ViewChild('pop') pop: PopoverDirective;
  /**
   * Reference to the popover template in the view.
   * @ignore
   */
  @ViewChild('popTemplate') popTemplate: TemplateRef<any>;
  /**
   * Holds an instance of ngx-bootstrap popover.
   * @ignore
   */
  popover: any;
  /** @ignore */
  state: 'READ' | 'WRITE' | 'OTHERS' | 'LOADING' = 'LOADING';
  /** @ignore */
  productInclusionRules: Array<ConstraintRuleAction>;
  /** @ignore */
  productExclusionRules: Array<ConstraintRuleAction>;
  /** @ignore */
  rulesToShow: Array<ConstraintRule> = [];
  /** @ignore */
  otherRules: Array<ConstraintRuleAction> = new Array<ConstraintRuleAction>();
  /** @ignore */
  promptActionList: PromptActionItems = {};
  /**
   * The product identifier set in the configuration file.
   * @ignore
   */
  identifier: string = 'Id';
  /**
   * Instance of a subscription in this component.
   */
  private subscription: Subscription;

  constructor(private productService: ProductService,
    private elRef: ElementRef,
    private clientConstraintRuleService: ClientConstraintRuleService,
    private constraintPopoverService: ConstraintPopoverService,
    private cdr: ChangeDetectorRef) {
    this.productService.configurationService.get('productIdentifier');
    this.popover = this.popTemplate;
  }
  ngOnChanges() {
    const ruleList$ = !isNil(this.ruleList) ? of(this.ruleList) : of([]);
    this.subscription = ruleList$
      .subscribe(ruleList => {
        this.ruleList = cloneDeep(ruleList);
        if (this.ruleList) {
          forEach(this.ruleList, r => {
            if (get(r.ConstraintRuleActions.filter(action => get(action, 'ActionType') === ConstraintActionsType.INCLUSION || get(action, 'ActionType') === ConstraintActionsType.EXCLUSION), 'length') > 0) {
              this.rulesToShow.push(r);
            }
          });
          if (!this.optionRules) {
            flatten(this.ruleList.map(r => r.ConstraintRuleActions)).forEach(action => {
              if (!isNil(get(action, 'Message'))) {
                set(action, 'Message', get(action, 'Message', '').replace('{0}', ''));
                set(action, 'Message', get(action, 'Message', '').replace('{1}', ''));
              }
            });
            this.productInclusionRules = uniqBy(flatten(this.ruleList.map(r => r.ConstraintRuleActions))
              .filter(action => get(action, 'ActionType') === ConstraintActionsType.INCLUSION && get(action, 'ProductScope') === 'Product'), 'Id');

            this.otherRules = uniqBy(flatten(this.ruleList.map(r => r.ConstraintRuleActions))
              .filter(action => get(action, 'ProductScope') !== 'Product'), 'Id');

            this.productExclusionRules = uniqBy(flatten(this.ruleList.map(r => r.ConstraintRuleActions))
              .filter(action => get(action, 'ActionType') === ConstraintActionsType.EXCLUSION && get(action, 'ProductScope') === 'Product'), 'Id');
          } else {
            this.showRuleForOption(ruleList);
          }
        }
        this.cdr.markForCheck();
      });
  }

  /** @ignore */
  showRuleForOption(rules) {
    if (get(rules, 'length') > 0) {
      this.promptActionList = this.constraintPopoverService.renderRuleForOption(rules, this.parentProduct, this.product);
      this.state = 'WRITE';
    }
  }
  /** @ignore */
  selectPromptAction(product: Product, addOption: boolean) {
    this.clientConstraintRuleService.assignAction({
      prod: product,
      quantity: get(product, '_metadata.quantity'),
      type: addOption ? ConstraintActionsType.INCLUSION : ConstraintActionsType.EXCLUSION
    } as PerformAction);
    if (this.clientConstraintRuleService.validateCRActionForPrompt(this.promptActionList.Rule, product)) {
      this.popoverClose();
    }
  }
  /** @ignore */
  onShown() {
    const top = this.elRef.nativeElement.getBoundingClientRect().top;
    const right = this.elRef.nativeElement.getBoundingClientRect().right;
    const bottom = this.elRef.nativeElement.getBoundingClientRect().bottom;
    const left = this.elRef.nativeElement.getBoundingClientRect().left;
    const middleVert = (top + bottom) / 2;
    const middleHoriz = (left + right) / 2;
    let position = 'top';
    // If there is more space on the top.
    if (middleVert > window.innerHeight / 2) position = 'top';
    else position = 'bottom';
    // If there is not enough space on the right to show top or bottom.
    if (window.innerWidth - middleHoriz < 200) position = 'left';
    // If there is not enough space on the left to show top or bottom.
    else if (middleHoriz < 200) position = 'right';
    // If there is not enough space on top or bottom just show where there is most space.
    if (window.innerWidth - middleHoriz < 200 && middleHoriz < 200) {
      // If there is more space on the top.
      if (middleVert > window.innerHeight / 2) position = 'top';
      else position = 'bottom';
    }
    return position;
  }
  /** @ignore */
  getOptionValue(product: Product) {
    if (!get(product, '_metadata.quantity')) set(product, '_metadata.quantity', 1);
    return product || {
      _metadata: {
        quantity: 0
      }
    };
  }


  /** @ignore */
  openPopover(pop): void {
    const flag = this.constraintPopoverService.handlePopover(this.ruleList, this.parentProduct, this.product, this.promptActionList);
    if (!flag) {
      this.popover = pop;
      return this.popover.show();
    } else {
      return this.popoverClose();
    }
  }

  /** @ignore */
  popoverClose() {
    if (this.pop) this.pop.hide();
  }

  /** @ignore */
  isItemSelected(productId: string): boolean {
    return this.clientConstraintRuleService.isProductSelected(productId);
  }


  ngOnDestroy() {
    if (get(this, 'subscription.unsubscribe'))
      this.subscription.unsubscribe();
  }

}
/**@ignore */
interface PromptActionItems {
  ActionItem?: Array<ActionItem>;
  Messages?: Array<string>;
  Rule?: Array<ConstraintRule>;
}
/**@ignore */
interface ActionItem {
  Product?: Product;
  ActionType?: 'Inclusion' | 'Exclusion';
}