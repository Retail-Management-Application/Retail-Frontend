import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, PagedResult } from '../../../../core/models/product.model';
import { CategoryDto, BrandDto } from '../../services/product.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
  userName = '';
  products: Product[] = [];
  categories: CategoryDto[] = [];
  brands: BrandDto[] = [];
  featuredProducts: Product[] = [];

  isLoading = false;
  errorMsg = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      this.userName = user.fullName;
    }
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.productService.getProducts({ pageNumber: 1, pageSize: 6 }).subscribe({
      next: (result) => {
        this.featuredProducts = result.items;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load products.';
        this.isLoading = false;
      }
    });

    this.productService.getCategories().subscribe({
      next: (cats) => (this.categories = cats)
    });

    this.productService.getBrands().subscribe({
      next: (brands) => (this.brands = brands)
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { categoryId } });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products/detail', productId]);
  }
}