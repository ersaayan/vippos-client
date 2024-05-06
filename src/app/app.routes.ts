import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { DatabaseComponent } from './components/database/database.component';
import { BarcodeComponent } from './components/barcode/barcode.component';
import { ImageComponent } from './components/image/image.component';

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
        component: HomeComponent,
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
        path: 'image',
        component: ImageComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
    ],
  },
];
