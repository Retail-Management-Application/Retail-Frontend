import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, CategoryDto, BrandDto } from '../../services/product.service';
import { Product, PagedResult, ProductFilter } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: CategoryDto[] = [];
  brands: BrandDto[] = [];

  filter: Partial<ProductFilter> = {
    pageNumber: 1,
    pageSize: 12
  };

  totalCount = 0;
  totalPages = 0;
  isLoading = false;
  errorMsg = '';

  searchTerm = '';
  selectedCategory: number | undefined;
  selectedBrand: number | undefined;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategory = +params['categoryId'];
        this.filter.categoryId = this.selectedCategory;
      }
      this.loadFilters();
      this.loadProducts();
    });
  }

  loadFilters(): void {
    this.productService.getCategories().subscribe({ next: (c) => (this.categories = c) });
    this.productService.getBrands().subscribe({ next: (b) => (this.brands = b) });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.productService.getProducts({
      ...this.filter,
      search: this.searchTerm || undefined,
      categoryId: this.selectedCategory,
      brandId: this.selectedBrand
    }).subscribe({
      next: (result: PagedResult<Product>) => {
        this.products = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load products. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.filter.pageNumber = 1;
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.filter.pageNumber = 1;
    this.loadProducts();
  }

  onBrandChange(): void {
    this.filter.pageNumber = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = undefined;
    this.selectedBrand = undefined;
    this.filter = { pageNumber: 1, pageSize: 12 };
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.filter.pageNumber = page;
    this.loadProducts();
  }

  viewDetail(productId: number): void {
    this.router.navigate(['/products/detail', productId]);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}