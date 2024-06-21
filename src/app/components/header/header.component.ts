import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  menuItems: any[] = [];
  userRole!: any;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.setMenuItems();
  }
  setMenuItems(): void {
    const allMenuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        route: ['/home'],
        allowedRoles: ['ADMIN', 'USER', 'MANUFACTURER']
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        route: ['/dashboard'],
        allowedRoles: ['ADMIN']
      },
      {
        label: 'Stock Cart Generator',
        icon: 'pi pi-check-square',
        route: ['/generator'],
        allowedRoles: ['ADMIN', 'USER']
      },
      {
        label: 'View & Download Stock Cart',
        icon: 'pi pi-database',
        route: ['/database'],
        allowedRoles: ['ADMIN', 'USER']
      },
      {
        label: 'Case Brand Model Generator',
        icon: 'pi pi-folder-plus',
        allowedRoles: ['ADMIN', 'USER'],
        items: [
          {
            label: 'Case Brand Generator',
            route: ['/brand'],
            allowedRoles: ['ADMIN', 'USER'],
          },
          {
            label: 'Case Model Generator',
            route: ['/model'],
            allowedRoles: ['ADMIN', 'USER'],
          },
        ],
      },
      {
        label: 'Editor',
        icon: 'pi pi-pencil',
        allowedRoles: ['ADMIN', 'USER'],
        items: [
          {
            label: 'Barcode Editor',
            icon: 'pi pi-barcode',
            route: ['/barcode'],
            allowedRoles: ['ADMIN', 'USER'],
          },
          {
            label: 'Image Editor',
            icon: 'pi pi-image',
            route: ['/image'],
            allowedRoles: ['ADMIN', 'USER'],
          },
        ],
      },
      {
        label: 'Export Dashboard',
        icon: 'pi pi-upload',
        route: ['/export'],
        allowedRoles: ['MANUFACTURER']
      },
      {
        label: 'Export Dashboard For Admin',
        icon: 'pi pi-upload',
        route: ['/export-admin'],
        allowedRoles: ['ADMIN']
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        function: this.authService.logout,
        route: ['/login'],
        allowedRoles: ['ADMIN', 'USER', 'MANUFACTURER']
      }
    ];

    this.menuItems = allMenuItems.filter(item => item.allowedRoles.includes(this.userRole));
  }
}
