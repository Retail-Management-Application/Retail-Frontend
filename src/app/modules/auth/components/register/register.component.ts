import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  hidePassword = true;
  hideConfirmPassword = true;

  passwordStrength = 0;
  strengthLabel = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,15}$/)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Watch password for strength meter
    this.registerForm.get('password')?.valueChanges.subscribe((val) => {
      this.calculateStrength(val);
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
  }

  calculateStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      this.strengthLabel = '';
      return;
    }

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    this.passwordStrength = Math.min(score, 4);

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    this.strengthLabel = labels[this.passwordStrength];
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Account created successfully! Redirecting...';
          setTimeout(() => {
            if (res.data.role === 'Admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1500);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }

  get fullNameCtrl() { return this.registerForm.get('fullName')!; }
  get emailCtrl() { return this.registerForm.get('email')!; }
  get phoneNumberCtrl() { return this.registerForm.get('phone')!; }
  get passwordCtrl() { return this.registerForm.get('password')!; }
  get confirmPasswordCtrl() { return this.registerForm.get('confirmPassword')!; }

  get hasPasswordMismatch() {
    return this.registerForm.errors?.['passwordMismatch'] && this.confirmPasswordCtrl.touched;
  }
}