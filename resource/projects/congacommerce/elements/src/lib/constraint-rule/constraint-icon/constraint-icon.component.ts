import { Component, OnInit, HostBinding } from '@angular/core';
import { get, filter, isEmpty, concat, } from 'lodash';
import { ConstraintRuleService, AppliedRuleActionInfo } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConstraintRuleSidebarComponent } from '../constraint-rule-sidebar/constraint-rule-sidebar.component';
import { ProductConfigurationService } from '../../product-configuration/services/product-configuration.service';
/**
 * <strong>This component is a work in progress.</strong>
 * 
 * The icon to display when there is an alert related to constraint rules.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/constraintIcon.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ConstraintIconModule } from '@congacommerce/elements';

@NgModule({
  imports: [ConstraintIconModule, ...]
})
export class AppModule {}
 ```
* @example
 ```typescript
* <apt-cr-constraint-icon></apt-cr-constraint-icon>
 ```
*/
@Component({
  selector: 'apt-cr-constraint-icon',
  template: `
    <ng-container *ngIf="view$ | async as view">
      <ng-container *ngIf="view.pendingActions?.length > 0">
        <button class="btn btn-link nav-link" (click)="openSideMenu()">
          <i class="fas fa-exclamation-triangle fa-lg"></i>
        </button>
        <span class="badge badge-primary p-1">{{view.pendingActions?.length}}</span>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./constraint-icon.component.scss']
})
export class CRIconComponent implements OnInit {
  /** @ignore */
  @HostBinding('hidden') isHidden: boolean = true;

  /**
   * Used to hold information for rendering the view.
   * @ignore
   */
  view$: Observable<CrIconView>;
  /** Bootstrap modal reference. */
  modalRef: BsModalRef;

  constructor(private crService: ConstraintRuleService,
    private bsModalService: BsModalService,
    private prodConfigService: ProductConfigurationService
  ) {}

  ngOnInit() {
    // TO DO:verify
    this.view$ =  this.getPendingActionsForCart()
      .pipe(
        tap(pendingActions => {
          this.isHidden = get(pendingActions, 'length', 0) === 0;
        }),
        map(pendingActions => ({ pendingActions } as CrIconView))
      );
  }

  /**
   * @ignore
   */
  getPendingActionsForCart(): Observable<AppliedRuleActionInfo[]>{
    return this.crService.getPendingActionsForCart();
  }

  /**
   * @ignore
   */
  getPendingActionsForSecondaryCart(): Observable<AppliedRuleActionInfo[]>{
    return this.prodConfigService.configurationChange.pipe(
      map(configState => {
        const pendingCartActions: Array<AppliedRuleActionInfo> = filter(get(configState, 'ruleActions'), action => action.ConstraintRuleAction.MatchInPrimaryLines && action.Pending === true && !isEmpty(concat(get(action, 'ActionProductIds'))))
        return pendingCartActions;
      })
    )
  }

  /**
   * Opens the side menu when icon is clicked on.
   * @ignore
   */
  openSideMenu() {
    this.modalRef = this.bsModalService.show(ConstraintRuleSidebarComponent, {
      backdrop: false,
      class: 'constraintRuleSidebar'
    });
  }
}

/** List of Array of Applied Rule action info record to
 * display the count of error / warning
 * in the header icon. */
interface CrIconView {
  pendingActions: Array<AppliedRuleActionInfo>;
}

