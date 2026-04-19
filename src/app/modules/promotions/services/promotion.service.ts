import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../products/services/product.service';
import { CouponDto, LoyaltyDto } from 'src/app/core/models/Promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private baseUrl = `${environment.apiUrl}/api/promotion`;

  constructor(private http: HttpClient) {}

  // POST /api/promotions/validate-coupon
  validateCoupon(code: string): Observable<ApiResponse<CouponDto>> {
    return this.http.post<ApiResponse<CouponDto>>(
      `${this.baseUrl}/validate-coupon`,
      JSON.stringify(code),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/promotions/loyalty
  getLoyaltyPoints(): Observable<ApiResponse<LoyaltyDto>> {
    return this.http.get<ApiResponse<LoyaltyDto>>(
      `${this.baseUrl}/loyalty`
    );
  }

  // POST /api/promotions/loyalty/add  (admin only)
  addLoyaltyPoints(userId: number, points: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/loyalty/add?userId=${userId}&points=${points}`,
      {}
    );
  }
}