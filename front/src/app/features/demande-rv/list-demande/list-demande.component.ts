import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../shared/ui/pagination/pagination.component';


import { DEMANDES_MOCK, DemandeRv, DemandeStatus } from '../../../shared/mock-data';

@Component({
  selector: 'app-list-demande',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink,PaginationComponent],
  templateUrl: './list-demande.component.html',
  styleUrl: './list-demande.component.css'
})
export class ListDemandeComponent {
  demandes: DemandeRv[] = DEMANDES_MOCK;

  filterStatus: '' | DemandeStatus = '';
  filterSpecialite: '' | string = '';

  pageSize = 5;
  currentPage = 1;

  get specialites(): string[] {
    const set = new Set(this.demandes.map(d => d.specialite));
    return Array.from(set).sort();
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
    if (p < 1 || p > this.totalPages) return;
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

  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
