import { Component, Input } from '@angular/core';
import type { RvStatus } from '@features/private/mes-rv/model/rv-status.type';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="badgeClass">
      <i class="bi" [class]="badgeIcon"></i> {{ label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: RvStatus;

  get badgeClass(): string {
    switch (this.status) {
      case 'confirme': return 'bg-success';
      case 'realise': return 'bg-secondary';
      case 'en_attente': return 'bg-warning text-dark';
      case 'annule': return 'bg-danger';
    }
  }
  get badgeIcon(): string {
    switch (this.status) {
      case 'confirme': return 'bi-check-circle';
      case 'realise': return 'bi-clipboard-check';
      case 'en_attente': return 'bi-clock-history';
      case 'annule': return 'bi-x-circle';
    }
  }
  get label(): string {
    switch (this.status) {
      case 'confirme': return 'Confirmé';
      case 'realise': return 'Réalisé';
      case 'en_attente': return 'En attente';
      case 'annule': return 'Annulé';
    }
  }
}