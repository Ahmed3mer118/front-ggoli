import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  ICart,
  ILogin,
  ILoginResponse,
  ITokenData,
} from '../../interfaceModel/interface.model';
import { CartService } from '../dashboard/cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient ) {}
  private URL = environment.apiUrl;
  TOKEN_KEY = 'token';
  private user = new BehaviorSubject<ITokenData | null>(null);
  public user$ = this.user.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());

  login(loginData: ILogin): Observable<ILoginResponse> {
    return this._http
      .post<ILoginResponse>(this.URL + '/auth/login', loginData)
      .pipe(
        tap((res) => {
          this.setToken(res.token);
          this.user.next(this.decoded(res.token));
        })
      );
  }
  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);

  }
  decoded(token: string) {
    return jwtDecode<ITokenData>(token);
  }
  getRole(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      return this.decoded(token).role;
    }
    return null;
  }
  getName(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      return this.decoded(token).username;
    }
    return null;
  }
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null)
    this.user.next(null);
  }
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getTokenObservable() {
    return this.tokenSubject.asObservable();
  }
  // syncGuestCartToDB() {
  //   const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
  //   if (guestCart.length) {
  //     guestCart.forEach((item: ICart) => {
  //       this._cartService.addCart(item).subscribe({
  //         next: () => {
  //           console.log(`Item ${item.productId} moved to DB`);
  //         }
  //       });
  //     });
  
  //     localStorage.removeItem('guest_cart');
  //   }
  // }
  
}
