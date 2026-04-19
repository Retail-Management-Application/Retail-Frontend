import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../services/promotion.service';
import { LoyaltyDto } from 'src/app/core/models/Promotion.model';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.css']
})
export class LoyaltyComponent implements OnInit {

  loyalty      : LoyaltyDto | null = null;
  errorMessage : string            = '';
  isLoading    : boolean           = true;

  constructor(private promotionService: PromotionService) {}

  ngOnInit(): void {
    this.loadLoyaltyPoints();
  }

  loadLoyaltyPoints(): void {
    this.isLoading = true;
    this.promotionService.getLoyaltyPoints().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.loyalty = res.data;
        } else {
          this.errorMessage = res.message || 'Could not load loyalty points.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load loyalty points.';
        this.isLoading    = false;
      }
    });
  }
}