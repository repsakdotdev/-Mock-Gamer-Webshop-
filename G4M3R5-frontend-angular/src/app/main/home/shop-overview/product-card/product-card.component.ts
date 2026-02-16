import { Component, Input, inject } from '@angular/core';
import { Product } from '../../../../models/product.model';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { ShoppingCartService } from '../../../../services/shopping-cart.service';
import { NotificationService } from '../../../../services/notification.service';
import { ToastService } from '../../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({required: true}) product!: Product;

  private productService = inject(ProductService);
  private router = inject(Router);
  private shoppingCartService = inject(ShoppingCartService);
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  protected languageService = inject(LanguageService);

  goToProduct() {
    this.productService.selectItem(this.product.productId);
    this.router.navigate(['/product', this.product.productId]);
  }
  
  addToCart() {
    // Default quantity is 1 when adding from product card
    this.shoppingCartService.addItemToCart(this.product.productId, 1);
    
    const productName = this.languageService.getLocalizedName(this.product);
    
    // Get the translation for the message
    this.translateService.get('CART.ITEM_ADDED').subscribe((itemAdded: string) => {
      // Show toast notification with translated message
      this.toastService.showSuccess(`${productName} ${itemAdded}`);
      
      // Keep the existing notification for backward compatibility
      this.notificationService.showNotification(`${productName} is toegevoegd aan je winkelwagen.`, 'success');
    });
  }

  getProductName(): string {
    return this.languageService.getLocalizedName(this.product);
  }
  
  getProductDescription(): string {
    return this.languageService.getLocalizedDescription(this.product);
  }
}