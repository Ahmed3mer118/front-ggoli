// products.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import {
  IBrand,
  IProducts,
  ISubcategory,
} from '../../interfaceModel/interface.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private URL = environment.apiUrl;
  private _brands = new BehaviorSubject<any[]>([]);
  brands$ = this._brands.asObservable();

  private _subcategories = new BehaviorSubject<any[]>([]);
  subcategories$ = this._subcategories.asObservable();

  // private _statusProduct =  new BehaviorSubject<Boolean>(true)
  // statusPrduct$ = this._statusProduct.asObservable()

  constructor(private _http: HttpClient, private _auth: AuthService) {}

  getBrand(): Observable<any> {
    return this._http.get<any>(this.URL + '/brand').pipe(
      tap((res) => {
        if (res.brand) {
          this._brands.next(res.brand);
        }
      })
    );
  }
  getBrandById(id: string) {
    return this._http.get<IBrand>(this.URL + '/brand/' + id);
  }
  getSubcategoryById(id: string) {
    return this._http.get<ISubcategory>(this.URL + '/subcategories/' + id);
  }

  addBrand(brand_name: string): Observable<any> {
    return this._http.post<any>(this.URL + '/brand', { brand_name }).pipe(
      tap((res) => {
        const current = this._brands.value;
        this._brands.next([...current, res.data]);
      })
    );
  }

  getSubcategories(): Observable<any> {
    return this._http
      .get<any>(this.URL + '/subcategories')
      .pipe(tap((res) => this._subcategories.next(res.subcategoies)));
  }

  addSubcategory(subcategory_name: string): Observable<any> {
    return this._http
      .post<any>(this.URL + '/subcategories', { subcategory_name })
      .pipe(
        tap((res) => {
          const current = this._subcategories.value;
          console.log(current);
          this._subcategories.next([...current, res.data]);
        })
      );
  }

  addProduct(productForm: FormData): Observable<IProducts> {
    return this._http.post<IProducts>(this.URL + '/products', productForm);
  }
  getProduct(): Observable<IProducts> {
    return this._http.get<IProducts>(this.URL + '/products');
  }
  getProductById(id: string): Observable<IProducts> {
    return this._http.get<IProducts>(this.URL + '/products/' + id);
  }
  getMultipleProductsByIds(ids: string[]): Observable<any[]> {
    return this._http.post<any[]>( this.URL +'/products/get-multiple', { ids });
  }
  
  getProductsbyRouteProduct(slug: string): Observable<IProducts> {
    return this._http.get<IProducts>(this.URL + '/products/slug/' + slug);
  }

  updateProduct(id: string, productForm: FormData): Observable<IProducts> {
    return this._http.put<IProducts>(this.URL + '/products/' + id, productForm);
  }
  updateStatus(routeProduct: string, status: boolean) {
    return this._http.put<boolean>(this.URL + '/products/' + routeProduct + '/status', {
      isActive: status,
    });
  }

}
