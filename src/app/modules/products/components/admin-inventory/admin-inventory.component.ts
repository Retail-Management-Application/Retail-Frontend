import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, InventoryDto, UpdateInventoryDto, AdjustStockDto } from '../../services/product.service';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html'
})
export class AdminInventoryComponent implements OnInit {
  lowStockItems: InventoryDto[] = [];
  isLoading = false;
  successMsg = '';
  errorMsg = '';

  // Adjust stock modal state
  adjustTargetId: number | null = null;
  adjustTargetName = '';
  adjustForm!: FormGroup;
  isAdjusting = false;

  // Update inventory modal state
  updateTargetId: number | null = null;
  updateTargetName = '';
  updateForm!: FormGroup;
  isUpdating = false;

  // Search by productId
  searchProductId = '';
  searchedInventory: InventoryDto | null = null;
  isSearching = false;
  searchError = '';

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.adjustForm = this.fb.group({
      adjustment: [0, [Validators.required]],
      reason: ['', Validators.required]
    });
    this.updateForm = this.fb.group({
      quantityInStock: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [10, [Validators.required, Validators.min(0)]]
    });
    this.loadLowStock();
  }

  loadLowStock(): void {
    this.isLoading = true;
    this.productService.getLowStockItems().subscribe({
      next: (items) => { this.lowStockItems = items; this.isLoading = false; },
      error: () => { this.errorMsg = 'Failed to load inventory alerts.'; this.isLoading = false; }
    });
  }

  searchInventory(): void {
    const id = parseInt(this.searchProductId);
    if (!id) { this.searchError = 'Enter a valid Product ID.'; return; }
    this.isSearching = true;
    this.searchError = '';
    this.searchedInventory = null;
    this.productService.getInventoryByProduct(id).subscribe({
      next: (inv) => { this.searchedInventory = inv; this.isSearching = false; },
      error: () => { this.searchError = 'No inventory record found for that Product ID.'; this.isSearching = false; }
    });
  }

  openAdjust(inv: InventoryDto): void {
    this.adjustTargetId = inv.productId;
    this.adjustTargetName = inv.productName;
    this.adjustForm.reset({ adjustment: 0, reason: '' });
  }

  submitAdjust(): void {
    if (this.adjustForm.invalid || !this.adjustTargetId) { this.adjustForm.markAllAsTouched(); return; }
    this.isAdjusting = true;
    const dto: AdjustStockDto = this.adjustForm.value;
    this.productService.adjustStock(this.adjustTargetId, dto).subscribe({
      next: () => {
        this.successMsg = `Stock adjusted for "${this.adjustTargetName}".`;
        this.adjustTargetId = null;
        this.isAdjusting = false;
        this.loadLowStock();
        if (this.searchedInventory) this.searchInventory();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => { this.errorMsg = 'Adjust failed.'; this.isAdjusting = false; }
    });
  }

  cancelAdjust(): void { this.adjustTargetId = null; }

  openUpdate(inv: InventoryDto): void {
    this.updateTargetId = inv.productId;
    this.updateTargetName = inv.productName;
    this.updateForm.patchValue({
      quantityInStock: inv.quantityInStock,
      reorderLevel: inv.reorderLevel
    });
  }

  submitUpdate(): void {
    if (this.updateForm.invalid || !this.updateTargetId) { this.updateForm.markAllAsTouched(); return; }
    this.isUpdating = true;
    const dto: UpdateInventoryDto = this.updateForm.value;
    this.productService.updateInventory(this.updateTargetId, dto).subscribe({
      next: () => {
        this.successMsg = `Inventory updated for "${this.updateTargetName}".`;
        this.updateTargetId = null;
        this.isUpdating = false;
        this.loadLowStock();
        if (this.searchedInventory) this.searchInventory();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => { this.errorMsg = 'Update failed.'; this.isUpdating = false; }
    });
  }

  cancelUpdate(): void { this.updateTargetId = null; }

  isInvalidAdjust(name: string) { const f = this.adjustForm.get(name); return f?.invalid && f?.touched; }
  isInvalidUpdate(name: string) { const f = this.updateForm.get(name); return f?.invalid && f?.touched; }
}