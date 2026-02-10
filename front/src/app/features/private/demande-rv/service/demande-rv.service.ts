import { Injectable } from '@angular/core';
import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeRvCreate } from '@features/private/demande-rv/model/demande-create.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';

import { DEMANDES_MOCK } from '@mock';



@Injectable({ providedIn: 'root' })
export class DemandeRvService {
  private readonly demandes: DemandeRv[] = [...(DEMANDES_MOCK as unknown as DemandeRv[])];

  getAll(): DemandeRv[] {
    return [...this.demandes];
  }

  getById(id: string): DemandeRv | null {
    return this.demandes.find(d => d.id === id) ?? null;
  }

  create(payload: DemandeRvCreate): DemandeRv {
    const newDemande: DemandeRv = {
      id: this.nextId(),
      patientId: payload.patientId,
      patientNom: payload.patientNom,
      specialite: payload.specialite,
      date: payload.date,
      heure: payload.heure,
      status: 'en_attente',
    };

    this.demandes.unshift(newDemande);
    return newDemande;
  }

  updateStatus(id: string, status: DemandeStatus): boolean {
    const d = this.demandes.find(x => x.id === id);
    if (!d) return false;
    d.status = status;
    return true;
  }

  private nextId(): string {
    const nums = this.demandes
      .map(d => Number(d.id.replace('DEM-', '')))
      .filter(n => !Number.isNaN(n));

    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `DEM-${String(next).padStart(4, '0')}`;
  }
}
