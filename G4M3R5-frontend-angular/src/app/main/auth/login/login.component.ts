import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  protected loginService = inject(AuthService);
  private router = inject(Router);
  protected errorMessage: string = '';
  protected isSubmitting: boolean = false;

  protected loginForm = new FormGroup({
    "email": new FormControl("", [Validators.required, Validators.email]),
    "password": new FormControl("", [Validators.required])
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  ngOnInit() {
    // Use if statement to check auth status and redirect if logged in
    this.loginService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.loginService.login({ 
      email: this.loginForm.value.email!, 
      password: this.loginForm.value.password! 
    }).subscribe({
      next: (responseData) => {
        this.isSubmitting = false;
        // The auth state is updated in the service now, navigation can occur
        this.router.navigate(['']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Er is een fout opgetreden bij het inloggen.';
      }
    });
  }
}
