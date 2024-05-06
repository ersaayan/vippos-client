import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { StockResponse } from '../../interfaces/stock-response';
import { StockService } from '../../services/stock.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    MatSnackBarModule,
    ToastModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.css',
})
export class BarcodeComponent implements OnInit {
  stockKarts: StockResponse[] = [];

  clonedStockKarts: { [s: string]: StockResponse } = {};

  loading: boolean = true;

  searchTerm: string = '';

  matSnacksBar = inject(MatSnackBar);

  constructor(
    private messageService: MessageService,
    private stockService: StockService
  ) {}

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
  }

  onRowEditInit(stockKart: StockResponse) {
    this.clonedStockKarts[stockKart.id] = { ...stockKart };
  }

  onRowEditSave(stockKart: StockResponse) {
    delete this.clonedStockKarts[stockKart.id];
    this.stockService.updateStockKart(stockKart).subscribe(
      () => {
        this.matSnacksBar.open('Stock kart updated', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      },
      (error) => {
        console.error('Error updating stock kart: ', error);
        this.matSnacksBar.open('Error updating stock kart', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    );
  }

  onRowEditCancel(stockKart: StockResponse, index: number) {
    this.stockKarts[index] = this.clonedStockKarts[stockKart.id];
    delete this.clonedStockKarts[stockKart.id];
  }

  deleteStockKarts() {
    this.stockService.deleteStockKarts().subscribe((response) => {
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

      this.matSnacksBar.open('Stock Karts Deleted Successfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    });
  }

  cleanDb() {
    this.stockService.deleteStockKarts().subscribe((response) => {
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
    });

    this.matSnacksBar.open('Database Cleaned Successfully', 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
