import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICart, ICartResponse } from '../../interfaceModel/interface.model';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private URL = environment.apiUrl;

  constructor(private _http: HttpClient, private _authService: AuthService) {}

  getUserCart(): Observable<ICartResponse[]> {
    return this._http
      .get<{ message: string; data: ICartResponse[] }>(this.URL + '/cart')
      .pipe(map((res) => res.data));
  }

  addCart(cartData: ICart): Observable<ICart> {
    return this._http.post<ICart>(this.URL + '/cart', cartData);
  }

  updateCartItem(cartId: string, quantity: number): Observable<any> {
    return this._http.put(this.URL + '/cart/' + cartId, { quantity });
  }

  confirmPriceChange(id: string) {
    return this._http.put(this.URL + '/cart/confirm-price', { id });
  }

  removeFromCart(id: string) {
    return this._http.put(this.URL + '/cart/remove', { id });
  }

  saveToLocalCart(item: ICartResponse) {
    const cart: ICartResponse[] = JSON.parse(
      localStorage.getItem('guest_cart') || '[]'
    );
  
    const existingItem = cart.find((c) => c._id === item._id);
    const itemQuantity = Number(item.quantity) || 1; 
  
    if (existingItem) {
      existingItem.quantity = Number(existingItem.quantity || 0) + itemQuantity;
    } else {
      item.quantity = itemQuantity;
      cart.push(item);
    }
  
    localStorage.setItem('guest_cart', JSON.stringify(cart));
  }
  removeFromLocalCart(id:string){
    const cart: ICartResponse[] = JSON.parse(localStorage.getItem('guest_cart') || '[]');
    const updatedCart = cart.filter(item => item._id !== id);
    console.log(updatedCart)
    localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
  }
  

  getLocalCart(): any {
    const data = localStorage.getItem('guest_cart');
    return data ? JSON.parse(data) : [];
  }
  transferGuestCartToUser(): void {
    const guestCart = this.getLocalCart();
    if (!guestCart || guestCart.length === 0) return;
    console.log(guestCart)
    guestCart.forEach((item:any) => {
      const payload = {
        productId: item._id ,
        quantity: item.quantity || 1,
      };
      this.addCart(payload).subscribe({
        next: () => {
          console.log('Item moved from guest to user cart');
        },
        error: (err) => {
          console.error('Error transferring item:', err);
        },
      });
    });
  
    // Clear guest cart after transfer
    localStorage.removeItem('guest_cart');
  }
  clearLocalCart(): void {
    localStorage.removeItem('guest_cart');
  }
  placeOrder(orderData: any) {
    return this._http.post( this.URL +'/orders', orderData);
  }
  
}
