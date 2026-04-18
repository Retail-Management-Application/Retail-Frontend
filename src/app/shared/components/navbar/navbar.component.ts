import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin    = false;
  userName   = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    this.isLoggedIn = !!token;
    if (user) {
      const parsed   = JSON.parse(user);
      this.isAdmin   = parsed.role === 'Admin';
      this.userName  = parsed.fullName;
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}

