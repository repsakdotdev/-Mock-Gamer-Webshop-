import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderStatus } from '../models/order.model';
import { CartItemRendered } from '../models/cart-item-rendered.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  placeOrder(order: { 
    delivery_address_id: number; 
    items: { productId: number; quantity: number; }[];
    orderStatus?: OrderStatus; // Optional status
  }): Observable<HttpResponse<string>> {
    // Set default status if not provided
    if (!order.orderStatus) {
      order.orderStatus = OrderStatus.PENDING;
    }
    return this.httpClient.post(`${this.apiUrl}/order/place`, order, { responseType: 'text', observe: 'response' });
  }

  getOrderHistory(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.apiUrl}/order/history`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.httpClient.get<any>(`${this.apiUrl}/order/${id}`)
      .pipe(
        map(order => this.transformOrder(order))
      );
  }
  
  updateOrderStatus(orderId: number, status: OrderStatus): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/order/${orderId}/status`, status);
  }
  
  createDeliveryAddress(address: {
    zipCode: string;
    city: string;
    street: string;
    houseNumber: string;
    receiverName: string;
  }): Observable<{ deliveryAddressId: number }> {
    return this.httpClient.post<{ deliveryAddressId: number }>(`${this.apiUrl}/delivery-address`, address);
  }

  prepareOrderItems(cartItems: CartItemRendered[]): { productId: number; quantity: number; }[] {
    return cartItems.map(item => ({
      productId: item.product.productId,
      quantity: item.quantity
    }));
  }

  getOrderStatuses(): OrderStatus[] {
    return Object.values(OrderStatus);
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING: return 'In behandeling';
      case OrderStatus.PROCESSING: return 'Wordt verwerkt';
      case OrderStatus.SHIPPED: return 'Verzonden';
      case OrderStatus.DELIVERED: return 'Geleverd';
      case OrderStatus.CANCELED: return 'Geannuleerd';
      default: return 'Onbekend';
    }
  }

  private transformOrder(order: any): Order {
    if (!order) {
      console.error('Received empty order from API');
      return {} as Order;
    }
    
    if (!order.orderStatus) {
      order.orderStatus = OrderStatus.PENDING;
    }

    order.orderStatus = this.normalizeOrderStatus(order.orderStatus);
    
    if (!order.orderItems) {
      order.orderItems = [];
    }
    
    return order as Order;
  }

  private normalizeOrderStatus(status: string | OrderStatus): OrderStatus {
    if (typeof status === 'string') {
      // Handle string value coming from backend
      const upperStatus = status.toUpperCase();
      
      // Find matching OrderStatus enum value
      for (const enumValue of Object.values(OrderStatus)) {
        if (upperStatus === enumValue) {
          return enumValue;
        }
      }
      
      // Special case handling for "CANCELLED" vs "CANCELED"
      if (upperStatus === 'CANCELLED') {
        return OrderStatus.CANCELED;
      }
      
      return OrderStatus.PENDING; // Default
    }
    return status || OrderStatus.PENDING;
  }
}