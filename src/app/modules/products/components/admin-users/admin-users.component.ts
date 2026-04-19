import { Component, OnInit } from '@angular/core';
import { ProductService, UserDto } from '../../services/product.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  isLoading = false;
  errorMsg = '';
  searchTerm = '';
  roleFilter: 'All' | 'Admin' | 'Customer' = 'All';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.productService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load users. Make sure the /api/users endpoint is implemented.';
        this.isLoading = false;
      }
    });
  }
getRoleLabel(role: 0 | 1): string {
  return role === 1 ? 'Admin' : 'Customer';
}
  applyFilter(): void {
  this.filteredUsers = this.users.filter(u => {
    const matchesSearch =
      !this.searchTerm ||
      u.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase());

    const roleLabel = this.getRoleLabel(u.role);
    const matchesRole = this.roleFilter === 'All' || roleLabel === this.roleFilter;
    return matchesSearch && matchesRole;
  });
}

  onSearch(): void { this.applyFilter(); }
  onRoleFilter(role: 'All' | 'Admin' | 'Customer'): void {
    this.roleFilter = role;
    this.applyFilter();
  }

get adminCount(): number { return this.users.filter(u => u.role === 1).length; }
get customerCount(): number { return this.users.filter(u => u.role === 0).length; }
get activeCount(): number { return this.users.filter(u => u.isActive).length; }

}