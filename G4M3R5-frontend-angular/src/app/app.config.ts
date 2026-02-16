import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// English translations
import enTranslations from '../assets/i18n/en.json';
// Dutch translations
import nlTranslations from '../assets/i18n/nl.json';

// Custom TranslateLoader that uses the imported JSON files
export class JsonTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    // Return the appropriate translation based on language
    if (lang === 'en') {
      return of(enTranslations);
    }
    return of(nlTranslations); // Default to Dutch
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: 'LoginService', useExisting: AuthService },
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'nl',
        loader: {
          provide: TranslateLoader,
          useClass: JsonTranslateLoader
        }
      })
    )
  ]
};