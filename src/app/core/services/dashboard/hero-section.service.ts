import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
export interface HeroData {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeroSectionService {

  private apiUrl =environment.apiUrl

  constructor(private http: HttpClient) {}

  getHero(): Observable<HeroData> {
    return this.http.get<HeroData>(this.apiUrl+'/hero');
  }
  updateHero(data: FormData) {
    return this.http.put(this.apiUrl+"/hero", data);
  }
  

}
