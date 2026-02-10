import { Routes } from '@angular/router';

import { DashboardComponent } from '@features/private/dashboard/dashboard.component';
import { FormDemandeComponent } from '@features/private/demande-rv/form-demande/form-demande.component';
import { ListDemandeComponent } from '@features/private/demande-rv/list-demande/list-demande.component';
import { PublicLayoutComponent } from '@layouts/public-layout/public-layout.component';
import { PrivateLayoutComponent } from '@layouts/private-layout/private-layout.component';
import { PlaceholderComponent } from '@shared/placeholder/placeholder.component';
import { MesRvComponent } from '@features/private/mes-rv/mes-rv.component';
import { LoginComponent } from '@features/public/login/login.component';
import { isConnectGuard } from '@core/guard/is-connect.guard';
import { CreerPatientComponent } from '@features/creer-patient/creer-patient.component';
import { MesInformationsComponent } from '@features/private/mes-informations/mes-informations.component';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'public/login' },

  {
    path: 'public',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {path: 'creer-patient', component: CreerPatientComponent}
    ],
  },

  {
    path: 'private',
    component: PrivateLayoutComponent,
    canActivate: [isConnectGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'demandes-rv', component: ListDemandeComponent },
      { path: 'demandes-rv/new', component: FormDemandeComponent },
      { path: 'mes-rv', component: MesRvComponent },
      { path: 'settings', component: PlaceholderComponent },
      { path: 'mes-informations', component: MesInformationsComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  { path: '**', redirectTo: 'public/login' },
];
