import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StockCartResponse } from '../interfaces/stock-cart-response';
import { StockCartCustomResponse } from '../interfaces/stock-cart-custom-response';
import stringify from 'json-stringify-safe';

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
            caseBrand: item.caseBrand,
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
            updatedAt: item.updatedAt,
          }));
          return stockCartResponse;
        })
      );
  }

  getStockCart(): Observable<any[]> {
    return this.http
      .get<StockCartCustomResponse[]>(
        `${this.apiUrl}/stock-carts/custom-output`
      )
      .pipe(
        map((response: any[]) => {
          const stockCartResponse = response.map((item) => ({
            id: item.id,
            caseBrand: item.caseBrand,
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
            stockCode: item.stockCode,
            updatedAt: item.updatedAt,
          }));
          return stockCartResponse;
        })
      );
  }

  getStockCarts(): Observable<StockCartCustomResponse[]> {
    return this.http
      .get<StockCartCustomResponse[]>(
        `${this.apiUrl}/stock-carts/custom-output`
      )
      .pipe(
        map((response: any[]) => {
          const stockCartResponse = response.map((item) => ({
            id: item.id,
            caseImage: item.caseImage,
            caseBrand: item.caseBrand,
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
            updatedAt: item.updatedAt,
          }));
          return stockCartResponse;
        })
      );
  }

  generateStockKart(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/stock-carts`, formData);
  }

  transferDb() {
    return this.http.get<any>(`${this.apiUrl}/stock-carts/transfer`);
  }

  deleteStockKartsForIdsNotSent(ids: string[]) {
    return this.http.request<any>(
      'delete',
      `${this.apiUrl}/stock-carts/stock-cart-histories-ids-not-sent`,
      {
        body: { ids: ids },
      }
    );
  }

  updateStockCartBarcode(stockKart: StockCartResponse): Observable<any> {
    const response = this.http.patch<any>(
      `${this.apiUrl}/stock-carts/update-barcode/` + `${stockKart.id}`,
      {
        barcode: stockKart.barcode,
      }
    );
    response.subscribe((result) => {
    });
    return response;
  }

  updateStockCartImage(stockKart: StockCartResponse) {
    return this.http.patch(
      `${this.apiUrl}/stock-carts/update-image/` + `${stockKart.id}`,
      {
        caseImage: stockKart.caseImage,
      }
    );
  }

  getAllPhotos() {
    return this.http.get(
      `${this.apiUrl}/stock-carts/get-all-photos-with-brand`
    );
  }

  updateStockCartPhotos(formData: FormData) {
    return this.http.post<any>(
      `${this.apiUrl}/stock-carts/update-case-images`,
      formData
    );
  }
}
