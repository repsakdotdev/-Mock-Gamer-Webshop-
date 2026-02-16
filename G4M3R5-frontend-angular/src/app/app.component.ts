import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { environment } from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    MainComponent,
    ToastContainerComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';
  private translateService = inject(TranslateService);

  constructor() {
    this.initializeTranslateService();
  }

  private initializeTranslateService(): void {
    // Available languages
    this.translateService.addLangs(['nl', 'en']);
    
    // Default language
    this.translateService.setDefaultLang('nl');
    
    // Get browser language or use default
    const browserLang = this.translateService.getBrowserLang();
    
    // Use browser language if it's available in our supported languages, otherwise use default
    const userLang = browserLang && ['en', 'nl'].includes(browserLang) ? browserLang : 'nl';
    
    // Use the selected language
    this.translateService.use(userLang);
  }
}
