import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { OrderDetailResponse } from '../interfaces/order-detail-response';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getOrdersWithDetails(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/order/get-all-orders-with-details`)
      .pipe(
        map((response: any[]) => {
          return response.map((item) => ({
            id: item.id,
            orderCost: item.orderCost,
            user: item.User.name,
            status: item.Status.status,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            orderDetails: item.orderDetail.map((detail: any) => ({
              id: detail.id,
              orderId: detail.orderId,
              caseImage: detail.stockCart.caseImage,
              brandName: detail.stockCart.CaseBrand.brandName,
              caseModel: detail.stockCart.CaseModelVariation.modelVariationEng,
              phoneName: detail.stockCart.Phone.name,
              label:
                detail.stockCart.Phone.name.replace('Redmi Note', 'RM-Note') +
                '-' +
                detail.stockCart.CaseModelVariation.modelVariation +
                ' ' +
                detail.stockCart.CaseBrand.brandName,
              stockCode: detail.stockCart.stockCode,
              barcode: detail.stockCart.barcode,
              quantity: detail.quantity,
              status: detail.Status.status,
              createdAt: new Date(detail.createdAt),
              updatedAt: new Date(detail.updatedAt),
            })),
          }));
        })
      );
  }
  sentConsole() {
    console.log(
      'order response' +
        this.http
          .get<any[]>(`${this.apiUrl}/order/get-all-orders-with-details`)
          .pipe(
            map((response: any[]) => {
              return response.map((item) => ({}));
            })
          )
    );
  }
}
