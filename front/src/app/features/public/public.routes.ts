// src/app/features/public/public.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CreerPatientComponent } from './creer-patient/creer-patient.component';

export const publicRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'creer-patient', component: CreerPatientComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];