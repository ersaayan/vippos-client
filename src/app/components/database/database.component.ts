import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { StockCartService } from '../../services/stock-cart.service';
import { StockCartCustomResponse } from '../../interfaces/stock-cart-custom-response';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    SliderModule,
    RatingModule,
    ProgressBarModule,
    ImageModule,
  ],
  templateUrl: './database.component.html',
  styleUrl: './database.component.css',
  providers: [StockCartService, MessageService, ConfirmationService],
})
export class DatabaseComponent implements OnInit {
  stockKarts: StockCartCustomResponse[] = [];

  loading: boolean = false;

  @ViewChild('filter') filter!: ElementRef;

  constructor(private stockCartService: StockCartService) {}

  ngOnInit() {
    this.stockCartService.getStockCarts().subscribe(
      (stockKarts) => {
        console.log(stockKarts);
        this.stockKarts = stockKarts;
      },
      (error) => {
        console.error('Error fetching stock carts: ', error);
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  downloadIkas() {
    const apiUrl: string = environment.apiUrl;
    window.location.href = `${apiUrl}/stock-carts/export-stock-cart-ikas`;
  }
  downloadMyor() {
    const apiUrl: string = environment.apiUrl;
    window.location.href = `${apiUrl}/stock-carts/export-stock-cart-myor`;
  }
}
