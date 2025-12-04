import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Testimonial } from '../../interfaceModel/interface.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TestiomnialServicesService {
  private apiUrl = environment.apiUrl + '/testimonials';

  constructor(private http: HttpClient) {}

  getUserTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}`);
  }

  getAllTestimonialsAdmin(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/byAdmin`);
  }

  saveTestimonial(data: Testimonial, token: string): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.apiUrl}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  toggleActive(id: string, token: string): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.apiUrl}/status/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
