import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';
import stringify from 'json-stringify-safe';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OrderFilesService } from '../../services/order-files.service';
import { OrderFile } from '../../interfaces/file-model';
import { OrderDetailResponse } from '../../interfaces/order-detail-response';
import { Observable } from 'rxjs';

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
  ],
  templateUrl: './export-dashboard-for-admin.component.html',
  styleUrl: './export-dashboard-for-admin.component.css',
  providers: [OrderService, MessageService],
})
export class ExportDashboardForAdminComponent implements OnInit {
  orderUploadFileForm!: FormGroup;

  apiURL: string = environment.apiUrl;

  photoUrl: string = environment.photoUrl;

  statuses: Status[] = [];

  selectedStatus: Status | undefined;

  orders: any[] = [];

  ordersCustom: any[] = [];

  files: OrderFile[] = [];

  orderDetails: any[] = [];

  activeIndex: number = 0;

  @ViewChild('filter') filter!: ElementRef;

  fileName = 'Select File';
  fileInfos?: Observable<any>;
  currentFile?: File;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private orderFilesService: OrderFilesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.orderUploadFileForm = this.fb.group({
      orderFile: [File, Validators.required],
    });
    this.loadOrders();
    this.loadStatuses();
    this.loadOrdersCustomOutput();
  }

  get orderFile() {
    return this.orderUploadFileForm.get('orderFile') as FormControl;
  }

  private loadOrdersCustomOutput() {
    this.orderService
      .getOrderWithDetailsGroupcaseBrandInOrderDetail()
      .subscribe((result) => {
        this.ordersCustom = result;
      });
  }

  private loadOrders() {
    this.orderService.getOrdersWithDetails().subscribe((result) => {
      this.orders = result;
    });

    this.loadStatuses();
  }

  loadStatuses(): void {
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

  getStatusLabel(statusId: string): string {
    const status = this.statuses.find((s) => s.id === statusId);
    return status ? status.label : 'Unknown';
  }

  onStatusChange(orderDetail: any, newStatusId: string) {
    this.orderService
      .updateOrderDetailStatus(orderDetail.id, newStatusId)
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
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
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
}
