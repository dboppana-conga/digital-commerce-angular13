import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [MsalGuard],
    data: {
      redirectUrl: ''
    }

  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule),
    data: { title: 'Product' }
  },
  {
    path: 'search/:query',
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule),
    data: { title: 'Search' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
