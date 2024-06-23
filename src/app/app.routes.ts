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
import { ExportDashboardForAdminComponent } from './components/export-dashboard-for-admin/export-dashboard-for-admin.component';
import { LandingComponent } from './components/landing/landing.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'home',
        component: LandingComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'USER', 'MANUFACTURER'] },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN'] },
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
        data: { allowedRoles: ['ADMIN', 'USER', 'MANUFACTURER'] },
      },
      {
        path: 'generator',
        component: GeneratorComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'USER'] },
        pathMatch: 'full',
      },
      {
        path: 'brand',
        component: BrandModelComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'USER'] },
        pathMatch: 'full',
      },
      {
        path: 'model',
        component: ModelVariationComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'USER'] },
        pathMatch: 'full',
      },
      {
        path: 'barcode',
        component: BarcodeComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'USER'] },
        pathMatch: 'full',
      },
      {
        path: 'image',
        component: ImageComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'USER'] },
        pathMatch: 'full',
      },
      {
        path: 'database',
        component: DatabaseComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'USER'] },
        pathMatch: 'full',
      },
      {
        path: 'export',
        component: ExportDashboardComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'MANUFACTURER'] },
        pathMatch: 'full',
      },
      {
        path: 'export-admin',
        component: ExportDashboardForAdminComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN'] },
        pathMatch: 'full',
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN'] },
        pathMatch: 'full',
      },
      { path: 'access-denied', component: AccessDeniedComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
