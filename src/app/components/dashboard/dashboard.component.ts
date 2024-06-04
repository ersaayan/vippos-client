import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SkeletonModule } from 'primeng/skeleton';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    MenuModule,
    TableModule,
    ButtonModule,
    StyleClassModule,
    PanelMenuModule,
    SkeletonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  apiUrl = environment.flaskUrl;

  chartData: any;

  chartOptions: any;

  dünSatısVeri: number[] = [];

  bugünSatısVeri: number[] = [];

  haftaninEnCokSatanUrunleri!: any[];

  gunlukToplamCiro: any;

  dunToplamCiro: any;

  dunToplamSiparisSayisi: any;

  gunlukToplamSiparisSayisi: any;

  gunlukToplamSatisSayisi: any;

  dunToplamSatisSayisi: any;

  gununEnCokSatanUrunu: any;

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getDünSatısVeri();
    this.getBugünSatısVeri();
    this.sleep(1000).then(() => {
      console.log('10 saniye bekledikten sonra çalıştı.');
      this.initChart();
    });
    this.getHaftaninEnCokSatanUrunleri();
    this.getGunlukToplamCiro();
    this.getDunToplamCiro();
    this.getDunToplamSiparisSayisi();
    this.getGunlukToplamSiparisSayisi();
    this.getGunlukToplamSatisSayisi();
    this.getDunToplamSatisSayisi();
    this.getGununEnCokSatanUrunu();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
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
          label: 'Dün',
          data: this.dünSatısVeri,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--green-700'),
          borderColor: documentStyle.getPropertyValue('--green-700'),
          tension: 0.4,
        },
        {
          label: 'Bugün',
          data: this.bugünSatısVeri,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--blue-600'),
          borderColor: documentStyle.getPropertyValue('--blue-600'),
          tension: 0.4,
        },
      ],
    };

    this.chartOptions = {
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
  }

  public colorClasses = [
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
    'text-pink-500',
    'text-indigo-500',
    'text-gray-500',
    'text-teal-500',
    'text-lime-500',
  ];

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getDünSatısVeri() {
    this.http
      .get<any>(`${this.apiUrl}/flask/dun-yapılan-satışlar-grafiği`)
      .subscribe((data) => {
        for (const veri of data) {
          this.dünSatısVeri.push(veri.Toplam_Ciro);
        }
      });
  }

  async getBugünSatısVeri() {
    this.http
      .get<any>(`${this.apiUrl}/flask/bugün-yapılan-satışlar-grafiği`)
      .subscribe((data) => {
        for (const veri of data) {
          this.bugünSatısVeri.push(veri.Toplam_Ciro);
        }
      });
  }

  getHaftaninEnCokSatanUrunleri() {
    this.http
      .get<any[]>(
        'https://pos.vipcase.com.tr/flask/haftanin_en_cok_satan_urunleri'
      )
      .subscribe((data) => {
        this.haftaninEnCokSatanUrunleri = data;
        console.log(this.haftaninEnCokSatanUrunleri);
      });
  }

  getGunlukToplamCiro() {
    this.http
      .get(`${this.apiUrl}/flask/gunluk_toplam_ciro`)
      .subscribe((data) => {
        this.gunlukToplamCiro = data;
      });
  }

  getDunToplamCiro() {
    this.http
      .get<any>(`${this.apiUrl}/flask/dun_toplam_ciro`)
      .subscribe((data) => {
        this.dunToplamCiro = data;
      });
  }

  getDunToplamSiparisSayisi() {
    this.http
      .get<any>(`${this.apiUrl}/flask/dun_toplam_siparis_sayisi`)
      .subscribe((data) => {
        this.dunToplamSiparisSayisi = data.TOTAL;
      });
  }

  getGunlukToplamSiparisSayisi() {
    this.http
      .get<any>(`${this.apiUrl}/flask/gunluk_toplam_siparis_sayisi`)
      .subscribe((data) => {
        this.gunlukToplamSiparisSayisi = data.TOTAL;
      });
  }

  getGunlukToplamSatisSayisi() {
    this.http
      .get<any>(`${this.apiUrl}/flask/gunluk_toplam_satis_sayisi`)
      .subscribe((data) => {
        this.gunlukToplamSatisSayisi = data.TOTAL;
      });
  }

  getDunToplamSatisSayisi() {
    this.http
      .get<any>(`${this.apiUrl}/flask/dun_toplam_satis_sayisi`)
      .subscribe((data) => {
        this.dunToplamSatisSayisi = data.TOTAL;
      });
  }

  getGununEnCokSatanUrunu() {
    this.http
      .get<any>(`${this.apiUrl}/flask/gunun_en_cok_satan_urunu`)
      .subscribe((data) => {
        this.gununEnCokSatanUrunu = data;
      });
  }
}
