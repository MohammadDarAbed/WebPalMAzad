import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.mdel';
import { UpdatePaymentStatusModel } from '../models/PaymentStatus.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:5001/Order'; // TODO: Move to the config

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/Orders`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}/GetById`);
  }

  createOrder(Order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, Order);
  }

  createOrderFromCart(cartId: Order): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${cartId}/checkout`);
  }

  updateOrder(Order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${Order.id}`, Order);
  }

  updatePaymentStatus(orderId: number, updatePaymentStatus: UpdatePaymentStatusModel): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, updatePaymentStatus);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<Order>(`${this.apiUrl}/${id}`);
  }
}
