import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order, PlaceOrderDto, ApiResponse } from '../../../core/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(dto: PlaceOrderDto): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.api}/place`, dto);
  }

  getOrderHistory(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.api}/history`);
  }

  getOrderById(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.api}/${id}`);
  }
}