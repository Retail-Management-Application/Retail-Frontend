import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password        = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: FormGroup;
  loading       = false;
  errorMsg      = '';
  showPassword  = false;
  showConfirmPw = false;

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {
    this.form = this.fb.group(
      {
        fullName: ['', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]],
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        phoneNumber: ['', [           // ← matches RegisterDto.phoneNumber
          Validators.required,
          Validators.pattern(/^[+]?[\d\s\-().]{7,15}$/)
        ]],
        address: ['', Validators.required],  // ← matches RegisterDto.address
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        ]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator }
    );
  }

  // ── Getters ──────────────────────────────────────────────
  get fullName()        { return this.form.get('fullName');        }
  get email()           { return this.form.get('email');           }
  get phoneNumber()     { return this.form.get('phoneNumber');     }
  get address()         { return this.form.get('address');         }
  get password()        { return this.form.get('password');        }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  togglePassword():  void { this.showPassword  = !this.showPassword;  }
  toggleConfirmPw(): void { this.showConfirmPw = !this.showConfirmPw; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading  = true;
    this.errorMsg = '';

    // ✅ Exactly matches RegisterDto fields
    const payload = {
      fullName:    this.form.value.fullName,
      email:       this.form.value.email,
      password:    this.form.value.password,
      phoneNumber: this.form.value.phoneNumber,
      address:     this.form.value.address,
      confirmPassword: this.form.value.confirmPassword
      // confirmPassword intentionally excluded
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}