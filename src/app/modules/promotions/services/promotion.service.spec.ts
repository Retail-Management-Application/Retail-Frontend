import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PromotionService } from './promotion.service';
import { environment } from '../../../../environments/environment';
import { CouponDto, LoyaltyDto, EmailLog } from '../models/promotion.models';

describe('PromotionService', () => {
  let service: PromotionService;
  let httpMock: HttpTestingController;

  const promotionBase = `${environment.apiUrl}/api/promotions`;
  const notificationBase = `${environment.apiUrl}/api/notifications`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PromotionService],
    });
    service = TestBed.inject(PromotionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('validateCoupon() should POST to /validate-coupon', () => {
    const mockResponse: CouponDto = {
      code: 'SAVE20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 500,
      expiryDate: '2025-12-31',
      isValid: true,
      message: 'Coupon applied',
    };

    service
      .validateCoupon({ code: 'SAVE20', orderAmount: 1000 })
      .subscribe((res) => {
        expect(res.isValid).toBeTrue();
        expect(res.discountValue).toBe(20);
      });

    const req = httpMock.expectOne(`${promotionBase}/validate-coupon`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ code: 'SAVE20', orderAmount: 1000 });
    req.flush(mockResponse);
  });

  it('getLoyalty() should GET with userId param', () => {
    const mockLoyalty: LoyaltyDto = {
      userId: 'user-001',
      points: 1200,
      tier: 'Gold',
      pointsToNextTier: 300,
      totalEarned: 2000,
      totalRedeemed: 800,
    };

    service.getLoyalty('user-001').subscribe((res) => {
      expect(res.tier).toBe('Gold');
      expect(res.points).toBe(1200);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${promotionBase}/loyalty` &&
        r.params.get('userId') === 'user-001'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockLoyalty);
  });

  it('addLoyaltyPoints() should POST to /loyalty/add', () => {
    const payload = { userId: 'user-001', points: 100, reason: 'Purchase' };
    const mockLoyalty: LoyaltyDto = {
      userId: 'user-001',
      points: 1300,
      tier: 'Gold',
      pointsToNextTier: 200,
      totalEarned: 2100,
      totalRedeemed: 800,
    };

    service.addLoyaltyPoints(payload).subscribe((res) => {
      expect(res.points).toBe(1300);
    });

    const req = httpMock.expectOne(`${promotionBase}/loyalty/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockLoyalty);
  });

  it('getEmailLogs() should GET /notifications/logs', () => {
    const mockLogs: EmailLog[] = [
      {
        id: '1',
        recipientEmail: 'test@example.com',
        subject: 'Your order is confirmed',
        sentAt: new Date().toISOString(),
        status: 'sent',
        type: 'order',
      },
    ];

    service.getEmailLogs().subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].status).toBe('sent');
    });

    const req = httpMock.expectOne(`${notificationBase}/logs`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLogs);
  });
});