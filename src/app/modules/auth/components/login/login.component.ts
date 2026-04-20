import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;
  loading      = false;
  errorMsg     = '';
  showPassword = false;

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['',  Validators.required]
    });
  }

  // ── Getters for clean template access ──────────────────
  get email()    { return this.form.get('email');    }
  get password() { return this.form.get('password'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading  = true;
    this.errorMsg = '';

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        res.role === 'Admin'
          ? this.router.navigate(['/admin'])
          : this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err?.error?.message || 'Invalid email or password.';
      }
    });
  }
}