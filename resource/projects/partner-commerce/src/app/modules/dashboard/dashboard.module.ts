import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthProviderModule, ApttusModule } from '@congacommerce/core';
import { TableModule, BreadcrumbModule, AlertModule } from '@congacommerce/elements';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ComponentModule } from '../../components/component.module';
import { DashboardViewComponent } from './view/dashboard-view.component';
@NgModule({
  declarations: [DashboardViewComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AuthProviderModule,
    TableModule,
    ApttusModule,
    BreadcrumbModule,
    ComponentModule,
    AlertModule
  ]
})
export class DashboardModule { }
