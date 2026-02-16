import { Component, Input, inject } from '@angular/core';
import { Property } from '../../../models/property.model';
import { Category } from '../../../models/category.model';

import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-property-viewer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './property-viewer.component.html',
  styleUrl: './property-viewer.component.scss'
})
export class PropertyViewerComponent {
  @Input({required: true}) properties: Property[] = [];
  @Input({required: true}) category!: Category;
  
  protected languageService = inject(LanguageService);
  
  groupedProperties: { [key: string]: Property[] } = {};
  
  getCategoryName(): string {
    return this.languageService.getLocalizedName(this.category);
  }
  
  getPropertyName(property: Property): string {
    return this.languageService.getLocalizedName(property);
  }
  
  getPropertyValue(property: Property): string {
    return this.languageService.getLocalizedValue(property);
  }
}