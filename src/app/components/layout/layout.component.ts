import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    RippleModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  items: MenuItem[] | undefined;
  constructor(private router: Router) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Stock Cart Generator',
        icon: 'pi pi-home',
        route: ['/home'],
      },
      {
        label: 'View and Download Database',
        icon: 'pi pi-cloud-download',
        route: ['/database'],
      },
      {
        label: 'Edit Database',
        icon: 'pi pi-database',
        route: ['/barcode'],
      },
      {
        label: 'Product Image Editor',
        icon: 'pi pi-images',
        route: ['/image'],
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        route: ['/dashboard'],
      },
    ];
  }
}
