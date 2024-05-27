import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StockCartResponse } from '../interfaces/stock-cart-response';
import { StockCartCustomResponse } from '../interfaces/stock-cart-custom-response';

@Injectable({
  providedIn: 'root',
})
export class StockCartService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStockCartsHistory(): Observable<StockCartCustomResponse[]> {
    return this.http
      .get<StockCartCustomResponse[]>(
        `${this.apiUrl}/stock-carts/custom-output-history`
      )
      .pipe(
        map((response: any[]) => {
          const stockCartResponse = response.map((item) => ({
            id: item.id,
            caseImage: item.caseImage,
            stockCode: item.stockCode,
            myorStockName: item.myorStockName,
            ikasStockName: item.ikasStockName,
            title: item.title,
            description: item.description,
            cost: item.cost,
            quantity: item.quantity,
            barcode: item.barcode,
            satisFiyat1: item.satisFiyat1,
            satisFiyat2: item.satisFiyat2,
            satisFiyat3: item.satisFiyat3,
            satisFiyat4: item.satisFiyat4,
          }));
          return stockCartResponse;
        })
      );
  }

  generateStockKart(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/stock-carts`, formData);
  }
}
