/**
 * Conga Digital Commerce
 *
 * Dedicated routing module for the product details module.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductListComponent } from './list/product-list.component';

const routes: Routes = [
    {
        path: '',
        component: ProductListComponent
    },
    {
        path: ':id',
        component: ProductDetailComponent
    },
    {
        path: 'category/:categoryId',
        component: ProductListComponent
    },
    {
        path: ':id/:cartItem',
        component: ProductDetailComponent,
    }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
