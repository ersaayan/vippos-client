import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StockResponse } from '../interfaces/stock-response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateStockKart(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/stock-kart`, formData);
  }

  getStockKarts(): Observable<StockResponse[]> {
    return this.http.get<any>(`${this.apiUrl}/stock-kart/custom-output`).pipe(
      map((response: any[]) => {
        return response.map((item) => ({
          id: item.id,
          CaseBrand: item.CaseBrand,
          CaseModelVariations: item.CaseModelVariations[0],
          CaseModelTitle: item.CaseModelTitle,
          ProductIds: item.ProductIds[0],
          Description: item.Description,
          Barcode: item.Barcode,
          myorStockName: item.myorStockName,
          ikasStockName: item.ikasStockName,
          stockCode: item.stockCode,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      })
    );
  }

  deleteStockKartsForIdsNotSent(ids: string[]) {
    return this.http.request<any>(
      'delete',
      `${this.apiUrl}/stock-kart/delete-ids-not-sent`,
      {
        body: { ids: ids },
      }
    );
  }

  transferDb() {
    return this.http.get<any>(`${this.apiUrl}/stock-kart/transfer`);
  }

  getStockKartsDb(): Observable<StockResponse[]> {
    return this.http.get<any>(`${this.apiUrl}/stock-kart/custom-outputDb`).pipe(
      map((response: any[]) => {
        return response.map((item) => ({
          id: item.id,
          CaseBrand: item.CaseBrand,
          CaseModelVariations: item.CaseModelVariations[0],
          CaseModelTitle: item.CaseModelTitle,
          ProductIds: item.ProductIds[0],
          Description: item.Description,
          Barcode: item.Barcode,
          myorStockName: item.myorStockName,
          ikasStockName: item.ikasStockName,
          stockCode: item.stockCode,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      })
    );
  }

  deleteStockKarts() {
    return this.http.delete<any>(`${this.apiUrl}/stock-kart/delete`);
  }

  updateStockKart(stockKart: StockResponse) {
    console.log('stockKart: ', stockKart);
    return this.http.patch(
      `${this.apiUrl}/stock-kart/update` + `${stockKart.id}`,
      {
        CaseBrand: stockKart.CaseBrand,
        CaseModelVariations: [stockKart.CaseModelVariations],
        CaseModelTitle: stockKart.CaseModelTitle,
        ProductIds: [stockKart.ProductIds],
        Description: stockKart.Description,
        Barcode: stockKart.Barcode,
        updatedAt: new Date(),
      }
    );
  }
}
