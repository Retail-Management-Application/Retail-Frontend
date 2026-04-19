// src/app/core/models/order.model.ts

import { CartItem } from './cart.model';

// Generic API wrapper — matches backend ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

// Matches backend OrderDto
export interface Order {
  orderId:         number;
  totalAmount:     number;
  status:          string;
  shippingAddress: string;
  placedAt:        string;   // comes as ISO string from API
  items:           CartItem[];
}

// Matches backend PlaceOrderDto
export interface PlaceOrderDto {
  shippingAddress: string;
  couponCode?:     string;
}