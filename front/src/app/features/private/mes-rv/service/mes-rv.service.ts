import { Injectable } from '@angular/core';
import type { RendezVous } from '../model/rendezvous.model';
import type { RvStatus } from '../model/rv-status.type';

import { RDVS_MOCK } from '@mock';

@Injectable({ providedIn: 'root' })
export class MesRvService {
  private readonly rdvs: RendezVous[] = [...(RDVS_MOCK as unknown as RendezVous[])];

  getAll(): RendezVous[] {
    return [...this.rdvs];
  }

  cancel(id: string): boolean {
    const rv = this.rdvs.find(r => r.id === id);
    if (!rv) return false;

    if (rv.status === 'annule' || rv.status === 'realise') return false;

    rv.status = 'annule';
    return true;
  }

  updateStatus(id: string, status: RvStatus): boolean {
    const rv = this.rdvs.find(r => r.id === id);
    if (!rv) return false;
    rv.status = status;
    return true;
  }
}
