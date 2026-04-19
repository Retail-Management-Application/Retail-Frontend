import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../../../core/models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html'
})
export class CartViewComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  message = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: res => {
        this.cart = res.data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  remove(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => this.loadCart(),
      error: err => this.message = err.error?.message || 'Failed to remove item.'
    });
  }

  clear(): void {
    if (!confirm('Clear entire cart?')) return;
    this.cartService.clearCart().subscribe({
      next: () => this.loadCart()
    });
  }

  checkout(): void {
    this.router.navigate(['/cart/checkout']);
  }
}