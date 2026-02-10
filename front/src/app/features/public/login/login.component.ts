import { Component } from '@angular/core';
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
  submitted = false;
  errorMsg = '';
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly router: Router, private readonly securityService: SecurityService) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  isInvalid(name: 'email' | 'password'): boolean {
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

    const { email, password } = this.form.value as { email: string; password: string };
    const result = this.securityService.login({ email:email , password }); 
    if (!result) { this.errorMsg = "Login ou mot de passe incorrect."; 
      return; }
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    this.router.navigateByUrl('/private/dashboard');
  }
}
