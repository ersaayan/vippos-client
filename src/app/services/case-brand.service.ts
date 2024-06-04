import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CaseBrand } from '../interfaces/case-brand-response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaseBrandService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCaseBrands(): Observable<CaseBrand[]> {
    return this.http.get<CaseBrand[]>(`${this.apiUrl}/case-brand`).pipe(
      map((response: any[]) => {
        return response.map((item) => ({
          id: item.id,
          brandName: item.brandName,
          myorGroupCode: item.myorGroupCode,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      })
    );
  }

  generateBrand(data: any): Observable<any> {
    const body = {
      brandName: data.brandName,
      myorGroupCode: data.myorGroupCode,
    };
    return this.http.post(`${this.apiUrl}/case-brand`, body);
  }
}
