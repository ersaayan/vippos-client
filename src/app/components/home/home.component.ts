import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { StockResponse } from '../../interfaces/stock-response';

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
    MatSnackBarModule,
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  stokKart!: FormGroup;

  products: ProductResponse[] = [];

  selectedProducts: ProductResponse[] = [];

  stockKarts: StockResponse[] = [];

  selectedStockKarts: StockResponse[] = [];

  loading: boolean = true;

  searchTerm: string = '';

  matSnacksBar = inject(MatSnackBar);

  fileName = 'Select File';
  fileInfos?: Observable<any>;
  currentFile?: File;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private stockService: StockService
  ) {}

  cols!: Column[];

  stockCols!: Column[];

  exportColumns!: ExportColumn[];

  ngOnInit(): void {
    this.stokKart = this.fb.group({
      CaseBrand: ['', [Validators.required]],
      CaseModelImage: [File, Validators.required],
      NumberOfVariations: [1],
      CaseModelVariations: this.fb.array([]),
      CaseModelTitle: ['', Validators.required],
      ProductIds: [[]],
      Description: [''],
      Barcode: [''],
    });

    this.addVariationInputs();

    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching products: ', error);
        this.loading = false;
      }
    );

    this.stockService.getStockKarts().subscribe(
      (stockKarts) => {
        this.stockKarts = stockKarts;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching stock karts: ', error);
        this.loading = false;
      }
    );

    this.cols = [
      { field: 'id', header: 'Id', customExportHeader: 'ProductId' },
      { field: 'PhoneBrandModelName', header: 'Brand Model Name' },
      { field: 'PhoneBrandModelStockCode', header: 'SKU' },
      { field: 'PhoneBrandName', header: 'Brand' },
    ];

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

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.stokKart.get('NumberOfVariations')?.valueChanges.subscribe(() => {
      this.addVariationInputs();
    });
  }

  get CaseBrand() {
    return this.stokKart.get('CaseBrand');
  }
  get CaseModelImage() {
    return this.stokKart.get('CaseModelImage');
  }
  get NumberOfVariations() {
    return this.stokKart.get('NumberOfVariations');
  }
  get Var() {
    return this.stokKart.get('Var');
  }
  get CaseModelVariations() {
    return this.stokKart.get('CaseModelVariations');
  }
  get variationsArray() {
    return this.stokKart.get('CaseModelVariations') as FormArray; // CaseModelVariations'ı döndürüyoruz
  }
  get CaseModelTitle() {
    return this.stokKart.get('CaseModelTitle');
  }
  get ProductIds() {
    return this.stokKart.get('ProductIds');
  }
  get Description() {
    return this.stokKart.get('Description');
  }
  get Barcode() {
    return this.stokKart.get('Barcode');
  }

  addVariationInputs() {
    const numberOfVariationsControl = this.NumberOfVariations;
    const currentVariations = this.variationsArray.length;

    if (numberOfVariationsControl && currentVariations >= 0) {
      const numberOfVariations = numberOfVariationsControl.value;

      if (numberOfVariations > currentVariations) {
        for (let i = currentVariations; i < numberOfVariations; i++) {
          this.variationsArray.push(this.fb.control('', Validators.required));
          this.stokKart.addControl(
            `${i}`,
            this.fb.control('', Validators.required)
          );
        }
      } else if (numberOfVariations < currentVariations) {
        for (let i = currentVariations - 1; i >= numberOfVariations; i--) {
          this.variationsArray.removeAt(i);
          this.stokKart.removeControl(`${i}`);
        }
      }
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
      this.stokKart.get('CaseModelImage')!.setValue(file);
    }
  }

  generateStockKart() {
    const formData = new FormData();
    formData.append('CaseBrand', this.stokKart.get('CaseBrand')!.value);
    formData.append(
      'CaseModelTitle',
      this.stokKart.get('CaseModelTitle')!.value
    );

    // CaseModelImage
    const CaseModelImageFile = this.currentFile;
    if (CaseModelImageFile instanceof File) {
      formData.append('CaseModelImage', CaseModelImageFile);
    }

    // CaseModelVariations
    let varArry: string[] = [];
    const numberOfVariations =
      parseInt(this.stokKart.get('NumberOfVariations')!.value) - 1;
    for (let i = 0; i <= numberOfVariations; i++) {
      const variation = this.stokKart.get(`${i}`)!.value;
      varArry.push(variation);
    }
    let varString = varArry.join(', ');
    formData.append('CaseModelVariations', varString);

    // ProductIds
    let proArry: string[] = [];
    const productIds = this.selectedProducts.map((product) => product.id);
    for (const productId of productIds) {
      proArry.push(productId);
    }
    let proString = proArry.join(',');
    formData.append('ProductIds', proString);

    // Description
    const description = this.stokKart.get('Description')!.value;
    if (description) {
      formData.append('Description', description);
    }

    // Barcode
    const barcode = this.stokKart.get('Barcode')!.value;
    if (barcode) {
      formData.append('Barcode', barcode);
    }

    this.stockService.generateStockKart(formData).subscribe(
      (response) => {
        // Stok kart tablosunu yeniden yükleyebilirsiniz
        this.stockService.getStockKarts().subscribe(
          (stockKarts) => {
            this.stockKarts = stockKarts;
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching stock karts: ', error);
            this.loading = false;
          }
        );
        // Başarılı bir şekilde oluşturulduğuna dair bir mesaj gösterebilirsiniz
        this.matSnacksBar.open('Stock Kart generated successfully', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      },
      (error) => {
        console.error('Error generating Stock Kart: ', error);
        // Hata olduğunda bir hata mesajı gösterebilirsiniz
        this.matSnacksBar.open('Stock Kart generated successfully', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    );
  }

  deleteStockKartsForIdsNotSent() {
    const ids = this.selectedStockKarts.map((stockKart) => stockKart.id);
    this.stockService.deleteStockKartsForIdsNotSent(ids).subscribe(
      (response) => {
        // Stok kart tablosunu yeniden yükleyebilirsiniz
        this.stockService.getStockKarts().subscribe(
          (stockKarts) => {
            this.stockKarts = stockKarts;
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching stock karts: ', error);
            this.loading = false;
          }
        );
        // Başarılı bir şekilde silindiğine dair bir mesaj gösterebilirsiniz
        this.matSnacksBar.open(
          'Stock Karts saved successfully. Now, you can download it',
          'Close',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          }
        );
      },
      (error) => {
        console.error('Error deleting Stock Karts: ', error);
        // Hata olduğunda bir hata mesajı gösterebilirsiniz
        this.matSnacksBar.open('Stock Karts saved failed', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    );
  }
  downloadIkas() {
    window.location.href =
      'http://pos.vipcase.com.tr/api/stock-kart/ikas-export-yedek';
  }
  downloadMyor() {
    window.location.href =
      'http://pos.vipcase.com.tr/api/stock-kart/myor-export-yedek';
  }
  transferDb() {
    this.stockService.transferDb().subscribe(
      (response) => {
        // Stok kart tablosunu yeniden yükleyebilirsiniz
        this.stockService.getStockKarts().subscribe(
          (stockKarts) => {
            this.stockKarts = stockKarts;
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching stock karts: ', error);
            this.loading = false;
          }
        );
        // Başarılı bir şekilde transfer edildiğine dair bir mesaj gösterebilirsiniz
        this.matSnacksBar.open(
          'Stock Karts transferred successfully',
          'Close',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          }
        );
      },
      (error) => {
        console.error('Error transferring Stock Karts: ', error);
        // Hata olduğunda bir hata mesajı gösterebilirsiniz
        this.matSnacksBar.open('Stock Karts transferred failed', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    );
  }
}
