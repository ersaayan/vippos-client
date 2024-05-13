import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { DatabaseComponent } from './components/database/database.component';
import { BarcodeComponent } from './components/barcode/barcode.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdercheckComponent } from './components/ordercheck/ordercheck.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'database',
        component: DatabaseComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: 'barcode',
        component: BarcodeComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: 'scanner',
        component: OrdercheckComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: 'generator',
        component: HomeComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
    ],
  },
];
