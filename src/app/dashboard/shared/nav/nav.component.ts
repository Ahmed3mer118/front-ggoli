import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/dashboard/notification.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  lowStockNotifications: any[] = [];

  constructor(private notificationService: NotificationService, 
    private _authService: AuthService, private _router: Router,   private _toaster:ToastrService) { }

  ngOnInit(): void {
    this.notificationService.getLowStockProducts().subscribe({
      next: (res) => {
        if (res.products) {
          this.lowStockNotifications = res.products.map((product: any) => ({
            title: 'Low stock alert',
            message: `${product.title} has only ${product.stock} units left.`,
            icon: 'fas fa-box',
            createdAt: new Date()
          }));
        }
      },
      error: (err) => console.error('Failed to load low stock alerts', err)
    });
  }
  logout() {
    this._authService.logout()
    this._toaster.success("Logout Successfuly")
    setTimeout(() => {
      this._router.navigate(['/'])
    }, 2000)
  }
}
