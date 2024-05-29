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
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;
  constructor(private router: Router) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: ['/home'],
      },
      {
        label: 'Stock Cart Generator',
        icon: 'pi pi-check-square',
        route: ['/generator'],
      },
      {
        label: 'View & Download Stock Cart',
        icon: 'pi pi-database',
        route: ['/database'],
      },
      {
        label: 'Case Brand Generator',
        icon: 'pi pi-folder-plus',
        route: ['/brand'],
      },
      {
        label: 'Case Model Generator',
        icon: 'pi pi-folder-plus',
        route: ['/model'],
      },
      {
        label: 'Barcode Editor',
        icon: 'pi pi-barcode',
        route: ['/barcode'],
      },
      {
        label: 'Export Dashboard',
        icon: 'pi pi-upload',
        route: ['/export-dashboard'],
      },
    ];
  }
}
