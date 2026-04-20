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

export interface RegisterDto {
  fullName:    string;
  email:       string;
  password:    string;
  phoneNumber: string;
  confirmPassword: string;
  address:     string;
}

export interface LoginDto {
  email:    string;
  password: string;
}

export interface AuthResponse {
  token:    string;
  fullName: string;
  email:    string;
  role:     string;
}

