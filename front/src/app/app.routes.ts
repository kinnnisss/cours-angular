import { Routes } from '@angular/router';

import { DashboardComponent } from '@features/private/dashboard/dashboard.component';
import { FormDemandeComponent } from './features/private/demande-rv/form-demande/form-demande.component';
import { ListDemandeComponent } from './features/private/demande-rv/list-demande/list-demande.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'public/login' },

  {
    path: 'public',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/public/login/login.component').then(m => m.LoginComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
  {
    path: 'private',
    component: PrivateLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'demandes-rv', component: ListDemandeComponent },
      { path: 'demandes-rv/new', component: FormDemandeComponent },

      {
        path: 'mes-rv',
        loadComponent: () =>
          import('./features/private/mes-rv/mes-rv.component').then(m => m.MesRvComponent),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./shared/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
      },

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  { path: '**', redirectTo: 'public/login' },
];
