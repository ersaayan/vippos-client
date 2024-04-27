import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StockRequest } from '../interfaces/stock-request';
import { ProductResponse } from '../interfaces/product-response';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  apiUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) { }


  generateStokKart(formData: FormData, selectedProducts: ProductResponse[]) {
    // Form verilerini FormData nesnesine ekle
    Object.entries(formData.getAll).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Seçilen ürünlerin id'lerini ProductIds olarak ekle
    const productIds = selectedProducts.map(product => product.id);
    formData.append('ProductIds', productIds.join(','));

    return this.http.post<any>(`${this.apiUrl}/auth/login`, formData);
  }
}
