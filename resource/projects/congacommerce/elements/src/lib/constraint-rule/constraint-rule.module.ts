import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConstraintRuleSidebarComponent } from './constraint-rule-sidebar/constraint-rule-sidebar.component';
import { ConstraintRuleAlertComponent } from './constraint-rule-alert/constraint-rule-alert.component';
import { CRIconComponent } from './constraint-icon/constraint-icon.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PriceModule } from '../price/price.module';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ButtonModule } from '../button/button.module';
import { RouterModule } from '@angular/router';
import { IconModule } from '../icon/icon.module';
import { LaddaModule } from 'angular2-ladda';

export * from '../constraint-rule/constraint-rule-sidebar/constraint-rule-sidebar.component';
export * from '../constraint-rule/constraint-rule-alert/constraint-rule-alert.component';
export * from '../constraint-rule/constraint-icon/constraint-icon.component';
/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IconModule,
    FormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TranslateModule.forChild(),
    PopoverModule.forRoot(),
    LaddaModule,
    PriceModule,
    ButtonModule
  ],
  declarations: [ConstraintRuleSidebarComponent, ConstraintRuleAlertComponent, CRIconComponent],
  exports: [ConstraintRuleSidebarComponent, ConstraintRuleAlertComponent, ModalModule, AlertModule, CRIconComponent],
  entryComponents: [ConstraintRuleSidebarComponent]
})
export class ConstraintRuleModule { }

