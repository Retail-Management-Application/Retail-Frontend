export interface Product {
  productId:    number;
  name:         string;
  description:  string;
  price:        number;
  categoryName: string;
  brandName:    string;
  imageUrl:     string | null;
  stock:        number;
}

export interface CreateProductDto {
  name:         string;
  description:  string;
  price:        number;
  categoryId:   number;
  brandId:      number;
  imageUrl:     string | null;
  initialStock: number;
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

