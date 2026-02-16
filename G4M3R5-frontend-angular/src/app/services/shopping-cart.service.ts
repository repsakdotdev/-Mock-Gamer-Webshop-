import { Injectable, inject } from '@angular/core';
import { CartItem } from '../models/cart-item-storage.model';
import { CartItemRendered } from '../models/cart-item-rendered.model';
import { ProductService } from './product.service';
import { BehaviorSubject, Observable, forkJoin, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private productService = inject(ProductService);
  
  constructor() {
    this.loadCartFromLocalStorage();
  }
  
  private loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('shoppingCart');
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);
        this.cartItems.next(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data from localStorage:', error);
        this.cartItems.next([]);
      }
    }
  }
  
  private saveCartToLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.cartItems.value));
  }
  
  public addItemToCart(productId: number, quantity: number) {
    const currentCart = [...this.cartItems.value];
    const existingItemIndex = currentCart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        cartItemId: Date.now(), // Generate unique ID
        productId: productId,
        quantity: quantity
      };
      currentCart.push(newItem);
    }
    
    this.cartItems.next(currentCart);
    this.saveCartToLocalStorage();
  }
  
  public updateItemQuantity(cartItemId: number, quantity: number) {
    const currentCart = [...this.cartItems.value];
    const itemIndex = currentCart.findIndex(item => item.cartItemId === cartItemId);
    
    if (itemIndex >= 0) {
      currentCart[itemIndex].quantity = quantity;
      this.cartItems.next(currentCart);
      this.saveCartToLocalStorage();
    }
  }
  
  public removeItemFromCart(cartItemId: number) {
    const currentCart = this.cartItems.value.filter(item => item.cartItemId !== cartItemId);
    this.cartItems.next(currentCart);
    this.saveCartToLocalStorage();
  }
  
  public getCartRaw(): CartItem[] {
    return this.cartItems.value;
  }
  
  public getCart(): Observable<CartItemRendered[]> {
    return this.cartItems.pipe(
      switchMap(items => {
        if (items.length === 0) {
          return of([]);
        }
        
        // Create an array of product observables
        const productObservables = items.map(item => 
          this.productService.getProductById(item.productId).pipe(
            map(product => ({
              cartItemId: item.cartItemId,
              product: product,
              quantity: item.quantity
            } as CartItemRendered))
          )
        );
        
        // Combine all observables into a single observable of CartItemRendered[]
        return forkJoin(productObservables);
      })
    );
  }
  
  public clearCart() {
    this.cartItems.next([]);
    this.saveCartToLocalStorage();
  }
}