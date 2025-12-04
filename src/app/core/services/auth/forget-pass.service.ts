import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgetPassService {
  constructor(private _http: HttpClient) {}
  private URL = environment.apiUrl;

  forgetPassword(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(
      `${this.URL}/auth/forget-password`,
      { email }
    );
  }
}
