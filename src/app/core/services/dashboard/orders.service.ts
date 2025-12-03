import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IOrders } from '../../interfaceModel/interface.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private URL = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  getUserOrders(): Observable<{ orders: IOrders[] }> {
    return this._http.get<{ orders: IOrders[] }>(this.URL + '/orders');
  }
  getOrderByIdByUser(orderId: string) {
    return this._http.get<any>(this.URL + '/orders/' + orderId );
  }
  getAllOrderByAdmin(): Observable<{ orders: IOrders[] }> {
    return this._http.get<{ orders: IOrders[] }>(this.URL + '/orders/byAdmin');
  }

  getOrderByIdByAdmin(orderId: string) {
    return this._http.get<any>(this.URL + '/orders/' + orderId + '/byAdmin');
  }
  getOrderByIdsByAdmin(orderId: string) {
    return this._http.get<any>(this.URL + '/orders/multiple/' + orderId + '/byAdmin');
  }
  updateOrderStatus( orderId: string | undefined, status: string): Observable<any> {
    
    return this._http.put(this.URL + '/orders/status/' + orderId + '/byAdmin', {
      orderId,
      status,
    });
  }
  cancelOrderByUser(orderId:string, status:string){
    return this._http.put(this.URL + '/orders/cancel/' + orderId + '/status', {
      orderId,
      status,
    });
  }
}
