import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AboutSectionService {
  private apiUrl =  environment.apiUrl +'/about';

  constructor(private http: HttpClient) {}

  getAbout(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateAbout(formData: FormData): Observable<any> {
    return this.http.put<any>(this.apiUrl, formData);
  }
}
