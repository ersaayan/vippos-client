import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneratorComponent } from './components/generator/generator.component';

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
    ],
  },
];
