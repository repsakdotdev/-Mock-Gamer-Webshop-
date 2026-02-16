import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchFilters } from '../models/search-filters.model';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/product';
  private selectedItemId: number = 1;

  constructor(private http: HttpClient) { }

  public selectItem(id: number) {
    this.selectedItemId = id;
  }

  public getSelectedItem(): number {
    return this.selectedItemId;
  }

  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  searchProductsWithAI(query?: string): Observable<Product[]> {
    let url = `${this.apiUrl}/enhancedsearch`;
    const params: any = {};
    
    if (query) {
      params.query = query;
    }
    
    return this.http.get<Product[]>(url, { params });
  }
  
  searchProducts(query?: string, categoryId?: number | null): Observable<Product[]> {
    let url = `${this.apiUrl}/search`;
    const params: any = {};
    
    if (query) {
      params.query = query;
    }
    
    if (categoryId) {
      params.category = categoryId;
    }
    
    return this.http.get<Product[]>(url, { params });
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin`, productData);
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/${id}`, productData);
  }
}
