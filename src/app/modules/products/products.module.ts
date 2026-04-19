import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductsRoutingModule } from './products-routing.module';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminBrandsComponent } from './components/admin-brands/admin-brands.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { AdminInventoryComponent } from './components/admin-inventory/admin-inventory.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductFormComponent,
    AdminProductsComponent,
    AdminBrandsComponent,
    AdminCategoriesComponent,
    AdminInventoryComponent,
    AdminUsersComponent,
    UserDashboardComponent,
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule {}