import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, shareReplay, switchMap } from 'rxjs';

import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';

import { DemandeRvService } from '@features/private/demande-rv/service/demande-rv.service';
import { PaginationComponent } from '@shared/ui/pagination/pagination.component';
import { VoirComponent } from '@shared/ui/voir/voir.component';

@Component({
  selector: 'app-list-demandes',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, FormsModule, PaginationComponent, VoirComponent],
  templateUrl: './list-demandes.component.html',
  styleUrl: './list-demandes.component.css',
})
export class ListDemandesSecretaireComponent {
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);
  private readonly filterStatusSubject = new BehaviorSubject<'' | DemandeStatus>('');
  private readonly filterSpecialiteSubject = new BehaviorSubject<string>('');
  private readonly searchPatientSubject = new BehaviorSubject<string>('');
  private readonly currentPageSubject = new BehaviorSubject<number>(1);

  readonly filterStatus$ = this.filterStatusSubject.asObservable();
  readonly filterSpecialite$ = this.filterSpecialiteSubject.asObservable();
  readonly searchPatient$ = this.searchPatientSubject.asObservable();
  readonly currentPage$ = this.currentPageSubject.asObservable();

  readonly pageSize = 8;

  readonly pageData$ = combineLatest([
    this.refreshSubject,
    this.filterStatus$,
    this.filterSpecialite$,
    this.searchPatient$,
    this.currentPage$,
  ]).pipe(
    switchMap(([, status, specialite, patientQuery, page]) =>
      this.demandeRvService.getPage({
        status,
        specialite,
        patientQuery,
        page: page - 1,
        size: this.pageSize,
      })
    ),
    shareReplay(1)
  );

  readonly pagedDemandes$ = this.pageData$.pipe(
    map(page => page.items),
    shareReplay(1)
  );

  readonly specialites$ = this.refreshSubject.pipe(
    switchMap(() => this.demandeRvService.getPage({ page: 0, size: 100 })),
    map(page => Array.from(new Set(page.items.map(d => d.specialite))).sort()),
    shareReplay(1)
  );

  readonly totalPages$ = this.pageData$.pipe(
    map(page => Math.max(1, page.totalPages)),
    shareReplay(1)
  );

  constructor(private readonly demandeRvService: DemandeRvService) {}

  reload(): void {
    this.refreshSubject.next();
  }

  goToPage(p: number): void {
    this.currentPageSubject.next(p);
  }

  onStatusChange(v: '' | DemandeStatus): void {
    this.filterStatusSubject.next(v);
    this.currentPageSubject.next(1);
  }

  onSpecialiteChange(v: string): void {
    this.filterSpecialiteSubject.next(v);
    this.currentPageSubject.next(1);
  }

  onSearchPatientChange(v: string): void {
    this.searchPatientSubject.next(v);
    this.currentPageSubject.next(1);
  }

  badgeLabel(s: DemandeStatus): string {
    if (s === 'en_attente') return 'En attente';
    if (s === 'accepte') return 'Acceptee';
    return 'Refusee';
  }

  badgeClass(s: DemandeStatus): string {
    if (s === 'en_attente') return 'badge bg-warning text-dark';
    if (s === 'accepte') return 'badge bg-success';
    return 'badge bg-danger';
  }

  badgeIcon(s: DemandeStatus): string {
    if (s === 'en_attente') return 'bi bi-hourglass-split';
    if (s === 'accepte') return 'bi bi-check-circle';
    return 'bi bi-x-circle';
  }

  accept(d: DemandeRv): void {
    this.demandeRvService.updateStatus(d.id, 'accepte').subscribe({
      next: () => this.reload(),
      error: () => alert('Impossible d accepter la demande.'),
    });
  }

  refuse(d: DemandeRv): void {
    this.demandeRvService.updateStatus(d.id, 'refuse').subscribe({
      next: () => this.reload(),
      error: () => alert('Impossible de refuser la demande.'),
    });
  }
}
