import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConstraintRuleMessageService } from '../services/constraint-rule-message.service';
import { ClientConstraintRuleService } from '@congacommerce/ecommerce';
import { Observable, Subscription } from 'rxjs';
import { ConstraintRuleGroups, ConstraintRuleDetail } from '../interfaces/constraint-rule.interface';
import { Product } from '@congacommerce/ecommerce';
import { take } from 'rxjs/operators';
import { ProductConfigurationService } from '../../product-configuration/services/product-configuration.service';
import { get } from 'lodash';
/**
 * 
 * <strong>This component is a work in progress.</strong>
 * 
 * Constraint rule sidebar is used to show a list of all the constraint rule messages that have been applied to the current cart.
 * <h3>Preview</h3>
 * <h4><strong>Constraint rule validation panel with error and warning message</strong></h4>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/constraintRuleValidationPanel.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ConstraintRuleModule } from '@congacommerce/elements';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [ConstraintRuleModule, ModalModule, ...]
})
export class AppModule {}
 ```
* @example
 ```typescript
* import { ConstraintRuleSidebarComponent } from '@congacommerce/elements';
* import { BsModalService } from 'ngx-bootstrap/modal';
*
* constructor(private bsModalService: BsModalService) {}
*
* showSidebar() {
*       this.bsModalService.show(ConstraintRuleSidebarComponent, {
*              backdrop: false,
*              class: 'constraintRuleSidebar'
*       });
* }
 ```
*/
@Component({
  selector: 'apt-constraint-rule-sidebar',
  templateUrl: './constraint-rule-sidebar.component.html',
  styleUrls: ['./constraint-rule-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConstraintRuleSidebarComponent implements OnInit, OnDestroy {
  /** @ignore */
  loading = {};
  /** @ignore */
  quantityControlValues: object = {};
  /** @ignore */
  ruleDetailGroups$: Observable<ConstraintRuleGroups>;
  /**
   * Flag used to specify if this component is showing product level constraint rules.
   * If false this component will show cart level configuration rules.
   */
  showProductConfig: boolean = false;
  /** @ignore */
  sub: Subscription;

  constructor(
    public bsModalRef: BsModalRef,
    private constraintRuleMessageService: ConstraintRuleMessageService,
    private clientConstraintRuleService: ClientConstraintRuleService,
    private productConfigurationService: ProductConfigurationService
  ) { }
  /** @ignore */
  ngOnInit() {
    this.ruleDetailGroups$ = this.showProductConfig ? this.constraintRuleMessageService.getConfigurationRuleGroups() : this.constraintRuleMessageService.getCartRuleGroups();
    this.sub = this.ruleDetailGroups$.subscribe(groups => {
      if (get(groups, 'totalRules') === 0)
        this.bsModalRef.hide();
    });
  }
  /** @ignore */
  handleAddToCart(ruleDetail: ConstraintRuleDetail, product: Product, quantity: number = 1, loadingKey: string) {
    this.loading[loadingKey] = true;
    this.constraintRuleMessageService.addProductToCartFromRule(ruleDetail, product, quantity)
    .pipe(take(1)).subscribe(() => {
      this.loading[loadingKey] = false;
    });
  }
  /** @ignore */
  handleAddToConfiguration(product: Product, quantity: number = 1, loadingKey: string, targetBundleNumber: number) {
    this.loading[loadingKey] = true;
    this.constraintRuleMessageService.addProductToConfiguration(product, quantity, targetBundleNumber)
    .pipe(take(1)).subscribe(() => {
      this.loading[loadingKey] = false;
    });
  }
  /** @ignore */
  handleDeleteFromCart(ruleDetail: ConstraintRuleDetail, loadingKey: string) {
    this.loading[loadingKey] = true;
    this.constraintRuleMessageService.deleteProductFromCart(ruleDetail)
    .pipe(take(1)).subscribe(() => {
      this.loading[loadingKey] = false;
    });
  }
  /** @ignore */
  handleRemoveFromBundle(product: Product, bundleProduct: Product, loadingKey: string) {
    this.loading[loadingKey] = true;
    this.constraintRuleMessageService.removeOptionFromConfiguration(product, bundleProduct)
    .pipe(take(1)).subscribe(() => {
      this.loading[loadingKey] = false;
    });
  }

   /**
   * Method responsible to disable/enable the products in the sidebar to add/remove 
   * based on the rule configured and product selection.
   * @param product instance of Product object.
   * @param action optional parameter accepts 'add' or 'remove' to perform add /remove action.
   * @returns boolean value is returned.
   * TO Do:
   */
  isItemSelected(product: Product): boolean {
    return  this.clientConstraintRuleService.isProductSelected(product.Id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}


