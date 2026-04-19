import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../core/models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  expanded: number | null = null;   // orderId of expanded row

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loading = true;
    this.orderService.getOrderHistory().subscribe({
      next: res  => { this.orders = res.data ?? []; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }

  toggle(orderId: number): void {
    this.expanded = this.expanded === orderId ? null : orderId;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pending:        'bg-secondary',
      Confirmed:      'bg-primary',
      Preparing:      'bg-warning text-dark',
      OutForDelivery: 'bg-info text-dark',
      Delivered:      'bg-success',
      Cancelled:      'bg-danger'
    };
    return map[status] ?? 'bg-secondary';
  }
}