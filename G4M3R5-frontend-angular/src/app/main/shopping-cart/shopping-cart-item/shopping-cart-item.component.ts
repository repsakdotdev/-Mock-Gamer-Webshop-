import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItemRendered } from '../../../models/cart-item-rendered.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart-item.component.html',
  styleUrl: './shopping-cart-item.component.scss'
})
export class ShoppingCartItemComponent {
  @Input() item!: CartItemRendered;
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() updateQuantityEvent = new EventEmitter<{cartItemId: number, quantity: number}>();

  removeItem() {
    this.removeItemEvent.emit(this.item.cartItemId);
  }
  
  updateQuantity(quantityChange: number) {
    const newQuantity = this.item.quantity + quantityChange;
    if (newQuantity < 1) return;
    
    this.updateQuantityEvent.emit({
      cartItemId: this.item.cartItemId,
      quantity: newQuantity
    });
  }
  
  getItemTotal(): number {
    return this.item.product.price * this.item.quantity;
  }
}