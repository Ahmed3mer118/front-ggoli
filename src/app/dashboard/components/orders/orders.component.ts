import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/dashboard/orders.service';
import { IOrders } from '../../../core/interfaceModel/interface.model';

@Component({
  selector: 'app-orders',
  imports: [FormsModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: IOrders[] = [];
  filteredOrders: IOrders[] = [];
  searchTerm = "";
  selectedStatus = "all";
  selectedOrder: IOrders | null = null;
  expandedOrderId: string | null = null;
  isLoading = true;


  constructor(private _ordersService: OrderService) {}

  ngOnInit(): void {
    this.getAllOrderByAdmin();
  }

  getAllOrderByAdmin() {
    this._ordersService.getAllOrderByAdmin().subscribe({
      next: (res: any) => {

        this.orders = res.orders;
        this.filteredOrders = res.orders;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to fetch orders', err);
        this.isLoading = false;
      },
    });
  }

  updateStatus(orderId: string, newStatus: string): void {
    this._ordersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
   
        this.getAllOrderByAdmin(); // Refresh the list
      },
      error: (err: any) => {
        console.error('Error updating status:', err);
      },
    });
  }

  viewOrderDetails(orderId: string) {
    this.expandedOrderId = this.expandedOrderId === orderId ? '' : orderId;
  
    if (this.expandedOrderId) {
      this._ordersService.getOrderByIdByAdmin(orderId).subscribe({
        next: (res: any) => {
          this.selectedOrder = res.order;
        },
        error: (err: any) => {
          console.error('Error loading order details:', err);
        }
      });
    } else {
      this.selectedOrder = null;
    }
  }
  
  getStatusColor(status: string): string {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'returned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  filterOrders(): void {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(
        (order) => order.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }
  }

  searchOrders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = this.orders;
      return;
    }
  
    const searchLower = this.searchTerm.toLowerCase();
  console.log(searchLower)
    this.filteredOrders = this.orders.filter(order => {
      return (

        order.orderNumber.toString().toLowerCase().includes(searchLower) ||
        order.userId?.email?.toLowerCase().includes(searchLower) ||
        order.status?.toLowerCase().includes(searchLower)
      );
    });
    console.log(this.filteredOrders)
  }
  

  getTotalAmount(order: IOrders): number {
    return order.products.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);
  }

  // Helper method to get customer name from order
  getCustomerName(order: IOrders): string {
    return order.userId.email.split('@')[0]; // Extract name from email
  } 
  calculateSubtotal(order: IOrders): string {
    return order.products
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      .toFixed(2);
  }
  
  calculateOrderTotal(order: IOrders): string {
    const subtotal = order.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal ;
    return total.toFixed(2);
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
