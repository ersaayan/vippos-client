import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../interfaces/product-response';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
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
  selector: 'app-home',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    CheckboxModule,
    DropdownModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  stokKart!: FormGroup;

  products: ProductResponse[] = [];

  selectedProducts: ProductResponse[] = [];

  loading: boolean = true;

  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private stockService: StockService
  ) {}

  cols!: Column[];

  exportColumns!: ExportColumn[];

  ngOnInit(): void {
    this.stokKart = this.fb.group({
      CaseBrand: ['', [Validators.required]],
      CaseModelImage: ['', Validators.required],
      CaseModelVariations: ['', Validators.required],
      CaseModelTitle: ['', Validators.required],
    });

    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching products: ', error);
        this.loading = true;
      }
    );

    this.cols = [
      { field: 'id', header: 'Id', customExportHeader: 'ProductId' },
      { field: 'PhoneBrandModelName', header: 'Brand Model Name' },
      { field: 'PhoneBrandModelStockCode', header: 'SKU' },
      { field: 'PhoneBrandName', header: 'Brand' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get CaseBrand() {
    return this.stokKart.get('CaseBrand');
  }
  get CaseModelImage() {
    return this.stokKart.get('CaseModelImage');
  }
  get CaseModelVariations() {
    return this.stokKart.get('CaseModelVariations');
  }
  get CaseModelTitle() {
    return this.stokKart.get('CaseModelTitle');
  }
  get Description() {
    return this.stokKart.get('Description');
  }
  get Barcode() {
    return this.stokKart.get('Barcode');
  }

  generateStokKart() {
    const formData = new FormData();
    this.stokKart.value.forEach(([key, value]) => {
      formData.append(key, value);
    });

    this.stockService.generateStokKart(formData, this.selectedProducts).subscribe(response => {
      console.log(response);
    });
  }

}
