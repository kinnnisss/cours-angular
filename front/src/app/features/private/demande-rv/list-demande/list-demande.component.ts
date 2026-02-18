import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, shareReplay ,switchMap,of} from 'rxjs';

import { PaginationComponent } from '@shared/ui/pagination/pagination.component';
import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';
import { SecurityService } from '@core/service/security.service';
import { DemandeRvService } from '@features/private/demande-rv/service/demande-rv.service';
import { PatientService } from '@core/service/patient.service';
import type { PatientApi } from '@core/model/patient.model';
@Component({
  selector: 'app-list-demande',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, PaginationComponent, AsyncPipe],
  templateUrl: './list-demande.component.html',
  styleUrl: './list-demande.component.css'
})
export class ListDemandeComponent implements OnInit {

  private readonly filterStatusSubject = new BehaviorSubject<'' | DemandeStatus>('');
  private readonly filterSpecialiteSubject = new BehaviorSubject<string>('');

  readonly filterStatus$ = this.filterStatusSubject.asObservable();
  readonly filterSpecialite$ = this.filterSpecialiteSubject.asObservable();

  pageSize = 5;
  private readonly currentPageSubject = new BehaviorSubject<number>(1);
  readonly currentPage$ = this.currentPageSubject.asObservable();

  readonly demandes$ = new BehaviorSubject<DemandeRv[]>([]);

  readonly specialites$ = this.demandes$.pipe(
    map(list => Array.from(new Set(list.map(d => d.specialite))).sort()),
    shareReplay(1)
  );

  readonly filteredDemandes$ = combineLatest([
    this.demandes$,
    this.filterStatus$,
    this.filterSpecialite$,
  ]).pipe(
    map(([list, status, spec]) =>
      list.filter(d => {
        const okStatus = !status || d.status === status;
        const okSpec = !spec || d.specialite === spec;
        return okStatus && okSpec;
      })
    ),
    shareReplay(1)
  );

  readonly totalPages$ = this.filteredDemandes$.pipe(
    map(list => Math.max(1, Math.ceil(list.length / this.pageSize))),
    shareReplay(1)
  );

  readonly pagedDemandes$ = combineLatest([
    this.filteredDemandes$,
    this.currentPage$
  ]).pipe(
    map(([list, page]) => {
      const start = (page - 1) * this.pageSize;
      return list.slice(start, start + this.pageSize);
    }),
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
    this.demandes$.next([]);
    return;
  }

this.patientService.getByUserId(user.id).pipe(
  switchMap((patient: PatientApi | null) => {
    if (!patient?.id) return of([]);
    return this.demandeRvService.getByPatientId((patient.id));
  })
).subscribe(list => {
  this.demandes$.next(list);
  this.currentPageSubject.next(1);
});
}
  onStatusChange(v: '' | DemandeStatus) {
    this.filterStatusSubject.next(v);
    this.currentPageSubject.next(1);
  }

  onSpecialiteChange(v: string) {
    this.filterSpecialiteSubject.next(v);
    this.currentPageSubject.next(1);
  }

  goToPage(p: number) {
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
      case 'accepte': return 'Acceptée';
      case 'refuse': return 'Refusée';
    }
  }
}