import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { ProductResponse } from '../interfaces/product-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/products`)
      .pipe(
        map((response: any[]) => {
          return response.map(item => ({
            id: item.id,
            PhoneBrandModelName: item.PhoneBrandModelName,
            PhoneBrandModelStockCode: item.PhoneBrandModelStockCode,
            PhoneBrandName: item.PhoneBrandName,
            PhoneModelGroupCode: item.PhoneModelGroupCode,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }));
        })
      );
  }



}
