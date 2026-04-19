import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartViewComponent }     from './components/cart-view/cart-view.component';
import { CheckoutComponent }     from './components/checkout/checkout.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

@NgModule({
  declarations: [
    CartViewComponent,
    CheckoutComponent,
    OrderHistoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CartRoutingModule
  ]
})
export class CartModule {}