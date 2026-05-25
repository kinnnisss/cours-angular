import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, shareReplay, switchMap } from 'rxjs';

import { PatientService } from '@core/service/patient.service';
import type { PatientModel } from '@core/model/patient.model';
import { PaginationComponent } from '@shared/ui/pagination/pagination.component';

type SortKey = 'numero' | 'nom' | 'prenom' | 'tel';

@Component({
  selector: 'app-liste-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './liste-patients.component.html',
  styleUrl: './liste-patients.component.css'
})
export class ListePatientsComponent {
  private readonly patientService = inject(PatientService);

  private readonly searchSubject = new BehaviorSubject<string>('');
  private readonly sortKeySubject = new BehaviorSubject<SortKey>('nom');
  private readonly sortDirSubject = new BehaviorSubject<'asc' | 'desc'>('asc');
  private readonly currentPageSubject = new BehaviorSubject<number>(1);

  readonly currentPage$ = this.currentPageSubject.asObservable();

  readonly pageData$ = combineLatest([
    this.searchSubject,
    this.sortKeySubject,
    this.sortDirSubject,
    this.currentPage$,
  ]).pipe(
    switchMap(([search, sortBy, sortDir, page]) =>
      this.patientService.getPage({
        search,
        sortBy,
        sortDir,
        page: page - 1,
        size: 5,
      })
    ),
    shareReplay(1)
  );

  onSearchChange(v: string): void {
    this.searchSubject.next(v);
    this.currentPageSubject.next(1);
  }

  setSort(key: SortKey): void {
    const currentKey = this.sortKeySubject.value;
    const currentDir = this.sortDirSubject.value;

    if (currentKey === key) {
      this.sortDirSubject.next(currentDir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKeySubject.next(key);
      this.sortDirSubject.next('asc');
    }
    this.currentPageSubject.next(1);
  }

  goToPage(p: number): void {
    this.currentPageSubject.next(p);
  }

  sortIcon(key: SortKey): string {
    if (this.sortKeySubject.value !== key) return 'bi bi-arrow-down-up';
    return this.sortDirSubject.value === 'asc'
      ? 'bi bi-sort-alpha-down'
      : 'bi bi-sort-alpha-up';
  }

  trackById(_: number, p: PatientModel): number {
    return p.id;
  }
}
