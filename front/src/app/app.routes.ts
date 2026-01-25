import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FormDemandeComponent } from './features/demande-rv/form-demande/form-demande.component';
import { ListDemandeComponent } from './features/demande-rv/list-demande/list-demande.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: DashboardComponent },
//   { path: 'demande-rv', component: FormDemandeComponent },
{ path: 'demandes-rv', component: ListDemandeComponent },
{ path: 'demandes-rv/new', component: FormDemandeComponent },

//   { path: 'patients', loadComponent: () => import('./features/patients/list/patients-list.component').then(m => m.PatientsListComponent) },
//   { path: 'patients/create', loadComponent: () => import('./features/patients/create/create-patient.component').then(m => m.CreatePatientComponent) },
{ path: 'mes-rv', loadComponent: () => import('./features/mes-rv/mes-rv.component').then(m => m.MesRvComponent) },
  { path: 'settings', loadComponent: () => import('./shared/placeholder/placeholder.component').then(m => m.PlaceholderComponent) },
{ path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },

  { path: '', pathMatch: 'full', redirectTo: 'login' },

  
];
