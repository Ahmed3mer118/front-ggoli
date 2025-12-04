import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { IResetPassword } from '../../interfaceModel/interface.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPassService {
  private URL = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  resetPassword(resetForm: IResetPassword): Observable<any> {
    return this._http.post<IResetPassword>(
      this.URL + '/auth/reset-password',
      resetForm
    );
  }
}
