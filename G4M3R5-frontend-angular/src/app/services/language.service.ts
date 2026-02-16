import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translateService = inject(TranslateService);
  private currentLangSubject = new BehaviorSubject<string>(this.getInitialLanguage());
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor() {
    // Subscribe to language changes from TranslateService
    this.translateService.onLangChange.subscribe(event => {
      this.currentLangSubject.next(event.lang);
      localStorage.setItem('preferredLanguage', event.lang);
    });
    
    // Initialize with saved language
    const savedLang = this.getInitialLanguage();
    this.changeLanguage(savedLang);
  }

  private getInitialLanguage(): string {
    // Check if user had a stored preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['nl', 'en'].includes(savedLang)) {
      return savedLang;
    }
    
    // Check if international user is set in user data
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        if (userData && userData.internationalUser) {
          return 'en';
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
    
    // Check browser language
    const browserLang = this.translateService.getBrowserLang();
    if (browserLang && ['nl', 'en'].includes(browserLang)) {
      return browserLang;
    }
    
    // Default to Dutch
    return 'nl';
  }

  changeLanguage(lang: string): void {
    if (this.translateService.getLangs().includes(lang)) {
      this.translateService.use(lang);
      this.currentLangSubject.next(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  isEnglish(): boolean {
    return this.getCurrentLang() === 'en';
  }

  isDutch(): boolean {
    return this.getCurrentLang() === 'nl';
  }
  
  // Helper function to get the appropriate name based on current language
  getLocalizedName(item: any): string {
    if (!item) return '';
    
    return this.isEnglish() && item.nameEnglish ? 
      item.nameEnglish : 
      item.nameDutch || '';
  }
  
  // Helper function to get the appropriate description based on current language
  getLocalizedDescription(item: any): string {
    if (!item) return '';
    
    return this.isEnglish() && item.descriptionEnglish ? 
      item.descriptionEnglish : 
      item.descriptionDutch || '';
  }
  
  // Helper function to get the appropriate value based on current language
  getLocalizedValue(item: any): string {
    if (!item) return '';
    
    return this.isEnglish() && item.valueEnglish ? 
      item.valueEnglish : 
      item.valueDutch || '';
  }
}
