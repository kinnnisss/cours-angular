import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PaginationComponent } from '@shared/ui/pagination/pagination.component';
import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';
import { SecurityService } from '@core/service/security.service';
import { DemandeRvService } from '@features/private/demande-rv/service/demande-rv.service';

@Component({
  selector: 'app-list-demande',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './list-demande.component.html',
  styleUrl: './list-demande.component.css'
})
export class ListDemandeComponent implements OnInit, OnDestroy {

  demandes: DemandeRv[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly demandeRvService: DemandeRvService,
              private readonly securityService: SecurityService
              
  ) {}

ngOnInit(): void {
  const user = this.securityService.getCurrentUser();
  if (!user?.id) {
    this.demandes = [];
    return;
  }

  this.demandeRvService.getByPatientId(user.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((list) => {
      this.demandes = list;
    });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterStatus: '' | DemandeStatus = '';
  filterSpecialite: '' | string = '';

  pageSize = 5;
  currentPage = 1;

  get specialites(): string[] {
    return Array.from(new Set(this.demandes.map(d => d.specialite))).sort();
  }

  get filteredDemandes(): DemandeRv[] {
    return this.demandes.filter(d => {
      const okStatus = !this.filterStatus || d.status === this.filterStatus;
      const okSpec = !this.filterSpecialite || d.specialite === this.filterSpecialite;
      return okStatus && okSpec;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDemandes.length / this.pageSize));
  }

  get pagedDemandes(): DemandeRv[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDemandes.slice(start, start + this.pageSize);
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  goToPage(p: number): void {
    this.currentPage = p;
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
