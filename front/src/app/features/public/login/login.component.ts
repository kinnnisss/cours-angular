import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import type { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  submitted = false;
  errorMsg = '';
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  isInvalid(name: 'username' | 'password'): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.touched || this.submitted));
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.value as { username: string; password: string };

    const ok = (username === 'patient' || username === 'admin') && password === '1234';
    if (!ok) {
      this.errorMsg = "Login ou mot de passe incorrect (mock : patient/1234 ou admin/1234).";
      return;
    }

    localStorage.setItem('mock_user', username);
    this.router.navigateByUrl('/private/dashboard');
  }
}
