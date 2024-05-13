import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ordercheck',
  standalone: true,
  imports: [ZXingScannerModule, CardModule, CommonModule],
  templateUrl: './ordercheck.component.html',
  styleUrl: './ordercheck.component.css',
})
export class OrdercheckComponent {
  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];
  qrResultString!: string;

  clearResult(): void {
    this.qrResultString = '';
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }
}
