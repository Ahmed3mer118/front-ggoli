import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../../core/services/dashboard/orders.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  constructor(
    private _orderService: OrderService,
    private activeRoute: ActivatedRoute,
    private _router:Router,
    private _toaster:ToastrService
    
  ) {}
  selectedOrderProducts: any[] = [];
  expandedOrderId: string | null = '';
  orderDetails: any = null;
  id!: string;
  private sub! : Subscription
  ngOnInit(): void {
    const orderId = this.activeRoute.snapshot.paramMap.get('id');
    if (orderId) {
      this.viewOrderDetails(orderId);
    }
  }
  viewOrderDetails(orderId: string) {
    this.expandedOrderId = this.expandedOrderId === orderId ? '' : orderId;

    if (this.expandedOrderId) {
      this._orderService.getOrderByIdByUser(orderId).subscribe({
        next: (res) => {
          this.orderDetails = res?.order;
          this.selectedOrderProducts = res?.order?.products || [];
        },
        error: (err) => {
          this._toaster.error('Failed to fetch order details', err);
        },
      });
    } else {
      this.orderDetails = null;
      this.selectedOrderProducts = [];
    }
  }
  cancelOrder(orderId: string) {
    if (!orderId || this.orderDetails?.status !== 'pending') return;

    this._orderService.cancelOrderByUser(orderId, 'cancelled').subscribe({
      next: () => {
        this.orderDetails.status = 'cancelled'; 
        this._toaster.success('Order has been cancelled.');
        this._router.navigate(['/profile'])
      },
      error: (err) => {
        // console.error('Error cancelling order:', err);
        this._toaster.error('Failed to cancel the order.');
      },
    });
  }
  calculateSubtotal(): number {
    if (!this.selectedOrderProducts) return 0;
    return this.selectedOrderProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  ngOnDestory(){
    this.sub.unsubscribe()
  }
}
