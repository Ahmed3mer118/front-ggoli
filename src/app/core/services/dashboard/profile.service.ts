import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProfile } from '../../interfaceModel/interface.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  URL = environment.apiUrl;
  constructor(private _http: HttpClient) {}
  getUser(): Observable<{ data: IProfile }> {
    return this._http.get<{ data: IProfile }>(this.URL + `/users`);
  }
  updateUser(data: any) {
    return this._http.put<{ message: string, data: any }>(
      this.URL +  '/users/update',
      data
    );
  }
}
