import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, of, shareReplay, switchMap } from 'rxjs';

import { PaginationComponent } from '@shared/ui/pagination/pagination.component';
import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';
import { SecurityService } from '@core/service/security.service';
import { DemandeRvService } from '@features/private/demande-rv/service/demande-rv.service';
import { PatientService } from '@core/service/patient.service';
import type { PatientApi } from '@core/model/patient.model';
import { VoirComponent } from '@shared/ui/voir/voir.component';

@Component({
  selector: 'app-list-demande',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, PaginationComponent, AsyncPipe, VoirComponent],
  templateUrl: './list-demande.component.html',
  styleUrl: './list-demande.component.css'
})
export class ListDemandeComponent implements OnInit {
  private readonly filterStatusSubject = new BehaviorSubject<'' | DemandeStatus>('');
  private readonly filterSpecialiteSubject = new BehaviorSubject<string>('');
  private readonly patientIdSubject = new BehaviorSubject<number | null>(null);
  private readonly currentPageSubject = new BehaviorSubject<number>(1);

  readonly filterStatus$ = this.filterStatusSubject.asObservable();
  readonly filterSpecialite$ = this.filterSpecialiteSubject.asObservable();
  readonly patientId$ = this.patientIdSubject.asObservable();
  readonly currentPage$ = this.currentPageSubject.asObservable();

  readonly pageSize = 5;

  readonly pageData$ = combineLatest([
    this.patientId$,
    this.filterStatus$,
    this.filterSpecialite$,
    this.currentPage$,
  ]).pipe(
    switchMap(([patientId, status, specialite, page]) => {
      if (!patientId) {
        return of({
          items: [] as DemandeRv[],
          page: 0,
          size: this.pageSize,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
        });
      }

      return this.demandeRvService.getPage({
        patientId,
        status,
        specialite,
        page: page - 1,
        size: this.pageSize,
      });
    }),
    shareReplay(1)
  );

  readonly pagedDemandes$ = this.pageData$.pipe(
    map(page => page.items),
    shareReplay(1)
  );

  readonly specialites$ = this.patientId$.pipe(
    switchMap(patientId => {
      if (!patientId) {
        return of({
          items: [] as DemandeRv[],
          page: 0,
          size: 100,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
        });
      }

      return this.demandeRvService.getPage({
        patientId,
        page: 0,
        size: 100,
      });
    }),
    map(page => Array.from(new Set(page.items.map(d => d.specialite))).sort()),
    shareReplay(1)
  );

  readonly totalPages$ = this.pageData$.pipe(
    map(page => Math.max(1, page.totalPages)),
    shareReplay(1)
  );

  constructor(
    private readonly demandeRvService: DemandeRvService,
    private readonly securityService: SecurityService,
    private readonly patientService: PatientService
  ) {}

  ngOnInit(): void {
    const user = this.securityService.getCurrentUser();
    if (!user?.id) {
      this.patientIdSubject.next(null);
      return;
    }

    this.patientService.getByUserId(user.id).subscribe((patient: PatientApi | null) => {
      this.patientIdSubject.next(patient?.id ?? null);
      this.currentPageSubject.next(1);
    });
  }

  onStatusChange(v: '' | DemandeStatus): void {
    this.filterStatusSubject.next(v);
    this.currentPageSubject.next(1);
  }

  onSpecialiteChange(v: string): void {
    this.filterSpecialiteSubject.next(v);
    this.currentPageSubject.next(1);
  }

  goToPage(p: number): void {
    this.currentPageSubject.next(p);
  }

  badgeClass(status: DemandeStatus): string {
    switch (status) {
      case 'en_attente': return 'bg-warning text-dark';
      case 'accepte': return 'bg-success';
      case 'refuse': return 'bg-danger';
    }
  }

  badgeIcon(status: DemandeStatus): string {
    switch (status) {
      case 'en_attente': return 'bi bi-clock-history';
      case 'accepte': return 'bi bi-check-circle';
      case 'refuse': return 'bi bi-x-circle';
    }
  }

  badgeLabel(status: DemandeStatus): string {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'accepte': return 'Acceptee';
      case 'refuse': return 'Refusee';
    }
  }
}
