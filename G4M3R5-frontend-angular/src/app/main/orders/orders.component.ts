import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { OrderService } from '../../services/order.service';
import { CartItemRendered } from '../../models/cart-item-rendered.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  protected cartItems: CartItemRendered[] = [];
  protected orderForm: FormGroup;

  protected isSubmitting = false;
  protected hasOrderError = false;
  protected orderErrorMessage = '';
  
  private shoppingCartService = inject(ShoppingCartService);
  private orderService = inject(OrderService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
  constructor() {
    this.orderForm = this.formBuilder.group({
      receiverName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      houseNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}\s?[A-Za-z]{2}$/)]],
      city: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.shoppingCartService.getCart().subscribe(items => {
      this.cartItems = items;
      
      // If cart is empty, redirect to shopping cart
      if (items.length === 0) {
        this.router.navigate(['/shopping-cart']);
        this.notificationService.showNotification('Je winkelwagen is leeg', 'error');
      }
    });
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

  isOrderFormValid(): boolean {
    return this.orderForm.valid && this.cartItems.length > 0;
  }

  submitOrder() {
    if (!this.isOrderFormValid() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.hasOrderError = false;
    
    // First create delivery address
    const addressData = {
      receiverName: this.orderForm.get('receiverName')?.value,
      street: this.orderForm.get('street')?.value,
      houseNumber: this.orderForm.get('houseNumber')?.value,
      zipCode: this.orderForm.get('zipCode')?.value,
      city: this.orderForm.get('city')?.value
    };
    
    this.orderService.createDeliveryAddress(addressData).subscribe({
      next: (response) => {
        // Now place the order with the delivery address ID
        const orderData = {
          delivery_address_id: response.deliveryAddressId,
          items: this.orderService.prepareOrderItems(this.cartItems)
        };
        
        this.orderService.placeOrder(orderData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.shoppingCartService.clearCart();
            this.notificationService.showNotification('Bestelling succesvol geplaatst!', 'success');
            this.router.navigate(['/order-success']);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.hasOrderError = true;
            this.orderErrorMessage = err.error?.message || 'Er is iets misgegaan bij het plaatsen van je bestelling.';
            this.notificationService.showNotification(this.orderErrorMessage, 'error');
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.hasOrderError = true;
        this.orderErrorMessage = err.error?.message || 'Er is iets misgegaan bij het opslaan van het bezorgadres.';
        this.notificationService.showNotification(this.orderErrorMessage, 'error');
      }
    });
  }
}