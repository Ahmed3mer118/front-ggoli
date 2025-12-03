import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {}
  private URL = environment.apiUrl
  getLowStockProducts(): Observable<any> {
    return this.http.get(this.URL +'/products/send/stock');
  }
}
