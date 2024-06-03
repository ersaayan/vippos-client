import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { OrderFile } from '../interfaces/file-model';

@Injectable({
  providedIn: 'root',
})
export class OrderFilesService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrderFiles(orderId: string): Observable<OrderFile[]> {
    const url = `${this.apiUrl}/order/get-order-files-by-order-id/${orderId}`;
    return this.http.get<OrderFile[]>(url);
  }
}
