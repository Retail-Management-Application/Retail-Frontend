import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';



const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },

  // Module 1 — Auth (Member A)
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Module 2 — Products (Member A)
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/products/products.module').then(m => m.ProductsModule)
  },

  // Module 3 — Cart & Orders (Member B)
  {
    path: 'cart',
    // canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/cart/cart.module').then(m => m.CartModule)
  },

  // Module 4 — Promotions (Member B)
  {
    path: 'promotions',
    // canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/promotions/promotions.module').then(m => m.PromotionsModule)
  },

  { path: '**', redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

