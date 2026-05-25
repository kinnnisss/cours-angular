import type { RvStatus } from './rv-status.type';

export interface RendezVous {
  id: string;
  patientId: number | string;
  patientNom: string;
  specialite: string;
  medecin: string;
  dateIso: string;
  heure: string;
  lieu: string;
  notes?: string;
  status: RvStatus;
}

export type RendezVousApi = RendezVous;
