import { Component } from '@angular/core';
import { PromotionService } from '../../services/promotion.service';
import { CouponDto } from 'src/app/core/models/Promotion.model';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent {

  couponCode   : string     = '';
  couponResult : CouponDto  | null = null;
  errorMessage : string     = '';
  isLoading    : boolean    = false;
  isApplied    : boolean    = false;

  constructor(private promotionService: PromotionService) {}

  validateCoupon(): void {
    if (!this.couponCode.trim()) {
      this.errorMessage = 'Please enter a coupon code.';
      return;
    }

    this.isLoading    = true;
    this.errorMessage = '';
    this.couponResult = null;
    this.isApplied    = false;

    this.promotionService.validateCoupon(this.couponCode.trim()).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.couponResult = res.data;
          this.isApplied    = true;
        } else {
          this.errorMessage = res.message || 'Invalid coupon.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Coupon is invalid or expired.';
        this.isLoading    = false;
      }
    });
  }

  clearCoupon(): void {
    this.couponCode   = '';
    this.couponResult = null;
    this.errorMessage = '';
    this.isApplied    = false;
  }
}