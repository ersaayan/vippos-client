import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService, TreeNode } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { OrderService } from '../../services/order.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OrderResponse } from '../../interfaces/order-response';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { CaseBrandService } from '../../services/case-brand.service';
import { CaseBrand } from '../../interfaces/case-brand-response';
import stringify from 'json-stringify-safe';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { environment } from '../../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient, HttpEvent } from '@angular/common/http';

interface UploadEvent {
  originalEvent: HttpEvent<any>;
  files: File[];
}

@Component({
  selector: 'app-export-dashboard',
  standalone: true,
  imports: [
    TreeTableModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SelectButtonModule,
    AccordionModule,
    BadgeModule,
    TableModule,
    TagModule,
    ImageModule,
    ToastModule,
    FileUploadModule,
  ],
  templateUrl: './export-dashboard.component.html',
  styleUrl: './export-dashboard.component.css',
  providers: [OrderService, MessageService],
})
export class ExportDashboardComponent implements OnInit {
  uploadedFiles: any[] = [];

  apiURL: string = environment.apiUrl;

  caseBrands: CaseBrand[] = [];

  orders: any[] = [];

  orderDetails: any[] = [];

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.orderService.getOrdersWithDetails().subscribe((result) => {
      this.orders = result;
      console.log(stringify(result));
    });
  }

  onBasicUploadAuto(event: UploadEvent, orderId: string) {
    const formData: FormData = new FormData();
    formData.append('orderId', orderId);

    for (let file of event.files) {
      formData.append('files', file, file.name);
    }

    this.http
      .post(`${this.apiURL}/upload-file`, formData)
      .subscribe((response) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: 'File Uploaded with Successfully!',
        });
      });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  getSeverity(status: string) {
    switch (status) {
      case 'New Order':
        return 'info';
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
        return 'danger';
      case 'Return Requested':
        return 'warning';
      case 'Return Approved':
        return 'success';
      case 'Return Processed':
        return 'info';
      case 'Order Completed':
        return 'contrast';
      default:
        return 'info'; // Add a default case that returns a default value.
    }
  }
}
