import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs';
import { Login } from '../models/auth-login.model';
import { LanguageService } from './language.service';

interface User {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
  internationalUser: boolean;
}

interface AuthResponse {
  token: string;
  email?: string;
  username?: string;
  admin?: boolean;
  internationalUser?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  
  private loggedIn: boolean = false;
  private authToken: string | null = null;

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private adminSubject = new BehaviorSubject<boolean>(this.isUserAdmin());

  private authStateSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor() {
    this.loadFromStorage();
    this.checkInitialAuthState();
  }

  private loadFromStorage() {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.currentUserSubject.next(user);
      } catch {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
    }
    
    this.authToken = localStorage.getItem('authToken');
    if (this.authToken) {
      this.loggedIn = true;
    }

    // No need to set language here - LanguageService's constructor already handles this
    // based on preferredLanguage in localStorage
  }

  private checkInitialAuthState() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authStateSubject.next(true);
      
      const userString = localStorage.getItem('currentUser');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          this.adminSubject.next(!!user.isAdmin);
        } catch {
          this.adminSubject.next(false);
        }
      }
    } else {
      this.authStateSubject.next(false);
      this.adminSubject.next(false);
    }
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  register(userData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.token) {
            const user = {
              id: 0,
              email: response.email || userData.email,
              username: response.username || userData.username,
              isAdmin: response.admin || false,
              internationalUser: response.internationalUser || userData.internationalUser || false
            };
            this.setCurrentUser(user, response.token);
              
            this.loggedIn = true;
            this.authToken = response.token;
            localStorage.setItem('authToken', response.token);
            this.authStateSubject.next(true);
            this.adminSubject.next(!!user.isAdmin);

            // Set preferred language based on internationalUser flag from response
            const langPref = user.internationalUser ? 'en' : 'nl';
            localStorage.setItem('preferredLanguage', langPref);
            this.languageService.changeLanguage(langPref);
          }
        })
      );
  }

  login(emailOrLogin: string | Login, password?: string): Observable<any> {
    let loginData: { email: string, password: string };
    
    if (typeof emailOrLogin === 'string' && typeof password === 'string') {
      loginData = { email: emailOrLogin, password };
    } else if (typeof emailOrLogin === 'object') {
      loginData = { email: emailOrLogin.email, password: emailOrLogin.password };
    } else {
      throw new Error('Invalid login parameters');
    }
    
    return this.httpClient.post<any>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        tap(response => {
          if (response.token) {
            const user = {
              id: 0,
              email: response.email || loginData.email,
              username: response.username || '',
              isAdmin: response.admin || false,
              internationalUser: response.internationalUser || false
            };
            this.setCurrentUser(user, response.token);
            
            this.loggedIn = true;
            this.authToken = response.token;
            localStorage.setItem('authToken', response.token);
            this.authStateSubject.next(true);
            this.adminSubject.next(!!user.isAdmin);
            
            // Set preferred language based on internationalUser flag from response
            const langPref = user.internationalUser ? 'en' : 'nl';
            localStorage.setItem('preferredLanguage', langPref);
            this.languageService.changeLanguage(langPref);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    
    localStorage.removeItem('authToken');
    this.loggedIn = false;
    this.authToken = null;
    
    this.router.navigate(['/login']);
    this.authStateSubject.next(false);
    this.adminSubject.next(false);
  }

  setCurrentUser(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token') || this.authToken;
  }

  isLoggedIn(): Observable<boolean> {
    return this.authStateSubject.asObservable();
  }

  isAdminUser(): Observable<boolean> {
    return this.adminSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  
  private isUserAdmin(): boolean {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return !!user.isAdmin;
      } catch {
        return false;
      }
    }
    return false;
  }

  getUserName(): string | null {
    const user = this.getCurrentUser();
    return user ? user.username : null;
  }

  refreshToken(user: User): Observable<any> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {})
      .pipe(
        map((response: AuthResponse) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            this.authToken = response.token;
            
            this.setCurrentUser(user, response.token);
            
            return response;
          }
          return null;
        })
      );
  }
}