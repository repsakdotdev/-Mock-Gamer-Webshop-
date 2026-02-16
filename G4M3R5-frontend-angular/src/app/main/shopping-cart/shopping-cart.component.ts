import { Component, inject, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { CartItemRendered } from '../../models/cart-item-rendered.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ShoppingCartItemComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit {
  protected shoppingCartService = inject(ShoppingCartService);
  protected notificationService = inject(NotificationService);
  protected cartItems: CartItemRendered[] = [];
  protected router = inject(Router);
  
  ngOnInit() {
    this.shoppingCartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }
  
  removeItem(cartItemId: number) {
    this.shoppingCartService.removeItemFromCart(cartItemId);
  }
  
  updateQuantityEvent(data: {cartItemId: number, quantity: number}) {
    this.shoppingCartService.updateItemQuantity(data.cartItemId, data.quantity);
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.21;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }
  
  clearCart() {
    if (confirm('Weet je zeker dat je je winkelwagen wilt leegmaken?')) {
      this.shoppingCartService.clearCart();
    }
  }
  
  checkout() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/order']);
    } else {
      this.notificationService.showNotification('Je winkelwagen is leeg', 'error');
    }
  }
}