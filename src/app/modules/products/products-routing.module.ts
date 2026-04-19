import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../core/guards/admin.guard';
import { AuthGuard } from '../../core/guards/auth.guard';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminBrandsComponent } from './components/admin-brands/admin-brands.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { AdminInventoryComponent } from './components/admin-inventory/admin-inventory.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  // Public product browsing
  { path: '', component: ProductListComponent },
  { path: 'detail/:id', component: ProductDetailComponent },

  // User dashboard (logged in customers)
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    // canActivate: [AuthGuard]
  },

  // Admin dashboard & management (Admin role only)
  {
    path: 'admin',
    component: AdminDashboardComponent,
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/products/new',
    component: ProductFormComponent,
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/products/edit/:id',
    component: ProductFormComponent,
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/brands',
    component: AdminBrandsComponent,
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/categories',
    component: AdminCategoriesComponent,
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/inventory',
    component: AdminInventoryComponent,
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    // canActivate: [AuthGuard, AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}