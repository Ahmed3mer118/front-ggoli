import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VerifyCodeService {
  private  URLAPI = environment.apiUrl;
  constructor(private http: HttpClient) { }
  verifyCode(email: string, code: string) {
    return this.http.post(`${this.URLAPI}/auth/verify-code`, { email, code });
  }
  resendCode(email: string) {
    return this.http.post(`${this.URLAPI}/auth/resend-code`, { email });
  }
}
