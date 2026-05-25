import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import type { FormGroup } from '@angular/forms';
import { SecurityService } from '@core/service/security.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly securityService = inject(SecurityService);

  submitted = false;
  loading = false;
  errorMsg = '';

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  isInvalid(name: 'email' | 'password'): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.touched || this.submitted));
  }

  getError(name: 'email' | 'password'): string {
    const c = this.form.get(name);
    if (!c?.errors) return '';

    if (c.errors['required']) return 'Ce champ est obligatoire.';
    if (name === 'email' && c.errors['email']) return 'Email invalide.';
    if (c.errors['minlength']) return `Minimum ${c.errors['minlength'].requiredLength} caractères.`;

    return 'Valeur invalide.';
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.form.value as { email: string; password: string };

    this.securityService.login(payload).subscribe({
      next: (response) => {
        this.securityService.persistSession(response);
        this.loading = false;
        this.redirectByRole();
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Login ou mot de passe incorrect.';
      }
    });
  }

  private redirectByRole(): void {
    const user = this.securityService.getCurrentUser();
    const role = user?.role;

    if (role === 'admin') this.router.navigateByUrl('/private/admin/dashboard');
    else if (role === 'secretaire') this.router.navigateByUrl('/private/secretaire/patients');
    else this.router.navigateByUrl('/private/dashboard');
  }
}
