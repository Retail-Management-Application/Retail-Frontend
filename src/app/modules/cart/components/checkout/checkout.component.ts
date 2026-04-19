import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService }  from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart }         from '../../../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup;
  cart: Cart | null = null;
  loading  = false;
  placing  = false;
  message  = '';
  success  = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
      couponCode:      ['']
    });

    this.loading = true;
    this.cartService.getCart().subscribe({
      next: res => { this.cart = res.data; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }

  get f() { return this.form.controls; }

  placeOrder(): void {
    if (this.form.invalid) return;

    this.placing = true;
    this.message = '';

    const dto = {
      shippingAddress: this.f['shippingAddress'].value,
      couponCode:      this.f['couponCode'].value || undefined
    };

    this.orderService.placeOrder(dto).subscribe({
      next: res => {
        this.placing = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/cart/orders']), 2000);
      },
      error: err => {
        this.placing = false;
        this.message = err.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }
}