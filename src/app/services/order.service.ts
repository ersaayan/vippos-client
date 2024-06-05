import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

  getOrderWithDetailsGroupcaseBrandInOrderDetail(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/order/get-all-orders-with-details`)
      .pipe(
        map((response: any[]) => {
          return response.map((item) => {
            const groupedOrderDetails = item.orderDetail.reduce(
              (acc: { [key: string]: any[] }, detail: any) => {
                const brandName = detail.stockCart.CaseBrand.brandName;
                acc[brandName] = acc[brandName] || [];
                acc[brandName].push({
                  id: detail.id,
                  orderId: detail.orderId,
                  caseImage: detail.stockCart.caseImage,
                  brandId: detail.stockCart.CaseBrand.id,
                  brandName: detail.stockCart.CaseBrand.brandName,
                  caseModel:
                    detail.stockCart.CaseModelVariation.modelVariationEng,
                  phoneName: detail.stockCart.Phone.name,
                  label:
                    detail.stockCart.Phone.name.replace(
                      'Redmi Note',
                      'RM-Note'
                    ) +
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
                });
                return acc;
              },
              {}
            );
            return {
              id: item.id,
              orderCost: item.orderCost,
              user: item.User.name,
              status: item.Status.status,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              orderDetails: groupedOrderDetails,
            };
          });
        })
      );
  }

  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status`);
  }

  updateOrderDetailStatus(orderDetailId: string, statusId: string) {
    const url = `${this.apiUrl}/order/order-details-status/${orderDetailId}`;
    return this.http.patch(url, { statusId });
  }

  uploadOrderFile(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/order/upload-file`, formData);
  }
}
