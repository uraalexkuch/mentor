import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
