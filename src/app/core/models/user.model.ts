export interface User {
  userId:      number;
  fullName:    string;
  email:       string;
  phoneNumber: string;
  address:     string;
  role:        'Admin' | 'Customer';
  createdAt:   string;
  isActive:    boolean;
}

export interface RegisterRequest {
  fullName:    string;
  email:       string;
  password:    string;
  phoneNumber: string;
  address:     string;
}

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface AuthResponse {
  token:    string;
  fullName: string;
  email:    string;
  role:     string;
    refreshToken: string;
  tokenExpiry: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserProfile {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserListItem {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
