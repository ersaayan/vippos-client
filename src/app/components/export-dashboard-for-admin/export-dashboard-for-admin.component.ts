import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OrderFile } from '../../interfaces/file-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Status {
  id: string;
  status: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-export-dashboard-for-admin',
  standalone: true,
  imports: [
    ToastModule,
    TableModule,
    AccordionModule,
    TagModule,
    ImageModule,
    CommonModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    SelectButtonModule,
    ReactiveFormsModule,
    ListboxModule,
    ButtonModule,
  ],
  templateUrl: './export-dashboard-for-admin.component.html',
  styleUrl: './export-dashboard-for-admin.component.css',
  providers: [OrderService, MessageService],
})
export class ExportDashboardForAdminComponent implements OnInit {
  selectedFile: File | null = null;

  apiUrl: string = environment.apiUrl;

  photoUrl: string = environment.photoUrl;

  statuses: Status[] = [];

  selectedStatus: Status | undefined;

  orders: any[] = [];

  orderDetails: any[] = [];

  @ViewChild('filter') filter!: ElementRef;


  fileName = 'Select File';
  fileInfos?: Observable<any>;
  currentFile?: File;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
    this.loadStatuses();
    this.loadOrdersCustomOutput();
  }

  private loadOrdersCustomOutput() {
    this.orderService
      .getOrderWithDetailsGroupcaseBrandInOrderDetail()
      .subscribe((result) => {
        console.log(result);
        this.orders = result;
      });
    this.loadStatuses();
  }

  private loadStatuses() {
    this.orderService.getStatuses().subscribe((result: any[]) => {
      this.statuses = result.map((status) => ({
        id: status.id,
        status: status.status,
        label: status.status,
        value: status.id,
      }));
    });
  }

  getBrands(orderDetails: { [key: string]: any[] }): string[] {
    return Object.keys(orderDetails);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  downloadOrder(orderId: string, caseBrandName: string) {

    window.location.href = `${this.apiUrl}/order/export-orders-to-excel-admin/${orderId}/${caseBrandName}`;
  }

  uploadFile(orderId: string): void {
    if (this.selectedFile) {
      const formData = new FormData();

      formData.append('orderId', orderId);

      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post(`${this.apiUrl}/order/upload-file`, formData).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
          this.loadStatuses();
          this.loadOrdersCustomOutput();
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File upload failed' });
        }
      );
    }
  }

  deleteFile(fileId: string): void {
    this.orderService.deleteOrderFile(fileId).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File deleted successfully' });
        this.loadStatuses();
        this.loadOrdersCustomOutput();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File deletion failed' });
      }
    );
  }

  getBrandStatus(orderDetails: any[]): string {
    const statuses = orderDetails.map((detail) => detail.status);
    const uniqueStatuses = new Set(statuses);

    if (uniqueStatuses.size === 1) {
      const status = statuses[0];
      switch (status) {
        case 'New Order':
          return 'Yeni Sipariş';
        case 'In Production':
          return 'Üretimde';
        case 'Production Completed':
          return 'Üretim Tamamlandı';
        case 'Packaging in Progress':
          return 'Paketleniyor';
        case 'Packaging Completed':
          return 'Paketlendi';
        case 'Awaiting Shipment':
          return 'Kargolanacak';
        case 'Shipped':
          return 'Kargolandı';
        case 'In Customs':
          return 'Gümrükte';
        case 'Customs Clearance Completed':
          return 'Gümrük işlemleri tamamlandı';
        case 'Delivered':
          return 'Teslim Edildi';
        case 'Order Completed':
          return 'Sipariş Tamamlandı';
        default:
          return status; // Bilinmeyen durumlar için orijinal değeri döndür
      }
    } else {
      const allStatuses = [
        'New Order',
        'In Production',
        'Production Completed',
        'Packaging in Progress',
        'Packaging Completed',
        'Awaiting Shipment',
        'Shipped',
        'In Customs',
        'Customs Clearance Completed',
        'Delivered',
        'Order Completed',
      ];
      const firstIncompleteStatus = allStatuses.find((status) =>
        statuses.includes(status)
      );
      return firstIncompleteStatus || 'Karışık Durum'; // Farklı durumlar varsa ilk tamamlanmamış durumu veya "Karışık Durum" döndür
    }
  }

  getSeverity(status: string) {
    switch (status) {
      case 'New Order':
        return 'danger';
      case 'In Production':
        return 'info';
      case 'Production Completed':
        return 'success';
      case 'Packaging in Progress':
        return 'secondary';
      case 'Packaging Completed':
        return 'success';
      case 'Awaiting Shipment':
        return 'secondary';
      case 'Shipped':
        return 'info';
      case 'In Customs':
        return 'warning';
      case 'Customs Clearance Completed':
        return 'success';
      case 'Delivered':
        return 'info';
      case 'Cancelled':
        return 'contrast';
      case 'Return Requested':
        return 'warning';
      case 'Return Approved':
        return 'success';
      case 'Return Processed':
        return 'info';
      case 'Order Completed':
        return 'contrast';
      default:
        return 'info';
    }
  }

  onStatusChange(order: any, orderDetail: any, newStatusId: string) {
    const caseBrandId = orderDetail[0].brandId;
    this.orderService
      .updateOrderDetailStatus(order.id, newStatusId, caseBrandId)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order status updated successfully',
          });

          // Find the index of the updated orderDetail
          const orderIndex = this.orders.findIndex((order) =>
            order.orderDetails.some((od: any) => od.id === orderDetail.id)
          );

          if (orderIndex > -1) {
            // Find the orderDetail object within the order
            const orderDetailToUpdate = this.orders[
              orderIndex
            ].orderDetails.find((od: any) => od.id === orderDetail.id);

            if (orderDetailToUpdate) {
              // Update the original orderDetail object (and potentially the status label)
              orderDetailToUpdate.statusId = newStatusId;
              orderDetailToUpdate.status =
                this.statuses.find((s) => s.id === newStatusId)?.label ||
                orderDetailToUpdate.status;
            }
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update order status',
          });
          console.error('Failed to update order status', error);
        },
      });

      this.loadOrdersCustomOutput();
      this.loadStatuses();
  }
}
