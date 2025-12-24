import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthInputErrorComponent } from '@auth/components/auth-input-error/auth-input-error.component';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, AuthInputErrorComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  hasError = signal(false);

  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 3500);
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login({ email: email!, password: password! }).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
        return;
      }

      setTimeout(() => {
        this.hasError.set(true);
      }, 3500);
    });
    
    this.loginForm.reset();
  }
}
