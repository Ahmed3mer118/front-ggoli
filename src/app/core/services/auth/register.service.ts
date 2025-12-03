import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRegister } from '../../interfaceModel/interface.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private  URLAPI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    address: string[]
  ): Observable<any> {
    const username = `${firstName} ${lastName}`;

    const body: IRegister = {
      username,
      email,
      password,
      phone_number: phone,
      role,
      address
    };

    return this.http.post(`${this.URLAPI}/auth/register`, body);
  }
}
