import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactSectionService {
  private apiUrl = environment.apiUrl+ '/contact';

  constructor(private http: HttpClient) {}

  getContact(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateContact(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data);
  }
}
