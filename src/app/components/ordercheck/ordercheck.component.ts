import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
@Component({
  selector: 'app-ordercheck',
  standalone: true,
  imports: [ZXingScannerModule],
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
}
