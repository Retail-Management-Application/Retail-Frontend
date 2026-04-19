import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cart } from '../../../core/models/cart.model';
import { ApiResponse } from '../../../core/models/order.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private api = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.api);
  }

  addToCart(productId: number, quantity: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.api}/add`, { productId, quantity });
  }

  removeFromCart(cartItemId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/remove/${cartItemId}`);
  }

  clearCart(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/clear`);
  }
}