export interface Product {
  productId:    number;
  name:         string;
  description:  string;
  price:        number;
  categoryId:   number;       // ← added
  categoryName: string;
  brandId:      number;       // ← added
  brandName:    string;
  imageUrl:     string | null;
  isActive:     boolean;      // ← added
  createdAt:    string;       // ← added
  stock:        number;       // maps to QuantityInStock from backend
}

export interface CreateProductDto {
  name:         string;
  description:  string;
  price:        number;
  categoryId:   number;
  brandId:      number;
  imageUrl:     string | null;
  isActive:     boolean;
  initialStock: number;
  reorderLevel: number;
}

export interface ProductFilter {
  search?:     string;
  categoryId?: number;
  brandId?:    number;
  pageNumber:  number;
  pageSize:    number;
}

export interface PagedResult<T> {
  items:       T[];
  totalCount:  number;
  pageNumber:  number;
  pageSize:    number;
  totalPages:  number;
  hasPrevious: boolean;
  hasNext:     boolean;
}