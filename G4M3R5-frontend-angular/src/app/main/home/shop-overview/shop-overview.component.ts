import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductCardComponent } from './product-card/product-card.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { ProductService } from '../../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-overview',
  imports: [
    ProductCardComponent, 
    CommonModule, 
    SearchBarComponent, 
    SearchFiltersComponent, 
    TranslateModule
  ],
  templateUrl: './shop-overview.component.html',
  styleUrl: './shop-overview.component.scss',
  standalone: true
})
export class ShopOverviewComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  protected languageService = inject(LanguageService);
  
  private langSubscription?: Subscription;

  productsSignal = signal<Product[]>([]);

  get products() {
    return this.productsSignal;
  }

  currentSearch = '';
  currentCategoryId: number | null = null;
  useAISearch = false;
  productsUpdatedListener: any;

  ngOnInit(): void {
    this.loadAllProducts();
    
    // Add event listener for product updates
    this.productsUpdatedListener = this.handleProductsUpdated.bind(this);
    window.addEventListener('productsUpdated', this.productsUpdatedListener);
    
    // Subscribe to language changes to reload products with correct translations
    this.langSubscription = this.languageService.currentLang$.subscribe(() => {
      this.searchProducts();
    });
  }

  ngOnDestroy(): void {
    // Remove event listener when component is destroyed
    window.removeEventListener('productsUpdated', this.productsUpdatedListener);
    
    // Clean up language subscription
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productsSignal.set(data);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  onSearch(searchData: {query: string, useAI: boolean}) {
    this.currentSearch = searchData.query;
    
    if (searchData.useAI) {
      // Use AI search immediately
      this.productService.searchProductsWithAI(this.currentSearch).subscribe({
        next: (data) => {
          this.productsSignal.set(data);
        },
        error: (error) => {
          console.error('Error searching products with AI:', error);
        }
      });
    } else {
      // Use regular search
      this.productService.searchProducts(this.currentSearch, this.currentCategoryId).subscribe({
        next: (data) => {
          this.productsSignal.set(data);
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    }
  }
  
  onFilterChanged(filters: { categoryId: number | null }) {
    this.currentCategoryId = filters.categoryId;
    this.searchProducts();
  }
  
  handleProductsUpdated(event: Event): void {
    // Reload all products when a product update event is received
    this.loadAllProducts();
  }
  
  searchProducts(): void {
    // Always use regular search for filter changes
    this.productService.searchProducts(this.currentSearch, this.currentCategoryId).subscribe({
      next: (data) => {
        this.productsSignal.set(data);
      },
      error: (error) => {
        console.error('Error searching products:', error);
      }
    });
  }
}