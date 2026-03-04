import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, combineLatest, map, shareReplay, takeUntil } from 'rxjs';

import { RdvCardComponent } from '@shared/ui/rdv-card/rdv-card.component';

import type { RendezVous } from '@features/private/mes-rv/model/rendezvous.model';
import type { RvStatus } from '@features/private/mes-rv/model/rv-status.type';

import { MesRvService } from '@features/private/mes-rv/service/mes-rv.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mes-rv',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RdvCardComponent, AsyncPipe,RouterLink],
  templateUrl: './mes-rv.component.html',
  styleUrl: './mes-rv.component.css'
})
export class MesRvComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  readonly rdvs$ = new BehaviorSubject<RendezVous[]>([]);

  private readonly filterStatusSubject = new BehaviorSubject<'' | RvStatus>('');
  private readonly filterMonthSubject = new BehaviorSubject<'' | string>('');
  private readonly filterMedecinSubject = new BehaviorSubject<string>('');

  readonly filterStatus$ = this.filterStatusSubject.asObservable();
  readonly filterMonth$ = this.filterMonthSubject.asObservable();
  readonly filterMedecin$ = this.filterMedecinSubject.asObservable();

  readonly months$ = this.rdvs$.pipe(
    map(list => {
      const set = new Set(list.map(r => r.dateIso.slice(0, 7)));
      const values = Array.from(set).sort();
      return values.map(v => ({ value: v, label: this.monthLabel(v) }));
    }),
    shareReplay(1)
  );

  readonly filteredRdvs$ = combineLatest([
    this.rdvs$,
    this.filterStatus$,
    this.filterMonth$,
    this.filterMedecin$,
  ]).pipe(
    map(([list, status, month, medecin]) => {
      const med = medecin.trim().toLowerCase();

      return list.filter(r => {
        const okStatus = !status || r.status === status;
        const okMonth = !month || r.dateIso.startsWith(month);
        const okMed = !med || r.medecin.toLowerCase().includes(med);
        return okStatus && okMonth && okMed;
      });
    }),
    shareReplay(1)
  );

  constructor(private readonly mesRvService: MesRvService) {}

  ngOnInit(): void {
  this.mesRvService.refreshAll()
  .pipe(takeUntil(this.destroy$))
  .subscribe(list => this.rdvs$.next(list));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStatusChange(v: '' | RvStatus) {
    this.filterStatusSubject.next(v);
  }

  onMonthChange(v: '' | string) {
    this.filterMonthSubject.next(v);
  }

  onMedecinChange(v: string) {
    this.filterMedecinSubject.next(v);
  }

  monthLabel(yyyyMm: string): string {
    const [y, m] = yyyyMm.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(d);
  }

  headerClass(status: RvStatus): string {
    switch (status) {
      case 'confirme': return 'rv-header confirme';
      case 'realise': return 'rv-header realise';
      case 'en_attente': return 'rv-header en_attente';
      case 'annule': return 'rv-header annule';
    }
  }

  badgeClass(status: RvStatus): string {
    switch (status) {
      case 'confirme': return 'badge bg-success';
      case 'realise': return 'badge bg-info text-dark';
      case 'en_attente': return 'badge bg-warning text-dark';
      case 'annule': return 'badge bg-danger';
    }
  }

  statusLabel(status: RvStatus): string {
    switch (status) {
      case 'confirme': return 'Confirmé';
      case 'realise': return 'Réalisé';
      case 'en_attente': return 'En attente';
      case 'annule': return 'Annulé';
    }
  }

  statusIcon(status: RvStatus): string {
    switch (status) {
      case 'confirme': return 'bi bi-check-circle';
      case 'realise': return 'bi bi-check2-all';
      case 'en_attente': return 'bi bi-clock';
      case 'annule': return 'bi bi-x-circle';
    }
  }

  cancelRv(rv: RendezVous): void {
    this.mesRvService.cancel(rv.id).subscribe({
      next: (ok) => {
        if (!ok) alert('Impossible d’annuler ce rendez-vous.');
      }
    });
  }

  downloadReport(rv: RendezVous): void {
    console.log('Rapport (mock) pour', rv.id);
    alert(`Rapport (mock) généré pour ${rv.id}`);
  }
}
