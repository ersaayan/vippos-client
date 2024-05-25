import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StockCartResponse } from '../interfaces/stock-cart-response';

@Injectable({
  providedIn: 'root',
})
export class StockCartService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStockCartsHistory(): Observable<StockCartResponse[]> {
    return this.http.get<any>(`${this.apiUrl}/stock-carts/history`).pipe(
      map((response: any[]) => {
        return response.map((item) => ({
          id: item.id,
          phoneId: item.phoneId,
          caseBrand: item.caseBrand,
          caseModelVariation: item.caseModelVariation,
          caseImage: item.caseImage,
          title: item.title,
          description: item.description,
          barcode: item.barcode,
          cost: item.cost,
          satisFiyat1: item.satisFiyat1,
          satisFiyat2: item.satisFiyat2,
          satisFiyat3: item.satisFiyat3,
          satisFiyat4: item.satisFiyat4,
          quantity: item.quantity,
          updatedBy: item.updatedBy,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      })
    );
  }
}
