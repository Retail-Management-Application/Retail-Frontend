import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, BrandDto, CreateBrandDto } from '../../services/product.service';

@Component({
  selector: 'app-admin-brands',
  templateUrl: './admin-brands.component.html'
})
export class AdminBrandsComponent implements OnInit {
  brands: BrandDto[] = [];
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
    this.loadBrands();
  }

  buildForm(): void {
    this.form = this.fb.group({
      brandName:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  loadBrands(): void {
    this.isLoading = true;
    this.productService.getBrands().subscribe({
      next: (b) => { this.brands = b; this.isLoading = false; },
      error: () => { this.errorMsg = 'Failed to load brands.'; this.isLoading = false; }
    });
  }

  submitForm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const dto: CreateBrandDto = this.form.value;

    if (this.isEditMode && this.editId) {
      this.productService.updateBrand(this.editId, dto).subscribe({
        next: () => { this.successMsg = 'Brand updated!'; this.reset(); this.loadBrands(); },
        error: () => { this.errorMsg = 'Failed to update brand.'; this.isSaving = false; }
      });
    } else {
      this.productService.createBrand(dto).subscribe({
        next: () => { this.successMsg = 'Brand created!'; this.reset(); this.loadBrands(); },
        error: () => { this.errorMsg = 'Failed to create brand.'; this.isSaving = false; }
      });
    }
  }

  editBrand(brand: BrandDto): void {
    this.isEditMode = true;
    this.editId = brand.brandId;
    this.form.patchValue({ brandName: brand.brandName, description: brand.description });
    this.successMsg = '';
    this.errorMsg = '';
  }

  confirmDelete(brand: BrandDto): void {
    this.deleteTargetId = brand.brandId;
    this.deleteTargetName = brand.brandName;
  }

  deleteBrand(): void {
    if (!this.deleteTargetId) return;
    this.productService.deleteBrand(this.deleteTargetId).subscribe({
      next: () => {
        this.successMsg = `"${this.deleteTargetName}" deleted.`;
        this.deleteTargetId = null;
        this.loadBrands();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => { this.errorMsg = 'Cannot delete — brand may have products linked.'; this.deleteTargetId = null; }
    });
  }

  cancelDelete(): void { this.deleteTargetId = null; this.deleteTargetName = ''; }

  reset(): void {
    this.form.reset({ brandName: '', description: '' });
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