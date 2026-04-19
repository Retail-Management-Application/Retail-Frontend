export interface CouponDto {
  code:            string;
  discountPercent: number;
  expiryDate:      string;
}

export interface LoyaltyDto {
  points:      number;
  lastUpdated: string;
}

export interface CouponValidationResult {
  success: boolean;
  message: string;
  data:    CouponDto | null;
}

export interface LoyaltyResult {
  success: boolean;
  message: string;
  data:    LoyaltyDto | null;
}