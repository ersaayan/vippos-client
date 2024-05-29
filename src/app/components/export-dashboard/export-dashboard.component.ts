import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
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
  ],
  templateUrl: './export-dashboard.component.html',
  styleUrl: './export-dashboard.component.css',
  providers: [OrderService],
})
export class ExportDashboardComponent implements OnInit {
  caseBrands: CaseBrand[] = [];

  orders: any[] = [];

  orderDetails: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrdersWithDetails().subscribe((result) => {
      this.orders = result;
      console.log(stringify(result));
    });
  }

  onGlobalFilter2(tt: TreeTable, event: Event) {
    tt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
