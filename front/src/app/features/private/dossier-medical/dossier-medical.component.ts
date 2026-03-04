import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, of, switchMap, catchError, map, shareReplay } from 'rxjs';
import type { RendezVousApi,RendezVous } from '@features/private/mes-rv/model/rendezvous.model';
import { SecurityService } from '@core/service/security.service';
import type { PatientApi } from '@core/model/patient.model';
import { DossierMedicalService} from '@features/private/dossier-medical/service/dossier-medical.service';
import type { DemandeRvApi } from '@features/private/demande-rv/model/demande-rv.model';

@Component({
  selector: 'app-dossier-medical',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterLink, DatePipe],
  templateUrl: './dossier-medical.component.html',
  styleUrl: './dossier-medical.component.css',
})
export class DossierMedicalComponent implements OnInit {
  private readonly security = inject(SecurityService);
  private readonly dossierService = inject(DossierMedicalService);

  loading$ = new BehaviorSubject(true);
  error$ = new BehaviorSubject('');

  patient$ = new BehaviorSubject<PatientApi | null>(null);
  demandes$ = new BehaviorSubject<DemandeRvApi[]>([]);
  rdvs$ = new BehaviorSubject<RendezVousApi[]>([]);

  resume$ = combineLatest([this.demandes$, this.rdvs$]).pipe(
    map(([demandes, rdvs]) => ({
      demandesTotal: demandes.length,
      demandesEnAttente: demandes.filter(d => d.status === 'en_attente').length,
      rdvsTotal: rdvs.length,
      rdvsAVenir: rdvs.filter(r => r.status === 'confirme' || r.status === 'en_attente').length,
    })),
    shareReplay(1)
  );

  ngOnInit(): void {
    const user = this.security.getCurrentUser();
    if (!user?.id) {
      this.loading$.next(false);
      this.error$.next('Utilisateur non connecté.');
      return;
    }

    this.loading$.next(true);
    this.error$.next('');

    this.dossierService.getPatientByUserId(user.id).pipe(
      switchMap((patient) => {
        this.patient$.next(patient);

        if (!patient?.id) {
          this.loading$.next(false);
          this.error$.next('Profil patient introuvable.');
          return of(null);
        }

        return combineLatest([
          this.dossierService.getDemandesByPatientId(patient.id),
          this.dossierService.getRdvsByPatientId(patient.id),
        ]).pipe(
          map(([demandes, rdvs]) => {
            this.demandes$.next(demandes ?? []);
            this.rdvs$.next((rdvs ?? []).slice().sort((a, b) => b.dateIso.localeCompare(a.dateIso)));
            return true;
          })
        );
      }),
      catchError((err) => {
        console.error(err);
        this.error$.next('Erreur lors du chargement du dossier médical.');
        return of(null);
      })
    ).subscribe(() => this.loading$.next(false));
  }

  badgeClassDemande(status: DemandeRvApi['status']): string {
    switch (status) {
      case 'en_attente': return 'bg-warning text-dark';
      case 'accepte': return 'bg-success';
      case 'refuse': return 'bg-danger';
    }
  }

  badgeClassRdv(status: RendezVousApi['status']): string {
    switch (status) {
      case 'confirme': return 'bg-success';
      case 'realise': return 'bg-secondary';
      case 'en_attente': return 'bg-warning text-dark';
      case 'annule': return 'bg-danger';
    }
  }

  safe(v: any): string {
    return (v === null || v === undefined || v === '') ? '—' : String(v);
  }
}