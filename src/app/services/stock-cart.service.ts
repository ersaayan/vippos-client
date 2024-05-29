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

  getStockCart(): Observable<StockCartResponse[]> {
    return this.http
      .get<StockCartCustomResponse[]>(
        `${this.apiUrl}/stock-carts/custom-output`
      )
      .pipe(
        map((response: any[]) => {
          const stockCartResponse = response.map((item) => ({
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
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));
          console.log(stockCartResponse);
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
          console.log(stockCartResponse);
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

  updateStockKart(stockKart: StockCartResponse) {
    console.log('stockKart: ', stockKart);
    return this.http.patch(
      `${this.apiUrl}/update-stock-cart/` + `${stockKart.id}`,
      {
        phoneId: stockKart.phoneId,
        caseBrand: stockKart.caseBrand,
        caseModelVariation: stockKart.caseModelVariation,
        caseImage: stockKart.caseImage,
        title: stockKart.title,
        description: stockKart.description,
        barcode: stockKart.barcode,
        cost: stockKart.cost,
        satisFiyat1: stockKart.satisFiyat1,
        satisFiyat2: stockKart.satisFiyat2,
        satisFiyat3: stockKart.satisFiyat3,
        satisFiyat4: stockKart.satisFiyat4,
        quantity: stockKart.quantity,
        updatedAt: new Date(),
      }
    );
  }
}
