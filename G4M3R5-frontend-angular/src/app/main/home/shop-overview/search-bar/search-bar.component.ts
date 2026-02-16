import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<{query: string, useAI: boolean}>();
  
  searchQuery = '';
  
  // Use arrow function to maintain 'this' context
  onSearch = (): void => {
    this.search.emit({
      query: this.searchQuery,
      useAI: false // Regular search
    });
  }

  // Add this method to handle keyup.enter events
  onKeyPress = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
  
  // Direct AI search without toggling state
  performAISearch = (): void => {
    this.search.emit({
      query: this.searchQuery,
      useAI: true // Always true for AI search
    });
  }
}
