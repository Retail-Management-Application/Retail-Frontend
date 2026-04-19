import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, CategoryDto, BrandDto } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categories: CategoryDto[] = [];
  brands: BrandDto[] = [];
  isLoading = false;
  isSaving = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:         ['', [Validators.required, Validators.maxLength(200)]],
      description:  ['', Validators.maxLength(1000)],
      price:        [null, [Validators.required, Validators.min(0.01)]],
      categoryId:   [null, Validators.required],
      brandId:      [null, Validators.required],
      imageUrl:     [''],
      isActive:     [true],
      initialStock: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [10, [Validators.required, Validators.min(0)]]
    });

    this.productService.getCategories().subscribe({ next: (c) => (this.categories = c) });
    this.productService.getBrands().subscribe({ next: (b) => (this.brands = b) });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = +idParam;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (p) => {
        this.form.patchValue({
          name: p.name,
          description: p.description,
          price: p.price,
          categoryId: p.categoryId,
          brandId: p.brandId,
          imageUrl: p.imageUrl,
          isActive: p.isActive,
          initialStock: p.stock,
          reorderLevel: 10
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load product.';
        this.isLoading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.errorMsg = '';
    this.successMsg = '';

    const dto = this.form.value;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, dto).subscribe({
        next: () => {
          this.successMsg = 'Product updated successfully!';
          this.isSaving = false;
          setTimeout(() => this.router.navigate(['/products/admin/products']), 1500);
        },
        error: () => {
          this.errorMsg = 'Failed to update product.';
          this.isSaving = false;
        }
      });
    } else {
      this.productService.createProduct(dto).subscribe({
        next: () => {
          this.successMsg = 'Product created successfully!';
          this.isSaving = false;
          setTimeout(() => this.router.navigate(['/products/admin/products']), 1500);
        },
        error: () => {
          this.errorMsg = 'Failed to create product.';
          this.isSaving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products/admin/products']);
  }

  field(name: string) { return this.form.get(name); }
  isInvalid(name: string) { return this.field(name)?.invalid && this.field(name)?.touched; }
}