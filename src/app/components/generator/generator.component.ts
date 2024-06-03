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
import { environment } from '../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TruncatePipe } from '../../truncate.pipe';

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
    ToastModule,
    ConfirmDialogModule,
    TruncatePipe,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css',
  providers: [ConfirmationService, MessageService],
})
export class GeneratorComponent implements OnInit {
  stokKart!: FormGroup;

  caseBrands: { brandName: string; id: string }[] = [];

  phone: PhoneResponse[] = [];

  selectedPhone: PhoneResponse[] = [];

  stockKarts: StockCartCustomResponse[] = [];

  selectedStockKarts: StockCartCustomResponse[] = [];

  caseModelVariations: { modelVariation: string; id: string }[] = [];

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
    private stockCartService: StockCartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
      this.caseBrands = data.map((x) => ({ brandName: x.brandName, id: x.id }));
    });

    this.caseModelVariationsService
      .getCaseModelVariations()
      .subscribe((data) => {
        this.caseModelVariations = data.map((x) => ({
          modelVariation: x.modelVariation,
          id: x.id,
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

  confirm1(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Telefon tablosundan modelleri seçtiniz mi? Seçmediyseniz işlem yapılamaz.',
      header: 'Bilgilendirme',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        setTimeout(() => {
          this.confirmationService.confirm({
            target: event.target as EventTarget,
            message:
              'Modelin fotoğrafını eklediniz mi? Eklemediyseniz işlem yapılamaz.',
            header: 'Bilgilendirme',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
              this.generateStockKart();
            },
            reject: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Reddedildi',
                detail: 'İşlem reddedildi!',
                life: 3000,
              });
            },
          });
        }, 300);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Reddedildi',
          detail: 'İşlem reddedildi!',
          life: 3000,
        });
      },
    });
  }

  private generateStockKart() {
    const form = new FormData();
    const caseBrand = this.stokKart.get('selectedBrands')!.value.id;
    form.append('caseBrand', caseBrand);
    const caseModelVarIds = this.stokKart
      .get('selectedCaseModelVariations')!
      .value.map((x: any) => x.id);
    const caseModelVarIdsString = JSON.stringify(caseModelVarIds);
    form.append('caseModelVariations', caseModelVarIdsString);
    let proArry: string[] = [];
    const phoneIds = this.selectedPhone.map((phone) => phone.id);
    for (const phoneId of phoneIds) {
      proArry.push(phoneId);
    }
    let proString = JSON.stringify(proArry);
    form.append('phoneIds', proString);
    const CaseModelImageFile = this.currentFile;
    if (CaseModelImageFile instanceof File) {
      form.append('caseImage', CaseModelImageFile);
    }
    const CaseModelTitle = this.stokKart.get('CaseModelTitle')!.value;
    form.append('title', CaseModelTitle);
    const Description = this.stokKart.get('Description')!.value;
    form.append('description', Description);
    form.append('barcode', this.stokKart.get('Barcode')!.value);
    const Cost = this.stokKart.get('Cost')!.value;
    form.append('cost', Cost);
    const Quantity = this.stokKart.get('Quantity')!.value;
    form.append('quantity', Quantity);
    form.append('satisFiyat1', this.stokKart.get('SatisFiyat1')!.value);
    form.append('satisFiyat2', this.stokKart.get('SatisFiyat2')!.value);
    form.append('satisFiyat3', this.stokKart.get('SatisFiyat3')!.value);
    form.append('satisFiyat4', this.stokKart.get('SatisFiyat4')!.value);

    this.stockCartService.generateStockKart(form).subscribe(
      (response) => {
        this.stockCartService.getStockCartsHistory().subscribe(
          (stockKarts) => {
            this.stockKarts = stockKarts;
          },
          (error) => {
            console.error('Error fetching stock carts: ', error);
          }
        );
        // Başarılı olduğunda bir başarılı mesajı gösterebilirsiniz
        this.messageService.add({
          severity: 'info',
          summary: 'Oluşturuldu',
          detail: 'Stock Cart Başarıyla Oluşturuldu',
        });
      },
      (error) => {
        console.error('Error generating Stock Kart: ', error);
        // Hata olduğunda bir hata mesajı gösterebilirsiniz
        this.messageService.add({
          severity: 'error',
          summary: 'Oluşturulamadı',
          detail: 'Stock Cart Oluşturulamadı',
          life: 3000,
        });
      }
    );
  }

  private deleteStockKartsForIdsNotSent() {
    const ids = this.selectedStockKarts.map((stockKart) => stockKart.id);
    this.stockCartService.deleteStockKartsForIdsNotSent(ids).subscribe(
      (response) => {
        // Stok kart tablosunu yeniden yükleyebilirsiniz
        this.stockCartService.getStockCartsHistory().subscribe(
          (stockKarts) => {
            this.stockKarts = stockKarts;
          },
          (error) => {
            console.error('Error fetching stock carts: ', error);
          }
        );
        // Başarılı bir şekilde silindiğine dair bir mesaj gösterebilirsiniz
        this.messageService.add({
          severity: 'info',
          summary: 'Düzenlendi',
          detail: 'Stock Kartlar başarıyla düzenlendi!',
        });
      },
      (error) => {
        console.error('Error deleting Stock Karts: ', error);
        // Hata olduğunda bir hata mesajı gösterebilirsiniz
        this.messageService.add({
          severity: 'error',
          summary: 'Düzenlenemedi',
          detail: 'Stock Kartlar düzenlenemedi!',
          life: 3000,
        });
      }
    );
  }

  private transferDb() {
    this.stockCartService.transferDb().subscribe(
      (response) => {
        // Stok kart tablosunu yeniden yükleyebilirsiniz
        this.stockCartService.getStockCartsHistory().subscribe(
          (stockKarts) => {
            this.stockKarts = stockKarts;
          },
          (error) => {
            console.error('Error fetching stock carts: ', error);
          }
        );
        // Başarılı bir şekilde transfer edildiğine dair bir mesaj gösterebilirsiniz
        this.messageService.add({
          severity: 'info',
          summary: 'Transfer Edildi',
          detail: 'Stock Kartlar başarıyla veri tabanına kaydedildi!',
        });
      },
      (error) => {
        console.error('Error transferring Stock Karts: ', error);
        // Hata olduğunda bir hata mesajı gösterebilirsiniz
        this.messageService.add({
          severity: 'error',
          summary: 'Transfer Edilemedi',
          detail: 'Stock Kartlar veri tabanına kaydedilemedi!',
          life: 3000,
        });
      }
    );
  }

  downloadIkas() {
    const apiUrl: string = environment.apiUrl;
    window.location.href = `${apiUrl}/stock-carts/export-stock-cart-history-ikas`;
  }
  downloadMyor() {
    const apiUrl: string = environment.apiUrl;
    window.location.href = `${apiUrl}/stock-carts/export-stock-cart-history-myor`;
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Stok Kart tablosundaki tüm veriler kaydedilecektir. Devam etmek istiyor musunuz? Bu işlem geri alınamaz!',
      header: 'Bilgilendirme',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.transferDb();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Reddedildi',
          detail: 'İşlem reddedildi!',
          life: 3000,
        });
      },
    });
  }

  confirm3(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Seçtiğiniz ürünlerin stok kartları oluşturulacaktır. Seçmediğiniz ürünlerin stok kartları silinecektir. Devam etmek istiyor musunuz? Bu işlem geri alınamaz!',
      header: 'Bilgilendirme',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteStockKartsForIdsNotSent();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Reddedildi',
          detail: 'İşlem reddedildi!',
          life: 3000,
        });
      },
    });
  }
}
