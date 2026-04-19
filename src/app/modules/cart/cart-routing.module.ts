import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartViewComponent }     from './components/cart-view/cart-view.component';
import { CheckoutComponent }     from './components/checkout/checkout.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const routes: Routes = [
  { path: '',         component: CartViewComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders',   component: OrderHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {}