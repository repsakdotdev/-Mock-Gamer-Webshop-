import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { PropertyViewerComponent } from './property-viewer/property-viewer.component';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageViewerComponent, PropertyViewerComponent, TranslateModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private shoppingCartService = inject(ShoppingCartService);
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  protected languageService = inject(LanguageService);
  
  product: Product = {
    productId: 0,
    nameDutch: '',
    nameEnglish: '',
    descriptionDutch: '',
    descriptionEnglish: '',
    price: 0,
    previewImages: [],
    category: {categoryId: 0, nameDutch: '', nameEnglish: ''},
    properties: []
  };
  
  quantity: number = 1;
  loading = true;
  error = false;
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convert string to number
      if (id) {
        this.productService.getProductById(id).subscribe({
          next: (product) => {
            this.product = product;
          },
          error: (error) => {
            console.error('Error fetching product:', error);
          }
        });
      }
    });
  }
  
  addToCart() {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
    
    this.shoppingCartService.addItemToCart(this.product.productId, this.quantity);
    
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