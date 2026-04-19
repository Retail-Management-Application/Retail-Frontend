import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
    // Re-check on every route change so navbar stays in sync after login/logout
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.checkAuth());
  }

  checkAuth(): void {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    this.isLoggedIn = !!token;
    if (user) {
      const parsed   = JSON.parse(user);
      this.isAdmin   = parsed.role === 'Admin';
      this.userName  = parsed.fullName;
    } else {
      this.isAdmin  = false;
      this.userName = '';
    }
  }

  goToDashboard(): void {
    if (this.isAdmin) {
      this.router.navigate(['/products/admin']);
    } else {
      this.router.navigate(['/products/dashboard']);
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}