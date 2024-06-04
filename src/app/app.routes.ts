import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { BrandModelComponent } from './components/brand/brand.component';
import { BarcodeComponent } from './components/barcode/barcode.component';
import { ImageComponent } from './components/image/image.component';
import { DatabaseComponent } from './components/database/database.component';
import { ModelVariationComponent } from './components/model-variation/model-variation.component';
import { ExportDashboardComponent } from './components/export-dashboard/export-dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HeaderComponent,
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
        path: 'generator',
        component: GeneratorComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: 'brand',
        component: BrandModelComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: 'model',
        component: ModelVariationComponent,
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
      {
        path: 'database',
        component: DatabaseComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
    ],
  },
];
