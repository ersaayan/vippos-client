import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { StockCartService } from '../../services/stock-cart.service';
import { StockCartResponse } from '../../interfaces/stock-cart-response';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    TagModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.css',
  providers: [MessageService],
})
export class BarcodeComponent implements OnInit {
  stockKarts: StockCartResponse[] = [];

  clonedStockKarts: { [s: string]: StockCartResponse } = {};

  constructor(
    private messageService: MessageService,
    private stockCartService: StockCartService
  ) {}
  ngOnInit() {
    this.stockCartService.getStockCart().subscribe(
      (stockKarts) => {
        this.stockKarts = stockKarts;
      },
      (error) => {
        console.error('Error fetching stock carts: ', error);
      }
    );
  }

  onRowEditInit(stockKart: StockCartResponse) {
    this.clonedStockKarts[stockKart.id] = { ...stockKart };
  }

  onRowEditSave(stockKart: StockCartResponse) {
    delete this.clonedStockKarts[stockKart.id];
    this.stockCartService.updateStockCartBarcode(stockKart).subscribe(
      () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Güncellendi',
          detail: 'Stock Cart Başarıyla Güncellendi',
        });
      },
      (error) => {
        console.error('Error updating stock kart: ', error);
        this.messageService.add({
          severity: 'danger',
          summary: 'Güncellenemedi',
          detail: 'Stock Cart Güncellenemedi',
        });
      }
    );
  }

  onRowEditCancel(stockKart: StockCartResponse, index: number) {
    this.stockKarts[index] = this.clonedStockKarts[stockKart.id];
    delete this.clonedStockKarts[stockKart.id];
  }
}
