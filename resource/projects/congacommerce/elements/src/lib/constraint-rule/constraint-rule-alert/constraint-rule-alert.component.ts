import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConstraintRuleSidebarComponent } from '../constraint-rule-sidebar/constraint-rule-sidebar.component';
import { Product } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs';
import { ConstraintRuleGroups, ConstraintRuleDetail } from '../interfaces/constraint-rule.interface';
import { ConstraintRuleMessageService } from '../services/constraint-rule-message.service';
import { take } from 'rxjs/operators';
/**
 * 
 * <strong>This component is a work in progress.</strong>
 * 
 * Constraint rule alert component is used to show a bootstrap style alert banner for the active constraint rules based on the user's cart.
 * <h3>Preview</h3>
 * <strong>Constraint rule error Alert</strong>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/constraintRuleErrorAlert.png" style="max-width: 100%">
 *  <strong>Constraint rule warning Alert</strong>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/constraintRuleWarningAlert.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ConstraintRuleModule } from '@congacommerce/elements';

@NgModule({
  imports: [ConstraintRuleModule, ...]
})
export class AppModule {}
 ```
* @example

* // Basic Usage.
```typescript
* <apt-constraint-rule-alert></apt-constraint-rule-alert>
```
*
* // To Show product Level Constraint Rules in a Component.
 ```typescript
* <apt-constraint-rule-alert [showProductConfig]="true">
 </apt-constraint-rule-alert>
 ```
 */
@Component({
  selector: 'apt-constraint-rule-alert',
  templateUrl: './constraint-rule-alert.component.html',
  styleUrls: ['./constraint-rule-alert.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConstraintRuleAlertComponent implements OnInit {
  /**
   * Flag used to specify if this component is showing product level constraint rules.
   * If false this component will show cart level configuration rules.
   */
  @Input() showProductConfig: boolean;
  /** @ignore */
  loading = {
    error: false,
    warning: false
  };
  /** @ignore */
  ruleGroups$: Observable<ConstraintRuleGroups>;

  constructor(
    private modalService: BsModalService,
    private constraintRuleMessageService: ConstraintRuleMessageService
  ) { }
  /** @ignore */
  ngOnInit() {
    this.ruleGroups$ = this.showProductConfig ? this.constraintRuleMessageService.getConfigurationRuleGroups() : this.constraintRuleMessageService.getCartRuleGroups();
  }
  /** @ignore */
  handleViewDetails() {
    this.modalService.show(ConstraintRuleSidebarComponent, {
      backdrop: false,
      class: 'constraintRuleSidebar',
      initialState: {
        showProductConfig: this.showProductConfig
      }
    });
  }
  /** @ignore */
  handleAddToCart(ruleDetail: ConstraintRuleDetail, product: Product, loadingKey: string) {
    this.loading[loadingKey] = true;
    this.constraintRuleMessageService.addProductToCartFromRule(ruleDetail, product, 1)
    .pipe(take(1)).subscribe(() => {
      this.loading[loadingKey] = false;
    });
  }
  /** @ignore */
  handleAddToConfiguration(product: Product, loadingKey: string, targetBundleNumber: number) {
    this.loading[loadingKey] = true;
    this.constraintRuleMessageService.addProductToConfiguration(product, 1, targetBundleNumber)
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

}
