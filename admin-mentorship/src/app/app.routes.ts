import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];
