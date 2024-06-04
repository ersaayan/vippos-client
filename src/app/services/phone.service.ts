import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { PhoneResponse } from '../interfaces/phone-response';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPhones(): Observable<PhoneResponse[]> {
    return this.http.get<PhoneResponse[]>(`${this.apiUrl}/phones`).pipe(
      map((response: any[]) => {
        return response.map((item) => ({
          id: item.id,
          brand: item.brand,
          model: item.model,
          name: item.name,
          groupCode: item.groupCode,
          stockCode: item.stockCode,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      })
    );
  }
}
