import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CartService } from '../../../core/services/dashboard/cart.service';
import { ProductsService } from '../../../core/services/dashboard/products.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  ICartResponse,
  IProducts,
} from '../../../core/interfaceModel/interface.model';
import { ToastrService } from 'ngx-toastr';
interface CartItem {
  _id: string;
  productId: {
    _id: string;
    product_title: string;
    product_image: string;
  };
  product_title?: string; // Fallback if productId is null
  currentPrice: number;
  originalPrice: number;
  quantity: number;
  size?: string;
  color?: string;
}


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent  {
  cartItems: ICartResponse[] = [];
  priceChangedItems: ICartResponse[] = [];
  removedItems: ICartResponse[] = [];
  allItems: ICartResponse[] = [];

  isLoading = true;
  subtotal = 0;
  total = 0;
  shipping = 0;

  private subs = new Subscription();
  // isLoading = false;
  // cartItems: CartItem[] = [
  //   {
  //     _id: '1',
  //     productId: {
  //       _id: '101',
  //       product_title: 'Floral Summer Dress',
  //       product_image: 'floral-dress.jpg'
  //     },
  //     currentPrice: 799.99,
  //     originalPrice: 899.99,
  //     quantity: 1,
  //     size: 'M',
  //     color: 'Pink'
  //   },
  //   {
  //     _id: '2',
  //     productId: {
  //       _id: '102',
  //       product_title: 'Silk Scarf',
  //       product_image: 'plain-cotton-tshirt.png'
  //     },
  //     currentPrice: 299.99,
  //     originalPrice: 299.99,
  //     quantity: 2,
  //     color: 'Mauve'
  //   },
  //   {
  //     _id: '3',
  //     productId: {
  //       _id: '103',
  //       product_title: 'Designer Handbag',
  //       product_image: 'placeholder-logo.png'
  //     },
  //     currentPrice: 1299.99,
  //     originalPrice: 1499.99,
  //     quantity: 1,
  //     color: 'Beige'
  //   }
  // ];

  // priceChangedItems = [
  //   {
  //     _id: '3',
  //     productId: {
  //       _id: '103',
  //       product_title: 'Designer Handbag',
  //       product_image: 'designer-handbag.jpg'
  //     },
  //     currentPrice: 1299.99,
  //     originalPrice: 1499.99,
  //     quantity: 1
  //   }
  // ];

  // get subtotal(): number {
  //   return this.cartItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
  // }

  // get shipping(): number {
  //   return this.subtotal > 2000 ? 0 : 100; // Free shipping over 2000 EGP
  // }

  // get total(): number {
  //   return this.subtotal + this.shipping;
  // }

  // updateQuantity(item: CartItem, newQuantity: number) {
  //   if (newQuantity < 1) return;
  //   item.quantity = newQuantity;
  //   // Normally you would call an API to update the quantity
  // }

  // removeItem(itemId: string) {
  //   this.cartItems = this.cartItems.filter(item => item._id !== itemId);
  //   // Normally you would call an API to remove the item
  // }

  // confirmPrice(itemId: string) {
  //   // Accept the new price
  //   this.priceChangedItems = this.priceChangedItems.filter(item => item._id !== itemId);
  //   // Normally you would call an API to confirm the price change
  // }

  // goToCheckout() {
  //   if (this.priceChangedItems.length > 0) {
  //     alert('Please resolve the price changes before checkout');
  //     return;
  //   }
  //   // Navigate to checkout
  //   console.log('Proceeding to checkout');
  // }

  constructor(
    private _cartService: CartService,
    private _productService: ProductsService,
    private _authService: AuthService,
    private _router: Router,
    private _toaster:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (this.isLoggedIn()) {
      this.getUserItemsInCart();
      this.checkChangePrice();
    } else {
      this.loadGuestCart();
    }
  }

  loadGuestCart(): void {
    const localCart = this._cartService.getLocalCart();
    this.checkChangePrice();
    if (!localCart || localCart.length === 0) {
      this.cartItems = [];
      this.calculateTotals();
      this.isLoading = false;
      return;
    }
    const productIds = localCart.map((item: any) => item._id);
    this._productService.getMultipleProductsByIds(productIds).subscribe({
      next: (products) => {
        const updatedCart = localCart.map((item: any) => {
          const product = products.find((p: IProducts) => p._id === item._id);
          if (!product) return null;

          return {
            _id: item._id,
            productId: product._id,
            product_title: product.product_title,
            product_image: product.product_image,
            quantity: item.quantity || 1,
            currentPrice: product.price,
            originalPrice: product.price,
            priceChanged: false,
            removedAt: null,
          };
        });

        this.cartItems = updatedCart.filter((item: any) => item !== null);
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading guest cart:', err);
        this.cartItems = [];
        this.isLoading = false;
      },
    });
  }

  getUserItemsInCart(): void {
    this._cartService.getUserCart().subscribe({
      next: (cart: ICartResponse[]) => {
        this.cartItems = cart;
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user cart:', err);
        this.isLoading = false;
      },
    });
  }

  updateQuantity(item: ICartResponse, newQuantity: number): void {
    if (newQuantity < 1) return;

    if (newQuantity > item.productId.stock) {
      this._toaster.error('Sorry, not enough stock available.');
      return;
    }

    item.quantity = newQuantity;

    if (this.isLoggedIn()) {
      this._cartService.updateCartItem(item._id!, newQuantity).subscribe({
        next: () => this.calculateTotals(),
        error: (err) => console.error('Error updating quantity:', err),
      });
    } else {
      this._cartService.updateCartItem(item._id!, newQuantity);
      this.calculateTotals();
    }
  }

  removeItem(cartId: string): void {
    if (this.isLoggedIn()) {
      this._cartService.removeFromCart(cartId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(
            (item) => item._id !== cartId || item.isPurchased == false
          );
          this.checkChangePrice();
          this.calculateTotals();
        },
        error: (err) => console.error('Error removing item:', err),
      });
    } else {
      this._cartService.removeFromLocalCart(cartId);
      this.cartItems = this.cartItems.filter((item) => item._id !== cartId);
      this.calculateTotals();
    }
  }

  confirmPrice(cartId: string): void {
    if (this.isLoggedIn()) {
      this._cartService.confirmPriceChange(cartId).subscribe({
        next: () => {
          const item = this.cartItems.find((i) => i._id === cartId);
          if (item) {
            item.priceChanged = false;
            item.originalPrice = item.currentPrice;
          }
          this.checkChangePrice();
          this.calculateTotals();
        },
        error: (err) => console.error('Error confirming price change:', err),
      });
    } else {
      this.removeItem(cartId);
    }
  }

  checkChangePrice(): void {
    this._cartService.getUserCart().subscribe({
      next: (cart: ICartResponse[]) => {
        this.allItems = cart;
        this.cartItems = cart.filter(
          (item) => item.currentPrice === item.originalPrice && !item.removedAt
        );
        this.priceChangedItems = cart.filter(
          (item) => item.currentPrice !== item.originalPrice && !item.removedAt
        );
        this.removedItems = cart.filter((item) => item.removedAt !== null);

        this.calculateTotals();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error checking cart prices:', err);
        this.isLoading = false;
      },
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.originalPrice * item.quantity,
      0
    );
    this.shipping = this.subtotal > 500 ? 0 : 50;
    this.total = this.subtotal + this.shipping;
  }

  goToCheckout(): void {
    if (!this.isLoggedIn()) {
      this._router.navigate(['/auth/login']);
      return;
    }
    this._router.navigate(['/checkout']);
  }

  isLoggedIn(): boolean {
    return !!this._authService.getToken();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
