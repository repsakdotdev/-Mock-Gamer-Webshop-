import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService: CategoryService = inject(CategoryService);
  private router = inject(Router);
  
  products: Product[] = [];
  categories: any[] = [];
  isLoading = true;
  searchQuery = '';
  selectedCategory: number | null = null;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: unknown) => {
        this.categories = data as any[];
      },
      error: (error: Error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  editProduct(productId: number): void {
    this.router.navigate(['/admin/edit', productId]);
  }

  createNewProduct(): void {
    this.router.navigate(['/admin/create']);
  }

  searchProducts(): void {
    this.isLoading = true;
    this.productService.searchProducts(this.searchQuery, this.selectedCategory).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error searching products:', error);
        this.isLoading = false;
      }
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.loadProducts();
  }
}
