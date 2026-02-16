import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavItemComponent } from "./nav-item/nav-item.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { NavDropdownItemComponent } from './nav-dropdown-item/nav-dropdown-item.component';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavItemComponent, CommonModule, RouterLink, NavDropdownItemComponent, LanguageSwitcherComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private languageService = inject(LanguageService);
  private langSubscription: Subscription | null = null;
  
  protected isLoggedIn = false;
  protected isAdmin = false;
  protected username: string | null = null;
  private authSubscription: Subscription | null = null;
  private adminSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;
  protected isProfileMenuOpen = false;
  
  protected headerRoutes = signal([
    {
      href: '/',
      textKey: 'COMMON.HOME'
    },
    {
      href: '/admin',
      textKey: 'COMMON.ADMIN',
      requiresAdmin: true
    },
    {
      href: '/order-history',
      textKey: 'COMMON.ORDERS',
      requiresAuth: true
    },
    {
      href: '/login',
      textKey: 'COMMON.LOGIN',
      hideWhenAuth: true
    },
    {
      href: '/register',
      textKey: 'COMMON.REGISTER',
      hideWhenAuth: true
    },
    {
      href: '/cart',
      textKey: 'COMMON.CART'
    }
  ]);
  
  protected isMenuOpen = false;
  
  profileMenuItems = signal([
    {
      icon: 'fas fa-user',
      labelKey: 'USER_PROFILE.TITLE',
      action: () => this.goToProfile()
    },
    {
      icon: 'fas fa-sign-out-alt',
      labelKey: 'COMMON.LOGOUT',
      action: () => this.logout()
    }
  ]);
  
  ngOnInit() {
    // Subscribe to language changes
    this.langSubscription = this.languageService.currentLang$.subscribe(() => {
      // Update any text that needs to be changed when language changes
    });
    
    // Subscribe to the auth state changes
    this.authSubscription = this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      
      // Update username when auth state changes
      if (loggedIn) {
        this.username = this.authService.getUserName();
      } else {
        this.username = null;
      }
    });
    
    // Subscribe to admin status changes
    this.adminSubscription = this.authService.isAdminUser().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    
    // Subscribe to current user changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.username;
      }
    });
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    
    // Clean up subscriptions to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
  
  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.isProfileMenuOpen = false;
  }
  
  logout(): void {
    this.authService.logout();
    this.isProfileMenuOpen = false;
  }
  
  getNavItemsExceptCart() {
    return this.headerRoutes().filter(item => {
      // Skip cart item which is shown separately
      if (item.textKey === 'COMMON.CART') return false;
      
      // Hide items that require auth when not logged in
      if (item.requiresAuth && !this.isLoggedIn) return false;
      
      // Hide items that require admin when user is not admin
      if (item.requiresAdmin && !this.isAdmin) return false;
      
      // Hide items marked to be hidden when authenticated
      if (item.hideWhenAuth && this.isLoggedIn) return false;
      
      return true;
    });
  }
}
