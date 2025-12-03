import { Component, OnInit } from '@angular/core';
import { UserServicesService } from '../../../core/services/dashboard/user-services.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/dashboard/orders.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;

  showOrdersModal = false;
  selectedUserOrders: any[] = [];
  selectedUserName = '';

  constructor(private usersService: UserServicesService,
    private ordersService: OrderService) { }

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      },
    });
  }

  viewOrders(user: any) {
    this.selectedUserName = user.username;
    this.ordersService.getOrderByIdsByAdmin(user).subscribe({
      next: (res: any) => {
        this.selectedUserOrders = res.data || [];
        this.showOrdersModal = true;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      },
    });
  }

  closeOrdersModal() {
    this.showOrdersModal = false;
    this.selectedUserOrders = [];
  }
  getSubtotal(order: any): number {
    return order.products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + (product.price * product.quantity), 0);
  }
  
  getTotal(order: any): number {
    return this.getSubtotal(order) + (order.shippingCost || 0);
  }
}
