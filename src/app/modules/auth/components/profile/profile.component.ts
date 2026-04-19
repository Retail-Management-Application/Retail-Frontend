import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { UserProfile, UpdateProfileRequest } from 'src/app/core/models/user.model'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  profile!: UserProfile;
  loading = false;
  passwordLoading = false;
  activeTab = 'profile';
  successMsg = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]{7,15}$/)]],
      address: [''],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        confirmNewPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const pw = group.get('newPassword')?.value;
    const cpw = group.get('confirmNewPassword')?.value;
    return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
  }

  loadProfile(): void {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.profile = res.data;
          this.profileForm.patchValue({
            fullName: res.data.fullName,
            email: res.data.email,
            phoneNumber: res.data.phoneNumber,
            address: res.data.address || '',
          });
        }
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load profile.';
        this.loading = false;
      },
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.clearMessages();

    const data: UpdateProfileRequest = {};
    if (this.profileForm.get('fullName')?.value)
      data.fullName = this.profileForm.get('fullName')!.value;
    if (this.profileForm.get('email')?.value)
      data.email = this.profileForm.get('email')!.value;
    if (this.profileForm.get('phoneNumber')?.value)
      data.phoneNumber = this.profileForm.get('phoneNumber')!.value;
    if (this.profileForm.value.address !== null)
      data.address = this.profileForm.value.address;

    this.authService.updateProfile(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.profile = { ...this.profile, ...res.data };
          this.successMsg = 'Profile updated successfully!';
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to update profile.';
        this.loading = false;
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordLoading = true;
    this.clearMessages();

    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.successMsg = 'Password changed successfully!';
        this.passwordForm.reset();
        this.passwordLoading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to change password.';
        this.passwordLoading = false;
      },
    });
  }

  clearMessages(): void {
    this.successMsg = '';
    this.errorMsg = '';
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  get fullNameCtrl() { return this.profileForm.get('fullName')!; }
  get emailCtrl() { return this.profileForm.get('email')!; }
  get phoneNumberCtrl() { return this.profileForm.get('phoneNumber')!; }
  get currentPasswordCtrl() { return this.passwordForm.get('currentPassword')!; }
  get newPasswordCtrl() { return this.passwordForm.get('newPassword')!; }
  get confirmNewPasswordCtrl() { return this.passwordForm.get('confirmNewPassword')!; }
  get hasPasswordMismatch() {
    return this.passwordForm.errors?.['passwordMismatch'] && this.confirmNewPasswordCtrl.touched;
  }

  get roleBadgeClass(): string {
    return this.profile?.role?.toLowerCase() === 'admin' ? 'badge-admin' : 'badge-customer';
  }
}