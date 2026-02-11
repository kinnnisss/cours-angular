import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, startWith, tap } from 'rxjs';

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

  search$ = this.searchSubject.asObservable();
  sortKey$ = this.sortKeySubject.asObservable();
  sortDir$ = this.sortDirSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  filtered$ = combineLatest([
    this.patientService.getAll(),
    this.search$.pipe(startWith('')),
    this.sortKey$,
    this.sortDir$,
  ]).pipe(
    map(([patients, search, sortKey, sortDir]) => {
      const q = search.trim().toLowerCase();

      let filtered = patients;
      if (q) {
        filtered = patients.filter(p => {
          const hay = `${p.numero} ${p.nom} ${p.prenom} ${p.tel}`.toLowerCase();
          return hay.includes(q);
        });
      }

      const sorted = [...filtered].sort((a, b) => {
        const av = String(a[sortKey] ?? '').toLowerCase();
        const bv = String(b[sortKey] ?? '').toLowerCase();
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });

      return sorted;
    }),
    tap(() => this.goToPage(1))
  );

  paged$ = combineLatest([this.filtered$, this.currentPage$]).pipe(
    map(([list, page]) => {
      const total = Math.max(1, Math.ceil(list.length / this.pageSize));
      this.totalPages = total;
      this.currentPage = Math.min(Math.max(1, page), total);
      const start = (this.currentPage - 1) * this.pageSize;
      return list.slice(start, start + this.pageSize);
    })
  );

  onSearchChange(v: string): void {
    this.searchSubject.next(v);
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
  }

  goToPage(p: number): void {
    this.currentPageSubject.next(p);
    this.currentPage = p;
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
