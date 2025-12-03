import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/dashboard/notification.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent  implements OnInit {
  lowStockProducts: any[] = [];
  isLoading = true;

  constructor(private notificationService: NotificationService) {}
  private sub! : Subscription
  ngOnInit(): void {
    this.fetchLowStock();
  }

  fetchLowStock(): void {
    this.notificationService.getLowStockProducts().subscribe({
      next: (res) => {
        this.lowStockProducts = res.products || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching low stock data:', err);
        this.isLoading = false;
      }
    });
  }
ngOnDestroy(){
  this.sub.unsubscribe()
}
}
