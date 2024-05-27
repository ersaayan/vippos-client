import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { CaseBrand } from '../../interfaces/case-brand-response';
import { CaseBrandService } from '../../services/case-brand.service';
import { CaseModelVariationsService } from '../../services/case-model-variations.service';
import { PhoneService } from '../../services/phone.service';
import { PhoneResponse } from '../../interfaces/phone-response';
import { StockCartResponse } from '../../interfaces/stock-cart-response';
import { StockCartService } from '../../services/stock-cart.service';
import { StockCartCustomResponse } from '../../interfaces/stock-cart-custom-response';

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
  selector: 'app-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    CheckboxModule,
    DropdownModule,
    ButtonModule,
    MatSnackBarModule,
    RippleModule,
    MenubarModule,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css',
})
export class GeneratorComponent implements OnInit {
  stokKart!: FormGroup;

  caseBrands: { brandName: string }[] = [];

  phone: PhoneResponse[] = [];

  selectedPhone: PhoneResponse[] = [];

  stockKarts: StockCartCustomResponse[] = [];

  selectedStockKarts: StockCartCustomResponse[] = [];

  caseModelVariations: { modelVariation: string }[] = [];

  loading: boolean = true;

  searchTerm: string = '';

  matSnacksBar = inject(MatSnackBar);

  fileName = 'Select File';
  fileInfos?: Observable<any>;
  currentFile?: File;
  constructor(
    private fb: FormBuilder,
    private caseBrandService: CaseBrandService,
    private caseModelVariationsService: CaseModelVariationsService,
    private phoneService: PhoneService,
    private stockCartService: StockCartService
  ) {}

  cols!: Column[];

  stockCols!: Column[];

  exportColumns!: ExportColumn[];
  ngOnInit(): void {
    this.stokKart = this.fb.group({
      selectedBrands: ['', Validators.required],
      selectedCaseModelVariations: ['', [Validators.required]],
      CaseModelImage: [File, Validators.required],
      CaseModelTitle: ['', Validators.required],
      phoneIds: [[]],
      Description: ['', [Validators.required]],
      Barcode: [''],
      Quantity: [''],
      Cost: [''],
      SatisFiyat1: [''],
      SatisFiyat2: [''],
      SatisFiyat3: [''],
      SatisFiyat4: [''],
    });

    this.phoneService.getPhones().subscribe(
      (phone) => {
        this.phone = phone;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching products: ', error);
        this.loading = false;
      }
    );

    this.stockCartService.getStockCartsHistory().subscribe(
      (stockKarts) => {
        this.stockKarts = stockKarts;
      },
      (error) => {
        console.error('Error fetching stock carts: ', error);
      }
    );

    this.cols = [
      { field: 'id', header: 'Id', customExportHeader: 'phoneIds' },
      { field: 'name', header: 'Brand Model Name' },
      { field: 'stockCode', header: 'SKU' },
      { field: 'brand', header: 'Brand' },
    ];

    this.stockCols = [
      { field: 'id', header: 'Id', customExportHeader: 'stockCartIds' },
      { field: 'caseImage', header: 'Case Image' },
      { field: 'stockCode', header: 'SKU' },
      { field: 'myorStockName', header: 'Myor Stock Name' },
      { field: 'ikasStockName', header: 'Ikas Stock Name' },
      { field: 'title', header: 'Title' },
      { field: 'description', header: 'Description' },
      { field: 'cost', header: 'Cost' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'barcode', header: 'Barcode' },
      { field: 'satisFiyat1', header: 'Satis Fiyat 1' },
      { field: 'satisFiyat2', header: 'Satis Fiyat 2' },
      { field: 'satisFiyat3', header: 'Satis Fiyat 3' },
      { field: 'satisFiyat4', header: 'Satis Fiyat 4' },
    ];

    this.caseBrandService.getCaseBrands().subscribe((data) => {
      this.caseBrands = data.map((x) => ({ brandName: x.brandName }));
    });

    this.caseModelVariationsService
      .getCaseModelVariations()
      .subscribe((data) => {
        this.caseModelVariations = data.map((x) => ({
          modelVariation: x.modelVariation,
        }));
      });

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get selectedBrands() {
    return this.stokKart.get('selectedBrands');
  }

  get selectedCaseModelVariations() {
    return this.stokKart.get('selectedCaseModelVariations');
  }

  get CaseModelImage() {
    return this.stokKart.get('CaseModelImage');
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

  get Quantity() {
    return this.stokKart.get('Quantity');
  }

  get Cost() {
    return this.stokKart.get('Cost');
  }

  get SatisFiyat1() {
    return this.stokKart.get('SatisFiyat1');
  }

  get SatisFiyat2() {
    return this.stokKart.get('SatisFiyat2');
  }

  get SatisFiyat3() {
    return this.stokKart.get('SatisFiyat3');
  }

  get SatisFiyat4() {
    return this.stokKart.get('SatisFiyat4');
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
    const form = new FormData();
    const caseBrand = this.stokKart.get('selectedBrands')!.value;
    form.append('caseBrand', caseBrand);
    const caseModelVar = JSON.stringify(
      this.stokKart.get('selectedCaseModelVariations')!.value
    );
    form.append('caseModelVariation', caseModelVar);
    let proArry: string[] = [];
    const phoneIds = this.selectedPhone.map((phone) => phone.id);
    for (const phoneId of phoneIds) {
      proArry.push(phoneId);
    }
    let proString = JSON.stringify(proArry);
    form.append('phoneIds', proString);
    const CaseModelImageFile = this.currentFile;
    if (CaseModelImageFile instanceof File) {
      form.append('CaseModelImage', CaseModelImageFile);
    }
    form.append('title', this.stokKart.get('CaseModelTitle')!.value);
    form.append('description', this.stokKart.get('Description')!.value);
    form.append('barcode', this.stokKart.get('Barcode')!.value);
    form.append('cost', this.stokKart.get('Cost')!.value);
    form.append('quantity', this.stokKart.get('Quantity')!.value);
    form.append('satisFiyat1', this.stokKart.get('SatisFiyat1')!.value);
    form.append('satisFiyat2', this.stokKart.get('SatisFiyat2')!.value);
    form.append('satisFiyat3', this.stokKart.get('SatisFiyat3')!.value);
    form.append('satisFiyat4', this.stokKart.get('SatisFiyat4')!.value);

    this.stockCartService.generateStockKart(form).subscribe(
      (response) => {
        this.phoneService.getPhones().subscribe(
          (phone) => {
            this.phone = phone;
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching products: ', error);
            this.loading = false;
          }
        );
        // Başarılı olduğunda bir başarılı mesajı gösterebilirsiniz
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
}
