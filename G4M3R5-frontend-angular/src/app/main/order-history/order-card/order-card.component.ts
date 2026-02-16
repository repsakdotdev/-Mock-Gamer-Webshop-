import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Order, OrderStatus } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslateModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent {
  @Input() order!: Order;
  expanded = false;
  
  protected orderService = inject(OrderService);
  
  formatDate(dateString: string): Date {
    return new Date(dateString);
  }
  
  toggleExpand(): void {
    this.expanded = !this.expanded;
  }
  
  getStatusClass(): string {
    switch (this.order.orderStatus) {
      case OrderStatus.PENDING: return 'status-pending';
      case OrderStatus.PROCESSING: return 'status-processing';
      case OrderStatus.SHIPPED: return 'status-shipped';
      case OrderStatus.DELIVERED: return 'status-delivered';
      case OrderStatus.CANCELED: return 'status-cancelled';
      default: return '';
    }
  }
  
  getStatusLabel(): string {
    return this.orderService.getStatusLabel(this.order.orderStatus);
  }
}
