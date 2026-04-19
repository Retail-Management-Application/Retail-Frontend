import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponComponent } from './components/coupon/coupon.component';
import { LoyaltyComponent } from './components/loyalty/loyalty.component';

const routes: Routes = [
  { path: 'coupon',  component: CouponComponent  },
  { path: 'loyalty', component: LoyaltyComponent },
  { path: '',        redirectTo: 'coupon', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionsRoutingModule { }
