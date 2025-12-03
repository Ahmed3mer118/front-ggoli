import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProfile } from '../../interfaceModel/interface.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  private apiURL = environment.apiUrl + '/users/byAdmin'

constructor(private http: HttpClient) {}
getAllUsers(): Observable<{ data: IProfile }> {
  return this.http.get<{ data: IProfile }>(this.apiURL);
}

}
