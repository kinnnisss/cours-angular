import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import type { RendezVous } from '../../../features/private/mes-rv/model/rendezvous.model';
import type { RvStatus } from '../../../features/private/mes-rv/model/rv-status.type';

@Component({
  selector: 'app-rdv-card',
  standalone: true,
  imports: [NgIf, DatePipe, RouterLink],
  templateUrl: './rdv-card.component.html',
  styleUrl: './rdv-card.component.css'
})
export class RdvCardComponent {
  @Input({ required: true }) rv!: RendezVous;

  @Input() detailsLinkBase: string = '/mes-rv';

  @Output() cancel = new EventEmitter<RendezVous>();
  @Output() report = new EventEmitter<RendezVous>();

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

  canCancel(): boolean {
    return this.rv.status !== 'annule' && this.rv.status !== 'realise';
  }

  canReport(): boolean {
    return this.rv.status === 'realise';
  }

  onCancel(): void {
    if (!this.canCancel()) return;
    this.cancel.emit(this.rv);
  }

  onReport(): void {
    if (!this.canReport()) return;
    this.report.emit(this.rv);
  }
}
