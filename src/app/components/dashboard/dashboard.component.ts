import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MeterGroupModule } from 'primeng/metergroup';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { SplitterModule } from 'primeng/splitter';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    MeterGroupModule,
    DataViewModule,
    TagModule,
    ChartModule,
    SplitterModule,
    TableModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  haftaninEnCokSatanUrunleri!: any[];

  gununEnCokSatanUrunu: any;

  haftalikToplamSiparisSayisi: any;

  gunlukToplamSiparisSayisi: any;

  gunlukToplamKargolananSiparisSayisi: any;

  haftalikToplamSatisSayisi: any;

  gunlukToplamSatisSayisi: any;

  haftalikToplamCiro: any;

  gunlukToplamCiro: any;

  dünSatısVeri: number[] = [];

  bugünSatısVeri: number[] = [];

  data: any;

  tablo: any;

  options: any;

  cols!: Column[];

  düntoplamMiktarlar: number[] = [];
  bugüntoplamMiktarlar: number[] = [];

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.getDünSatısVeri();
    this.getBugünSatısVeri();
    this.getHaftaninEnCokSatanUrunleri();
    this.getGununEnCokSatanUrunu();
    //this.getHaftalikToplamSiparisSayisi();
    this.getGunlukToplamSiparisSayisi();
    //this.getGunlukToplamKargolananSiparisSayisi();
    //this.getHaftalikToplamSatisSayisi();
    this.getGunlukToplamSatisSayisi();
    //this.getHaftalikToplamCiro();
    this.getGunlukToplamCiro();
    this.cols = [
      { field: 'StokKodu', header: 'Stok Kodu' },
      { field: 'TOTAL', header: 'Toplam' },
    ];
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.tablo = {
      labels: [
        '00.00-04.00',
        '04.00-08.00',
        '08.00-12.00',
        '12.00-16.00',
        '16.00-20.00',
        '20.00-00.00',
      ],
      datasets: [
        {
          label: 'Bugün',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          tension: 0.4,
          data: this.bugünSatısVeri,
        },
        {
          label: 'Dün',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
          data: this.dünSatısVeri,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
    setInterval(() => {
      this.getDünSatısVeri();
      this.getBugünSatısVeri();
      this.getHaftaninEnCokSatanUrunleri();
      this.getGununEnCokSatanUrunu();
      this.getGunlukToplamSiparisSayisi();
      this.getGunlukToplamSatisSayisi();
      this.getGunlukToplamCiro();
    }, 300000);
  }

  getHaftaninEnCokSatanUrunleri() {
    this.http
      .get<any[]>('https://pos.vipcase.com.tr/flask/haftanin_en_cok_satan_urunleri')
      .subscribe((data) => {
        this.haftaninEnCokSatanUrunleri = data;
      });
  }

  getGununEnCokSatanUrunu() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/gunun_en_cok_satan_urunu')
      .subscribe((data) => {
        this.gununEnCokSatanUrunu = data;
      });
  }

  getHaftalikToplamSiparisSayisi() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/haftalik_toplam_siparis_sayisi')
      .subscribe((data) => {
        this.haftalikToplamSiparisSayisi = data;
      });
  }

  getGunlukToplamSiparisSayisi() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/gunluk_toplam_siparis_sayisi')
      .subscribe((data) => {
        this.gunlukToplamSiparisSayisi = data.TOTAL;
      });
  }

  getGunlukToplamKargolananSiparisSayisi() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/gunluk_toplam_kargolanan_siparis_sayisi')
      .subscribe((data) => {
        this.gunlukToplamKargolananSiparisSayisi = data;
      });
  }

  getHaftalikToplamSatisSayisi() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/haftalik_toplam_satis_sayisi')
      .subscribe((data) => {
        this.haftalikToplamSatisSayisi = data;
      });
  }

  getGunlukToplamSatisSayisi() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/gunluk_toplam_satis_sayisi')
      .subscribe((data) => {
        this.gunlukToplamSatisSayisi = data.TOTAL;
      });
  }

  getHaftalikToplamCiro() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/haftalik_toplam_ciro')
      .subscribe((data) => {
        this.haftalikToplamCiro = data;
      });
  }

  getGunlukToplamCiro() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/gunluk_toplam_ciro')
      .subscribe((data) => {
        this.gunlukToplamCiro = data;
      });
  }

  getDünSatısVeri() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/dün-yapılan-satışlar-grafiği')
      .subscribe((data) => {
        for (const veri of data) {
          this.dünSatısVeri.push(veri.Toplam_Miktar);
        }
        console.log(this.dünSatısVeri);
      });
  }

  getBugünSatısVeri() {
    this.http
      .get<any>('https://pos.vipcase.com.tr/flask/bugün-yapılan-satışlar-grafiği')
      .subscribe((data) => {
        for (const veri of data) {
          this.bugünSatısVeri.push(veri.Toplam_Miktar);
        }
        console.log(this.bugünSatısVeri);
      });
  }
}
