import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';

interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-ordercheck',
  standalone: true,
  imports: [ZXingScannerModule, CardModule, CommonModule, TableModule],
  templateUrl: './ordercheck.component.html',
  styleUrl: './ordercheck.component.css',
})
export class OrdercheckComponent {
  constructor(private http: HttpClient) {}
  sipariskalemleri!: any[];

  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];
  qrResultString!: any[];
  cols!: Column[];
  ngOnInit() {
    this.cols = [
      { field: 'StokKodu', header: 'Stok Kodu' },
      { field: 'TOTAL', header: 'Toplam' },
    ];
  }
  onCodeResult(resultString: string) {
    console.log('Result: ', resultString);
    this.http
      .get<any>(
        `https://pos.vipcase.com.tr/flask/siparis_kalemleri/${resultString}`
      )
      .subscribe((data) => {
        this.qrResultString = data;
      });
  }
}
