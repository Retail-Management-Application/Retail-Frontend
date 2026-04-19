import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, CategoryDto, CreateCategoryDto } from '../../services/product.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html'
})
export class AdminCategoriesComponent implements OnInit {
  categories: CategoryDto[] = [];
  form!: FormGroup;
  isLoading = false;
  isSaving = false;
  isEditMode = false;
  editId: number | null = null;
  successMsg = '';
  errorMsg = '';
  deleteTargetId: number | null = null;
  deleteTargetName = '';

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();
  }

  buildForm(): void {
    this.form = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description:  ['', Validators.maxLength(500)]
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.productService.getCategories().subscribe({
      next: (c) => { this.categories = c; this.isLoading = false; },
      error: () => { this.errorMsg = 'Failed to load categories.'; this.isLoading = false; }
    });
  }

  submitForm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const dto: CreateCategoryDto = this.form.value;

    if (this.isEditMode && this.editId) {
      this.productService.updateCategory(this.editId, dto).subscribe({
        next: () => { this.successMsg = 'Category updated!'; this.reset(); this.loadCategories(); },
        error: () => { this.errorMsg = 'Failed to update category.'; this.isSaving = false; }
      });
    } else {
      this.productService.createCategory(dto).subscribe({
        next: () => { this.successMsg = 'Category created!'; this.reset(); this.loadCategories(); },
        error: () => { this.errorMsg = 'Failed to create category.'; this.isSaving = false; }
      });
    }
  }

  editCategory(cat: CategoryDto): void {
    this.isEditMode = true;
    this.editId = cat.categoryId;
    this.form.patchValue({ categoryName: cat.categoryName, description: cat.description });
    this.successMsg = '';
    this.errorMsg = '';
  }

  confirmDelete(cat: CategoryDto): void {
    this.deleteTargetId = cat.categoryId;
    this.deleteTargetName = cat.categoryName;
  }

  deleteCategory(): void {
    if (!this.deleteTargetId) return;
    this.productService.deleteCategory(this.deleteTargetId).subscribe({
      next: () => {
        this.successMsg = `"${this.deleteTargetName}" deleted.`;
        this.deleteTargetId = null;
        this.loadCategories();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => { this.errorMsg = 'Cannot delete — category may have products.'; this.deleteTargetId = null; }
    });
  }

  cancelDelete(): void { this.deleteTargetId = null; this.deleteTargetName = ''; }

  reset(): void {
    this.form.reset({ categoryName: '', description: '' });
    this.isEditMode = false;
    this.editId = null;
    this.isSaving = false;
    setTimeout(() => { this.successMsg = ''; this.errorMsg = ''; }, 3000);
  }

  isInvalid(name: string) {
    const f = this.form.get(name);
    return f?.invalid && f?.touched;
  }
}