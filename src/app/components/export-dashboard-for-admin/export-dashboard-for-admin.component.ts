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
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OrderFilesService } from '../../services/order-files.service';
import { OrderFile } from '../../interfaces/file-model';

interface Status {
  id: number;
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
  ],
  templateUrl: './export-dashboard-for-admin.component.html',
  styleUrl: './export-dashboard-for-admin.component.css',
  providers: [OrderService, MessageService],
})
export class ExportDashboardForAdminComponent implements OnInit {
  apiURL: string = environment.apiUrl;

  photoUrl: string = environment.photoUrl;

  statuses: Status[] = [];

  selectedStatus: Status | undefined;

  orders: any[] = [];

  files: OrderFile[] = [];

  orderDetails: any[] = [];

  activeIndex: number = 0;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private orderFilesService: OrderFilesService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadStatuses();
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
        value: status.status,
      }));
    });
  }

  loadFiles(orderId: string) {
    this.orderFilesService.getOrderFiles(orderId).subscribe((files) => {
      console.log('API Response:', files);
      this.files = files.map((file) => ({
        ...file,
        fileUrl: this.photoUrl + file.fileUrl,
      }));
    });
  }

  activeIndexChange(event: any): void {
    this.activeIndex = event; // Update activeIndex when a tab is changed
    const activeOrder = this.orders[this.activeIndex];
    if (activeOrder) {
      this.loadFiles(activeOrder.id); // Load files for the active order
    }
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  }

  isDocument(fileName: string): boolean {
    return /\.(pdf|doc|docx|xls|xlsx)$/i.test(fileName);
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
        return 'info';
    }
  }
}
