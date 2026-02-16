import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, UserProfile } from '../../services/user.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private languageService = inject(LanguageService);
  
  userForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    internationalUser: [false]
  });
  
  isLoading = true;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    // Check if user is logged in before loading data
    if (!this.authService.getToken()) {
      this.errorMessage = 'U bent niet ingelogd. U wordt doorgestuurd naar de inlogpagina.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    this.userService.getCurrentUser()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading user data:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Uw sessie is verlopen. U wordt doorgestuurd naar de inlogpagina.';
            setTimeout(() => {
              this.authService.logout();
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = 'Er is een fout opgetreden bij het laden van uw gegevens.';
          }
          
          this.isLoading = false;
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (userData: UserProfile) => {
          this.userForm.patchValue({
            username: userData.username,
            email: userData.email,
            internationalUser: userData.internationalUser
          });
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const updateData = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      isInternational: this.userForm.value.internationalUser // Changed from internationalUser to isInternational to match UserUpdateRequest
    };
    
    // Update language preference based on form value
    if (this.userForm.value.internationalUser) {
      this.languageService.changeLanguage('en');
    } else {
      this.languageService.changeLanguage('nl');
    }
    
    this.userService.updateCurrentUser(updateData)
      .subscribe({
        next: (response) => {
          // Update stored user data
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            currentUser.username = response.username;
            currentUser.email = response.email;
            currentUser.internationalUser = response.internationalUser || updateData.isInternational;
            
            // Refresh token to update JWT with new user information
            this.authService.refreshToken(currentUser).subscribe({
              next: (tokenResponse) => {
                this.isSaving = false;
                this.successMessage = 'Uw gegevens zijn bijgewerkt!';
                
                setTimeout(() => {
                  this.successMessage = null;
                }, 3000);
              },
              error: (tokenError) => {
                console.error('Error refreshing token:', tokenError);
                this.errorMessage = 'Uw gegevens zijn bijgewerkt, maar er is een probleem met uw sessie. Log opnieuw in.';
                this.isSaving = false;
                
                // Force logout after a delay if token refresh fails
                setTimeout(() => {
                  this.authService.logout();
                  this.router.navigate(['/login']);
                }, 3000);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error updating user data:', error);
          this.isSaving = false;
          if (error.status === 409) {
            this.errorMessage = 'Dit e-mailadres is al in gebruik.';
          } else {
            this.errorMessage = 'Er is een fout opgetreden bij het bijwerken van uw gegevens.';
          }
        }
      });
  }
}
