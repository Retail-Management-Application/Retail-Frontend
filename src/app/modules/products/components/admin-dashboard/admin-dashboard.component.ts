import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  adminName = '';
  totalCategories = 0;
  totalBrands = 0;
  lowStockCount = 0;
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      this.adminName = user.fullName;
    }
    this.loadStats();
  }

  loadStats(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => (this.totalCategories = cats.length)
    });

    this.productService.getBrands().subscribe({
      next: (brands) => (this.totalBrands = brands.length)
    });

    this.productService.getLowStockItems().subscribe({
      next: (items) => {
        this.lowStockCount = items.length;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }
}