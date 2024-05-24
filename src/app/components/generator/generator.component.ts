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
  caseBrands: { brandName: string }[] = [];

  phone: PhoneResponse[] = [];

  selectedPhone: PhoneResponse[] = [];

  stockKarts: StockCartResponse[] = [];

  selectedStockKarts: StockCartResponse[] = [];

  caseModelVariations: { modelVariation: string }[] = [];

  stokKart!: FormGroup;

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
    private phoneService: PhoneService
  ) {}

  cols!: Column[];

  stockCols!: Column[];

  exportColumns!: ExportColumn[];
  ngOnInit(): void {
    this.stokKart = this.fb.group({
      selectedBrands: [''],
      CaseModelImage: [File, Validators.required],
      NumberOfVariations: [1],
      CaseModelVariations: this.fb.array([]),
      CaseModelTitle: ['', Validators.required],
      phoneIds: [[]],
      Description: [''],
      Barcode: [''],
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

    this.cols = [
      { field: 'id', header: 'Id', customExportHeader: 'phoneIds' },
      { field: 'name', header: 'Brand Model Name' },
      { field: 'stockCode', header: 'SKU' },
      { field: 'brand', header: 'Brand' },
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

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
      this.stokKart.get('CaseModelImage')!.setValue(file);
    }
  }
}
