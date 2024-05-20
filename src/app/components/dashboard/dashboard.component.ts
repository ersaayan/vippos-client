import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  chartData: any;

  chartOptions: any;

  ngOnInit() {
    this.initChart();
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
          data: [6300.51, 846, 10200, 16700, 17200, 22800],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--green-700'),
          borderColor: documentStyle.getPropertyValue('--green-700'),
          tension: 0.4,
        },
        {
          label: 'Bugün',
          data: [5600.55, 1300, 13700],
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
}
