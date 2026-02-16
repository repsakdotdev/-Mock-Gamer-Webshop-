import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { RouterLink } from '@angular/router';
import { OrderCardComponent } from './order-card/order-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderCardComponent, TranslateModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  
  private orderService = inject(OrderService);
  
  ngOnInit(): void {
    this.loadOrderHistory();
  }
  
  loadOrderHistory(): void {
    this.loading = true;
    this.error = null;
    
    this.orderService.getOrderHistory().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order history. Please try again later.';
        this.loading = false;
        console.error('Error loading order history:', err);
      }
    });
  }
}
