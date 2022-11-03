/**
 * Conga Digital Commerce
 *
 * Dedicated routing module for the comparison module.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompareLayoutComponent } from './layout/compare-layout.component';

const routes: Routes = [
  {
    path: '',
    component: CompareLayoutComponent
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompareRoutingModule {}
