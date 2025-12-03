import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/dashboard/cart.service';
import { Router } from '@angular/router';
import { ICartResponse } from '../../../../core/interfaceModel/interface.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  address1 = '';
  address2 = '';
  address3 = '';
  address4 = '';
  phone = '';
  paymentMethod = 'Cash';
  cartItems: ICartResponse[] = [];
  savedAddress = "Cairo, Nasr City, Abbas El-Akkad, Building 5, Apt 12"; // يمكن جلبها من API
  useNewAddress = false;
  
  useSavedAddress() {
      this.useNewAddress = true;
  }
  constructor(
    private _cartService: CartService,
    private _router: Router,
    private _toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this._cartService.getUserCart().subscribe({
  
      next: (items) => (this.cartItems = items),
      error: (err) => console.error('Failed to load cart items:', err),
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  placeOrder() {
    const orderData = {
      shippingData: {
        address: [this.address1, this.address2, this.address3, this.address4],
        phone: this.phone,
      },
      paymentMethod: this.paymentMethod,
      products: this.cartItems.map((item) => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
        price: item.currentPrice,
      })),
    };

    this._cartService.placeOrder(orderData).subscribe({
      next: (res) => {
        this._toaster.success('Order placed successfully!');
        this._router.navigate(['/']);
      },
      error: (err) => {
        this._toaster.error('Order failed', err);
      },
    });
  }
}
