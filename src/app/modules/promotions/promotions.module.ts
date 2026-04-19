import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { CouponComponent }  from './components/coupon/coupon.component';
import { LoyaltyComponent } from './components/loyalty/loyalty.component';

@NgModule({
  declarations: [
    CouponComponent,
    LoyaltyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PromotionsRoutingModule
  ],
  exports: [
    CouponComponent,
    LoyaltyComponent
  ]
})
export class PromotionsModule {}