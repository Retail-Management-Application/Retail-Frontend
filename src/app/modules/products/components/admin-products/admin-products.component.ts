import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, PagedResult } from '../../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMsg = '';
  successMsg = '';
  totalCount = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';

  // Confirm delete
  deleteTargetId: number | null = null;
  deleteTargetName = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.productService.getProducts({
      search: this.searchTerm || undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    }).subscribe({
      next: (result: PagedResult<Product>) => {
        this.products = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  createProduct(): void {
    this.router.navigate(['/products/admin/products/new']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/admin/products/edit', id]);
  }

  confirmDelete(product: Product): void {
    this.deleteTargetId = product.productId;
    this.deleteTargetName = product.name;
  }

  deleteProduct(): void {
    if (!this.deleteTargetId) return;
    this.productService.deleteProduct(this.deleteTargetId).subscribe({
      next: () => {
        this.successMsg = `"${this.deleteTargetName}" deleted successfully.`;
        this.deleteTargetId = null;
        this.deleteTargetName = '';
        this.loadProducts();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => {
        this.errorMsg = 'Failed to delete product.';
        this.deleteTargetId = null;
      }
    });
  }

  cancelDelete(): void {
    this.deleteTargetId = null;
    this.deleteTargetName = '';
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}