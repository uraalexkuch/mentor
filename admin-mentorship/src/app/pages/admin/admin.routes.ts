import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'participants',
        loadComponent: () => import('./participants-registry/participants-registry.component').then(m => m.ParticipantsRegistryComponent)
      },
      {
        path: 'certificates',
        loadComponent: () => import('./certificate-registry/certificate-registry.component').then(m => m.CertificateRegistryComponent)
      },
      {
        path: 'consultations',
        loadComponent: () => import('./consultations-list/consultations-list.component').then(m => m.ConsultationsListComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
