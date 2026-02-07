import { Component } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { RdvCardComponent } from '@shared/ui/rdv-card/rdv-card.component';

import type { RendezVous } from './model/rendezvous.model';
import type { RvStatus } from './model/rv-status.type';

import { mesRvService } from './service/mes-rv.instance';

@Component({
  selector: 'app-mes-rv',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, DatePipe, RdvCardComponent],
  templateUrl: './mes-rv.component.html',
  styleUrl: './mes-rv.component.css'
})
export class MesRvComponent {

  rdvs: RendezVous[] = mesRvService.getAll();

  filterStatus: '' | RvStatus = '';
  filterMonth: '' | string = '';
  filterMedecin = '';

  get months(): { value: string; label: string }[] {
    const set = new Set(this.rdvs.map(r => r.dateIso.slice(0, 7)));
    const values = Array.from(set).sort();
    return values.map(v => ({ value: v, label: this.monthLabel(v) }));
  }

  get filteredRdvs(): RendezVous[] {
    const med = this.filterMedecin.trim().toLowerCase();

    return this.rdvs.filter(r => {
      const okStatus = !this.filterStatus || r.status === this.filterStatus;
      const okMonth = !this.filterMonth || r.dateIso.startsWith(this.filterMonth);
      const okMed = !med || r.medecin.toLowerCase().includes(med);
      return okStatus && okMonth && okMed;
    });
  }

  onFilterChange(): void {
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
    mesRvService.cancel(rv.id);

    this.rdvs = mesRvService.getAll();
  }

  downloadReport(rv: RendezVous): void {
    console.log('Rapport (mock) pour', rv.id);
    alert(`Rapport (mock) généré pour ${rv.id}`);
  }
}
