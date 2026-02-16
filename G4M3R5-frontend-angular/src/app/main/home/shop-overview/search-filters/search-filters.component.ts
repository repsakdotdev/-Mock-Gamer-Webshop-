import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { LanguageService } from '../../../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

interface Category {
  categoryId: number;
  nameDutch: string;
  nameEnglish: string;
}

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule]
})
export class SearchFiltersComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<{ categoryId: number | null }>();
  
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  
  private http = inject(HttpClient);
  protected languageService = inject(LanguageService);
  
  ngOnInit(): void {
    this.loadCategories();
    
    // Reload categories when language changes
    this.languageService.currentLang$.subscribe(() => {
      // No need to reload, just use the localization functions
    });
  }
  
  // Use arrow functions to maintain 'this' context
  loadCategories = (): void => {
    this.http.get<Category[]>(`${environment.apiUrl}/categories`)
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
  }
  
  getCategoryName(category: Category): string {
    return this.languageService.getLocalizedName(category);
  }

  onCategoryChange = (): void => {
    this.filterChanged.emit({ categoryId: this.selectedCategoryId });
  }
  
  clearFilters = (): void => {
    this.selectedCategoryId = null;
    this.filterChanged.emit({ categoryId: null });
  }
}
