import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Product,
  CreateProductDto,
  ProductFilter,
  PagedResult
} from '../../../core/models/product.model';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface CategoryDto {
  categoryId: number;
  categoryName: string;
  description: string;
  productCount: number;
}

export interface CreateCategoryDto {
  categoryName: string;
  description: string;
}

export interface BrandDto {
  brandId: number;
  brandName: string;
  description: string;
  productCount: number;
}

export interface CreateBrandDto {
  brandName: string;
  description: string;
}

export interface InventoryDto {
  inventoryId: number;
  productId: number;
  productName: string;
  quantityInStock: number;
  reorderLevel: number;
  lastUpdated: string;
  isLowStock: boolean;
}

export interface UpdateInventoryDto {
  quantityInStock: number;
  reorderLevel: number;
}

export interface AdjustStockDto {
  adjustment: number;
  reason: string;
}

export interface UserDto {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: 0 | 1;          // ← number, not string
  createdAt: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ─── Products ─────────────────────────────────────────────────────────────

  getProducts(filter: Partial<ProductFilter> = {}): Observable<PagedResult<Product>> {
    let params = new HttpParams();
    if (filter.search)      params = params.set('search', filter.search);
    if (filter.categoryId)  params = params.set('categoryId', filter.categoryId.toString());
    if (filter.brandId)     params = params.set('brandId', filter.brandId.toString());
    params = params.set('pageNumber', (filter.pageNumber ?? 1).toString());
    params = params.set('pageSize', (filter.pageSize ?? 12).toString());

    return this.http
      .get<ApiResponse<PagedResult<Product>>>(`${this.baseUrl}/api/products`, { params })
      .pipe(map(r => r.data!));
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${this.baseUrl}/api/products/${id}`)
      .pipe(map(r => r.data!));
  }

  createProduct(dto: CreateProductDto): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(`${this.baseUrl}/api/products`, dto)
      .pipe(map(r => r.data!));
  }

  updateProduct(id: number, dto: CreateProductDto): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.baseUrl}/api/products/${id}`, dto)
      .pipe(map(r => r.data!));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/api/products/${id}`)
      .pipe(map(() => void 0));
  }

  // ─── Categories ───────────────────────────────────────────────────────────

  getCategories(): Observable<CategoryDto[]> {
    return this.http
      .get<ApiResponse<CategoryDto[]>>(`${this.baseUrl}/api/categories`)
      .pipe(map(r => r.data!));
  }

  getCategoryById(id: number): Observable<CategoryDto> {
    return this.http
      .get<ApiResponse<CategoryDto>>(`${this.baseUrl}/api/categories/${id}`)
      .pipe(map(r => r.data!));
  }

  createCategory(dto: CreateCategoryDto): Observable<CategoryDto> {
    return this.http
      .post<ApiResponse<CategoryDto>>(`${this.baseUrl}/api/categories`, dto)
      .pipe(map(r => r.data!));
  }

  updateCategory(id: number, dto: CreateCategoryDto): Observable<CategoryDto> {
    return this.http
      .put<ApiResponse<CategoryDto>>(`${this.baseUrl}/api/categories/${id}`, dto)
      .pipe(map(r => r.data!));
  }

  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/api/categories/${id}`)
      .pipe(map(() => void 0));
  }

  // ─── Brands ───────────────────────────────────────────────────────────────

  getBrands(): Observable<BrandDto[]> {
    return this.http
      .get<ApiResponse<BrandDto[]>>(`${this.baseUrl}/api/brands`)
      .pipe(map(r => r.data!));
  }

  getBrandById(id: number): Observable<BrandDto> {
    return this.http
      .get<ApiResponse<BrandDto>>(`${this.baseUrl}/api/brands/${id}`)
      .pipe(map(r => r.data!));
  }

  createBrand(dto: CreateBrandDto): Observable<BrandDto> {
    return this.http
      .post<ApiResponse<BrandDto>>(`${this.baseUrl}/api/brands`, dto)
      .pipe(map(r => r.data!));
  }

  updateBrand(id: number, dto: CreateBrandDto): Observable<BrandDto> {
    return this.http
      .put<ApiResponse<BrandDto>>(`${this.baseUrl}/api/brands/${id}`, dto)
      .pipe(map(r => r.data!));
  }

  deleteBrand(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/api/brands/${id}`)
      .pipe(map(() => void 0));
  }

  // ─── Inventory ────────────────────────────────────────────────────────────

  getInventoryByProduct(productId: number): Observable<InventoryDto> {
    return this.http
      .get<ApiResponse<InventoryDto>>(`${this.baseUrl}/api/inventory/${productId}`)
      .pipe(map(r => r.data!));
  }

  updateInventory(productId: number, dto: UpdateInventoryDto): Observable<InventoryDto> {
    return this.http
      .put<ApiResponse<InventoryDto>>(`${this.baseUrl}/api/inventory/${productId}`, dto)
      .pipe(map(r => r.data!));
  }

  adjustStock(productId: number, dto: AdjustStockDto): Observable<InventoryDto> {
    return this.http
      .patch<ApiResponse<InventoryDto>>(`${this.baseUrl}/api/inventory/${productId}/adjust`, dto)
      .pipe(map(r => r.data!));
  }

  getLowStockItems(): Observable<InventoryDto[]> {
    return this.http
      .get<ApiResponse<InventoryDto[]>>(`${this.baseUrl}/api/inventory/low-stock`)
      .pipe(map(r => r.data!));
  }

  // ─── Users (Admin) ────────────────────────────────────────────────────────

  // In product.service.ts
getUsers(): Observable<UserDto[]> {
  return this.http.get<UserDto[]>(`${this.baseUrl}/api/users`);  // no .pipe(map) needed
}
}