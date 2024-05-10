import { Component, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StockResponse } from '../../interfaces/stock-response';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { StockService } from '../../services/stock.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    CardModule,
    CommonModule,
    MatSnackBarModule,
    MultiSelectModule,
    CheckboxModule,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './database.component.html',
  styleUrl: './database.component.css',
})
export class DatabaseComponent implements OnInit {
  stockKarts: StockResponse[] = [];

  selectedStockKarts: StockResponse[] = [];

  loading: boolean = true;

  searchTerm: string = '';

  matSnacksBar = inject(MatSnackBar);

  constructor(
    private messageService: MessageService,
    private stockService: StockService,
    private snackBar: MatSnackBar
  ) {}

  cols!: Column[];

  stockCols!: Column[];

  exportColumns!: ExportColumn[];

  ngOnInit(): void {
    this.stockService.getStockKartsDb().subscribe(
      (stockKarts) => {
        this.stockKarts = stockKarts;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching stock karts: ', error);
        this.loading = false;
      }
    );

    this.stockCols = [
      { field: 'id', header: 'Id', customExportHeader: 'StockKartId' },
      { field: 'CaseBrand', header: 'Case Brand Name' },
      { field: 'CaseModelVariations', header: 'Case Model Variations' },
      { field: 'CaseModelTitle', header: 'Case Model Title' },
      { field: 'ProductIds', header: 'Product Ids' },
      { field: 'Description', header: 'Description' },
      { field: 'Barcode', header: 'Barcode' },
      { field: 'myorStockName', header: 'Myor Stock Name' },
      { field: 'ikasStockName', header: 'Ikas Stock Name' },
      { field: 'stockCode', header: 'Stock Code' },
      { field: 'createdAt', header: 'Created At' },
      { field: 'updatedAt', header: 'Updated At' },
    ];
  }
  downloadIkas() {
    window.location.href = 'https://pos.vipcase.com.tr/api/stock-kart/ikas-export';
  }
  downloadMyor() {
    window.location.href = 'https://pos.vipcase.com.tr/api/stock-kart/myor-export';
  }
}
