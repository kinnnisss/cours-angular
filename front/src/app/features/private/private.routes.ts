// src/app/features/private/private.routes.ts
import { Routes } from '@angular/router';

import { DashboardComponent } from '@features/private/dashboard/dashboard.component';
import { FormDemandeComponent } from '@features/private/demande-rv/form-demande/form-demande.component';
import { ListDemandeComponent } from '@features/private/demande-rv/list-demande/list-demande.component';
import { MesRvComponent } from '@features/private/mes-rv/mes-rv.component';
import { MesInformationsComponent } from '@features/private/mes-informations/mes-informations.component';
import { PlaceholderComponent } from '@shared/placeholder/placeholder.component';
import { ListePatientsComponent } from '@features/private/secretaire/liste-patients/liste-patients.component';
import { DossierMedicalComponent } from '@features/private/dossier-medical/dossier-medical.component';
import { roleGuard } from '@core/guard/role.guard';
import { VoirDemandeComponent } from '@features/private/demande-rv/voir-demande/voir-demande.component';
import { ListDemandesSecretaireComponent } from '@features/private/secretaire/list-demandes/list-demandes.component';
import { RdvDetailsComponent } from '@features/private/mes-rv/rdv-details/rdv-details.component';
import { RdvConsultationComponent } from '@features/private/mes-rv/rdv-consultation/rdv-consultation.component';
import { RdvOrdonnanceComponent } from '@features/private/mes-rv/rdv-ordonnance/rdv-ordonnance.component';

export const privateRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },

  // Demandes RV
  { path: 'demandes-rv', component: ListDemandeComponent },
  { path: 'demandes-rv/new', component: FormDemandeComponent },
  { path: 'demandes-rv/:id', component: VoirDemandeComponent },


  { path: 'mes-rv', component: MesRvComponent },
  { path: 'mes-rv/:id', component: RdvDetailsComponent },
{ path: 'mes-rv/:id/consultation', component: RdvConsultationComponent },
{ path: 'mes-rv/:id/ordonnance', component: RdvOrdonnanceComponent },
  { path: 'mes-informations', component: MesInformationsComponent },
  { path: 'mon-dossier', component: DossierMedicalComponent },


  {
    path: 'secretaire/patients',
    component: ListePatientsComponent,
    canActivate: [roleGuard(['secretaire', 'admin'])],
  },

  { path: 'secretaire/demandes', component: ListDemandesSecretaireComponent },
  { path: 'settings', component: PlaceholderComponent },

  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];