// src/app/features/private/private.routes.ts
import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FormDemandeComponent } from './demande-rv/form-demande/form-demande.component';
import { ListDemandeComponent } from './demande-rv/list-demande/list-demande.component';
import { MesRvComponent } from './mes-rv/mes-rv.component';
import { MesInformationsComponent } from './mes-informations/mes-informations.component';
import { PlaceholderComponent } from '@shared/placeholder/placeholder.component';
import { ListePatientsComponent } from './secretaire/liste-patients/liste-patients.component';

import { roleGuard } from '@core/guard/role.guard';
import { VoirDemandeComponent } from './demande-rv/voir-demande/voir-demande.component';
import { ListDemandesSecretaireComponent } from './secretaire/list-demandes/list-demandes.component';

export const privateRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },

  // Demandes RV
  { path: 'demandes-rv', component: ListDemandeComponent },
  { path: 'demandes-rv/new', component: FormDemandeComponent },
  { path: 'demandes-rv/:id', component: VoirDemandeComponent },


  { path: 'mes-rv', component: MesRvComponent },
  { path: 'mes-informations', component: MesInformationsComponent },

  {
    path: 'secretaire/patients',
    component: ListePatientsComponent,
    canActivate: [roleGuard(['secretaire', 'admin'])],
  },

  { path: 'secretaire/demandes', component: ListDemandesSecretaireComponent },
  { path: 'settings', component: PlaceholderComponent },

  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];