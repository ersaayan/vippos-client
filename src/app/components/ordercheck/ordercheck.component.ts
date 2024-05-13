import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-ordercheck',
  standalone: true,
  imports: [ZXingScannerModule, CardModule, CommonModule],
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
  qrResultString!: string;

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
